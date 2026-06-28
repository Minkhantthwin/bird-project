import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const authRoutes = ['/login', '/register'];
const publicRoutes = ['/login', '/register', '/register/verify', '/'];

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh Supabase session (important — keeps cookie fresh)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

  // 1. Public routes — allow through
  if (publicRoutes.includes(normalized)) {
    // Redirect authenticated users away from auth pages
    if (user && authRoutes.includes(normalized)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return supabaseResponse;
  }

  // 2. Static assets — allow
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return supabaseResponse;
  }

  // 3. Unauthenticated → login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Authenticated — allow through (role checks in layouts)
  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
};
