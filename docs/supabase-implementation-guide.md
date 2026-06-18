# Supabase Implementation Guide for `bird-project`

This guide explains how to replace the current dummy backend in this project with Supabase in a way that fits the existing Next.js 16 app structure.

## Goal

Use Supabase for:

- Authentication
- PostgreSQL database
- Row Level Security (RLS)
- Optional storage and realtime later

This repo already has a good backend seam:

- `lib/auth/actions.ts` handles login/register/logout server actions
- `lib/auth/service.ts` switches between dummy mode and a future real backend
- `lib/auth/session.ts` resolves the current user
- `lib/data-service.ts` is the data access layer for the app
- `proxy.ts` already protects routes

That means we do not need to rewrite the app all at once. We can replace the backend layer step by step.

## Recommended Architecture

Use this split:

- `auth.users` for authentication records managed by Supabase Auth
- `public.profiles` for app-level user data such as `full_name` and `role_id`
- `public.roles` for `Admin`, `Instructor`, `Member`
- `public.artist_records`, `attendance`, `injuries`, `posts`, `comments`, `reactions` for business data

## Important Schema Change

Do **not** keep `password_hash` in your app-level `users` table.

Supabase Auth already stores and manages password data inside `auth.users`. For this project, the cleanest design is:

- Replace your current public `User` table with a `public.profiles` table
- Make `profiles.id` reference `auth.users(id)`

This avoids confusion between:

- Supabase auth user
- Your app profile record

## Suggested Table Design

### `public.roles`

- `id uuid primary key default gen_random_uuid()`
- `name text unique not null`
- `description text`
- `created_at timestamptz not null default now()`

### `public.profiles`

- `id uuid primary key references auth.users(id) on delete cascade`
- `role_id uuid not null references public.roles(id)`
- `email text unique not null`
- `full_name text not null`
- `created_at timestamptz not null default now()`

### `public.artist_records`

- Keep your current shape, but rename to snake_case
- `user_id` should reference `public.profiles(id)`

### `public.attendance`

- `artist_record_id` references `public.artist_records(id)`

### `public.injuries`

- `artist_record_id` references `public.artist_records(id)`

### `public.posts`

- `user_id` references `public.profiles(id)`

### `public.comments`

- `post_id` references `public.posts(id)`
- `user_id` references `public.profiles(id)`

### `public.reactions`

- `post_id` references `public.posts(id)`
- `user_id` references `public.profiles(id)`
- add a unique constraint on `(post_id, user_id)`

## Implementation Order

Implement Supabase in this order:

1. Create the Supabase project and environment variables.
2. Add Supabase packages and client helpers.
3. Replace auth first.
4. Create the real database schema and RLS policies.
5. Replace `lib/data-service.ts` function-by-function.
6. Turn off dummy mode after the real paths work.

This order keeps the risk low and lets you test each layer separately.

## Step 1: Create the Supabase Project

1. Create a Supabase project in the dashboard.
2. Copy the project URL.
3. Copy the publishable key.
4. Keep the secret key server-only if you later need admin operations.

## Step 2: Add Dependencies

Install the current recommended packages:

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

Optional but strongly recommended for schema migrations:

```bash
npx supabase init
```

If you want the full local Supabase workflow, install the Supabase CLI first.

## Step 3: Add Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key
DUMMY_DATA_ENABLED=false
```

Notes:

- `NEXT_PUBLIC_*` vars are safe for the browser.
- `SUPABASE_SECRET_KEY` must never be used in client components.
- Keep `DUMMY_DATA_ENABLED=true` until you finish auth if you want a gradual rollout.

Also add the same values in Netlify:

- `Site configuration -> Environment variables`

## Step 4: Configure Auth URLs in Supabase

In Supabase Auth settings, add:

- Local site URL: `http://localhost:3000`
- Production site URL: your Netlify domain
- Redirect URLs for login/signup confirmation flows

Examples:

- `http://localhost:3000/auth/callback`
- `https://your-site.netlify.app/auth/callback`

## Step 5: Create Supabase Client Helpers

Create this folder:

```text
lib/supabase/
```

