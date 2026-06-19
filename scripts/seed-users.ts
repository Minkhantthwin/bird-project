/**
 * Seed script — creates Admin and Instructor users in Supabase.
 *
 * Prerequisites:
 *   1. Add SUPABASE_SERVICE_ROLE_KEY to .env.local
 *      (Get it from: Supabase Dashboard → Project Settings → API → service_role secret)
 *   2. Run: npx tsx --env-file=.env.local scripts/seed-users.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!serviceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required in .env.local');
  console.error('   Get it from: Supabase Dashboard → Project Settings → API → service_role secret');
  process.exit(1);
}

// Service role client (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface SeedUser {
  email: string;
  password: string;
  fullName: string;
  role: 'Admin' | 'Instructor';
}

const seedUsers: SeedUser[] = [
  {
    email: 'admin@attandance.com',
    password: 'Admin123!',
    fullName: 'Club Admin',
    role: 'Admin',
  },
  {
    email: 'instructor@attandance.com',
    password: 'Teach123!',
    fullName: 'Club Instructor',
    role: 'Instructor',
  },
];

async function seed() {
  for (const u of seedUsers) {
    console.log(`\n🔧 Processing: ${u.email} (${u.role})`);

    // 1. Create auth user (skip if exists)
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,           // skip email confirmation for seed
        user_metadata: { full_name: u.fullName },
      });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`   ⚠️  Auth user already exists — looking up existing...`);
      } else {
        console.error(`   ❌ Auth error: ${authError.message}`);
        continue;
      }
    }

    const userId = authData?.user?.id;
    if (!userId) {
      // Try to find existing user by email
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users?.find(
        (eu) => eu.email === u.email,
      );
      if (!existing) {
        console.error('   ❌ Could not find or create user');
        continue;
      }
      console.log(`   ✅ Found existing user: ${existing.id}`);
      await updateProfileRole(existing.id, u);
      continue;
    }

    console.log(`   ✅ Auth user created: ${userId}`);

    // 2. The auto-profile trigger already created a profiles row with Member role.
    //    Update it to the correct role.
    await updateProfileRole(userId, u);
  }

  console.log('\n🎉 Seed complete!');
}

async function updateProfileRole(userId: string, u: SeedUser) {
  // Get role ID
  const { data: roleData, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', u.role)
    .single();

  if (roleError || !roleData) {
    console.error(`   ❌ Role "${u.role}" not found: ${roleError?.message}`);
    return;
  }

  // Update profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role_id: roleData.id, full_name: u.fullName })
    .eq('id', userId);

  if (updateError) {
    console.error(`   ❌ Profile update failed: ${updateError.message}`);
    return;
  }

  console.log(`   ✅ Role set to "${u.role}"`);
}

seed().catch(console.error);