Recommended files:

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/proxy.ts`

Use them for:

- browser access from client components
- server access from server components, server actions, and route handlers
- auth session refresh inside `proxy.ts`

For this project, update the existing root `proxy.ts` so it uses Supabase session refresh instead of the current manual `auth-token` cookie logic.

## Step 6: Replace Manual Cookie Auth

Right now the app:

- writes its own `auth-token` cookie in `lib/auth/actions.ts`
- reads that cookie in `lib/auth/session.ts`
- redirects in `proxy.ts`

With Supabase SSR, replace that flow with Supabase-managed auth cookies.

### What to change

#### `lib/auth/actions.ts`

Replace manual cookie writes with Supabase auth calls:

- Register: `supabase.auth.signUp(...)`
- Login: `supabase.auth.signInWithPassword(...)`
- Logout: `supabase.auth.signOut()`

#### `lib/auth/service.ts`

Use Supabase instead of dummy-data lookup when dummy mode is off.

Suggested mapping:

- `register()` creates the auth user, then ensures a `profiles` row exists
- `login()` authenticates with Supabase
- `mapUserToSessionUser()` should map from `profiles + roles`, not dummy users

#### `lib/auth/session.ts`

Use the server Supabase client to resolve the logged-in user.

For authorization checks, trust Supabase claims or server-validated user data, not a hand-written cookie value.

## Step 7: Create the Database Schema

Best practice for this project:

1. Keep schema in migration files.
2. Use the Supabase dashboard only for quick inspection.
3. Commit migration files into git.

Recommended CLI flow:

```bash
supabase migration new create_core_tables
supabase db reset
```

Later, after linking the remote project:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

Also create:

- `supabase/seed.sql` for local seed data

That is a good place to move sample data from `lib/dummy-data.ts`.

## Step 8: Add a Profile-Creation Strategy

You need every auth user to get a matching profile row.

You have two solid options:

### Option A: Create profile in your register server action

Flow:

1. `signUp()` the auth user
2. insert into `public.profiles`

This is the easiest place to start.

### Option B: Add a database trigger on `auth.users`

Flow:

1. auth user is created
2. trigger inserts a default `profiles` row

This is more automatic, but slightly more advanced.

For this project, I recommend **Option A first** because it is easier to debug while you are still replacing the dummy backend.

## Step 9: Add Row Level Security

Enable RLS on every exposed app table.

At minimum:

- `profiles`
- `artist_records`
- `attendance`
- `injuries`
- `posts`
- `comments`
- `reactions`

Start with simple policies, then tighten them.

### Good starter policy model

- Members can read their own profile
- Members can read their own attendance and injury records
- Members can read posts/comments/reactions
- Members can create their own posts/comments/reactions
- Instructors can manage attendance and injuries
- Admins can manage everything

### Role strategy

The cleanest pattern here is:

1. Store the user role in `public.profiles.role_id`
2. Join to `public.roles`
3. Write RLS policies that check the authenticated user id with `auth.uid()`

## Step 10: Replace `lib/data-service.ts`

This file is the main migration point from dummy data to Supabase.

Replace it in layers:

### First pass

- `getUsers()` -> `profiles`
- `getUserById()` -> `profiles`
- `getRoles()` -> `roles`

### Second pass

- `getArtistRecords()`
- `getAttendanceRecords()`
- `getInjuries()`

### Third pass

- `getPosts()`
- `getComments()`
- `getReactions()`
- `getPostsWithMeta()`

For `getPostsWithMeta()`, you can either:

- query posts and related tables separately on the server
- use foreign table selects in Supabase
- create a SQL view for feed data if the query becomes messy

For this app, a SQL view is a good option if the dashboard feed grows more complex.

## Step 11: Update Types

Refactor `lib/types.ts` to match the real database:

- remove `password_hash` from the app-level user shape
- rename `User` to `Profile` if you adopt `public.profiles`
- keep table field names aligned with database column names

Suggested rename path:

- `User` -> `Profile`
- `getUsers()` -> `getProfiles()`

You can still keep UI labels as "users" if that reads better in the app.

## Step 12: Update Route Protection

Your current `proxy.ts` already protects non-public routes.

Keep that file, but change its responsibility:

- stop checking a custom `auth-token`
- let Supabase refresh the session cookie
- keep route-level redirects there

Important for this project:

- `proxy.ts` should stay lightweight
- do not put heavy database logic in it
- do authorization again inside server actions and server-side data access

## Step 13: Add the Auth Callback Route

If you use email confirmation or PKCE-based auth flows, add a callback route such as:

```text
app/auth/callback/route.ts
```

Use it to finish the auth flow and redirect the user back into the app after confirmation.

## Step 14: Migrate Dummy Data Carefully

Do not remove `lib/dummy-data.ts` on day one.

Safer rollout:

1. Implement Supabase auth
2. Implement `profiles` and `roles`
3. Implement attendance and injuries
4. Implement posts/comments/reactions
5. Remove dummy mode only after all affected screens work

You can even keep this flag temporarily:

```ts
process.env.DUMMY_DATA_ENABLED === 'true'
```

That makes it easier to compare old and new behavior while you migrate.

## Project-Specific File Plan

These are the files I would expect to change in this repo:

- `lib/auth/actions.ts`
- `lib/auth/service.ts`
- `lib/auth/session.ts`
- `lib/data-service.ts`
- `lib/types.ts`
- `lib/env.ts`
- `proxy.ts`

These are the files I would add:

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/proxy.ts`
- `app/auth/callback/route.ts`
- `supabase/migrations/*`
- `supabase/seed.sql`

## Suggested Phase Plan

### Phase 1: Auth only

- install packages
- add env vars
- add Supabase clients
- update `proxy.ts`
- replace login/register/logout
- verify protected routes

### Phase 2: Core profile data

- create `roles` and `profiles`
- refactor `lib/types.ts`
- replace user/session lookups

### Phase 3: Club data

- add `artist_records`, `attendance`, `injuries`
- replace related reads in `lib/data-service.ts`
- add RLS

### Phase 4: Social feed

- add `posts`, `comments`, `reactions`
- replace feed queries
- add write actions for new posts/comments/reactions

### Phase 5: Cleanup

- move sample records into `supabase/seed.sql`
- remove dummy-only code
- remove old manual cookie assumptions

## Testing Checklist

Test these flows before removing dummy mode:

- register a new user
- confirm email if enabled
- login with email/password
- logout
- access a protected route when logged out
- access a protected route when logged in
- verify role-based route behavior for admin, instructor, and member
- verify attendance/injury records only show to allowed users
- verify posts/comments/reactions follow policy rules

Then run project QA:

```bash
pnpm qa
```

## Recommended First Milestone

If you want the smoothest rollout, make your first milestone only this:

1. Supabase project created
2. env vars added
3. `@supabase/supabase-js` and `@supabase/ssr` installed
4. `proxy.ts` switched to Supabase session refresh
5. login/register/logout working
6. `profiles` table created

Once that milestone works, the rest of the data migration becomes much easier.

## References

- Supabase SSR client setup for Next.js: https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase Next.js quickstart: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Supabase local development and migrations: https://supabase.com/docs/guides/local-development/overview
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase password auth: https://supabase.com/docs/guides/auth/passwords
- Next.js 16 `proxy.ts` docs in this repo: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`

