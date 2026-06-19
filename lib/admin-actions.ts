'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export interface AdminActionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  serverError?: string;
}

const idSchema = z.string().uuid('Invalid record ID');
const roleSchema = z.enum(['Admin', 'Instructor', 'Member']);
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number');
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date');

const userFields = {
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  role: roleSchema,
};

const createUserSchema = z.object({
  ...userFields,
  password: passwordSchema,
});

const updateUserSchema = z.object({
  id: idSchema,
  ...userFields,
  password: z.union([z.literal(''), passwordSchema]),
});

const artistFields = {
  userId: idSchema,
  instructorId: z.union([idSchema, z.literal('')]),
  stageName: z.string().trim().max(100),
  specialty: z.string().trim().max(150),
  joinDate: dateSchema,
};

const createArtistSchema = z.object(artistFields);
const updateArtistSchema = z.object({ id: idSchema, ...artistFields });

const injuryFields = {
  artistRecordId: idSchema,
  incidentDate: dateSchema,
  severity: z.enum(['Minor', 'Moderate', 'Severe']),
  description: z.string().trim().min(3).max(1000),
  status: z.enum(['Recovering', 'Cleared', 'Under Treatment']),
};

const createInjurySchema = z.object(injuryFields);
const updateInjurySchema = z.object({ id: idSchema, ...injuryFields });
const deleteSchema = z.object({ id: idSchema });

async function requireAdmin() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('You are not authorized to perform this action.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('roles(name)')
    .eq('id', user.id)
    .single();
  const relation = profile?.roles as unknown as
    | { name: string }
    | { name: string }[]
    | null;
  const role = Array.isArray(relation) ? relation[0]?.name : relation?.name;

  if (profileError || role !== 'Admin') {
    throw new Error('You are not authorized to perform this action.');
  }

  return user;
}

function values(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function invalid(error: z.ZodError): AdminActionState {
  return {
    errors: Object.fromEntries(
      Object.entries(error.flatten().fieldErrors).filter(
        (entry): entry is [string, string[]] => Boolean(entry[1]),
      ),
    ),
  };
}

function failed(error: unknown): AdminActionState {
  return {
    serverError:
      error instanceof Error ? error.message : 'An unexpected error occurred.',
  };
}

async function getRoleId(role: z.infer<typeof roleSchema>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('roles')
    .select('id')
    .eq('name', role)
    .single();

  if (error || !data) throw new Error(`Unable to find the ${role} role.`);
  return data.id;
}

function refreshAdmin(...paths: string[]) {
  revalidatePath('/admin');
  paths.forEach((path) => revalidatePath(path));
}

export async function createUserAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = createUserSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const supabase = createAdminClient();
    const { fullName, email, password, role } = parsed.data;
    const roleId = await getRoleId(role);
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? 'Unable to create the Auth user.');
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: fullName, email, role_id: roleId })
      .eq('id', data.user.id)
      .select('id')
      .single();

    if (profileError) {
      await supabase.auth.admin.deleteUser(data.user.id);
      throw new Error(`Unable to create the user profile: ${profileError.message}`);
    }

    refreshAdmin('/admin/users');
    return { success: true, message: 'User created.' };
  } catch (error) {
    return failed(error);
  }
}

export async function updateUserAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const session = await requireAdmin();
    const parsed = updateUserSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { id, fullName, email, password, role } = parsed.data;
    if (id === session.id && role !== 'Admin') {
      throw new Error('You cannot remove the Admin role from your own account.');
    }
    const supabase = createAdminClient();
    const roleId = await getRoleId(role);
    const { error: authError } = await supabase.auth.admin.updateUserById(id, {
      email,
      email_confirm: true,
      ...(password ? { password } : {}),
      user_metadata: { full_name: fullName },
    });

    if (authError) throw new Error(authError.message);

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: fullName, email, role_id: roleId })
      .eq('id', id)
      .select('id')
      .single();

    if (profileError) throw new Error(profileError.message);

    refreshAdmin('/admin/users', '/admin/artists');
    return { success: true, message: 'User updated.' };
  } catch (error) {
    return failed(error);
  }
}

export async function deleteUserAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const session = await requireAdmin();
    const parsed = deleteSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);
    if (parsed.data.id === session.id) {
      throw new Error('You cannot delete your own signed-in account.');
    }

    const { error } = await createAdminClient().auth.admin.deleteUser(
      parsed.data.id,
    );
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/users', '/admin/artists', '/admin/injuries');
    return { success: true, message: 'User deleted.' };
  } catch (error) {
    return failed(error);
  }
}

export async function createArtistAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = createArtistSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { userId, instructorId, stageName, specialty, joinDate } = parsed.data;
    const { error } = await createAdminClient().from('artist_records').insert({
      user_id: userId,
      instructor_id: instructorId || null,
      stage_name: stageName || null,
      specialty: specialty || null,
      join_date: joinDate,
    });
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/artists');
    return { success: true, message: 'Artist created.' };
  } catch (error) {
    return failed(error);
  }
}

export async function updateArtistAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = updateArtistSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { id, userId, instructorId, stageName, specialty, joinDate } =
      parsed.data;
    const { error } = await createAdminClient()
      .from('artist_records')
      .update({
        user_id: userId,
        instructor_id: instructorId || null,
        stage_name: stageName || null,
        specialty: specialty || null,
        join_date: joinDate,
      })
      .eq('id', id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/artists', '/admin/injuries', '/admin/attendance');
    return { success: true, message: 'Artist updated.' };
  } catch (error) {
    return failed(error);
  }
}

export async function deleteArtistAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = deleteSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { error } = await createAdminClient()
      .from('artist_records')
      .delete()
      .eq('id', parsed.data.id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/artists', '/admin/injuries', '/admin/attendance');
    return { success: true, message: 'Artist deleted.' };
  } catch (error) {
    return failed(error);
  }
}

export async function createInjuryAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = createInjurySchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { artistRecordId, incidentDate, severity, description, status } =
      parsed.data;
    const { error } = await createAdminClient().from('injuries').insert({
      artist_record_id: artistRecordId,
      incident_date: incidentDate,
      severity,
      description,
      status,
    });
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/injuries');
    return { success: true, message: 'Injury created.' };
  } catch (error) {
    return failed(error);
  }
}

export async function updateInjuryAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = updateInjurySchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { id, artistRecordId, incidentDate, severity, description, status } =
      parsed.data;
    const { error } = await createAdminClient()
      .from('injuries')
      .update({
        artist_record_id: artistRecordId,
        incident_date: incidentDate,
        severity,
        description,
        status,
      })
      .eq('id', id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/injuries');
    return { success: true, message: 'Injury updated.' };
  } catch (error) {
    return failed(error);
  }
}

export async function deleteInjuryAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = deleteSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { error } = await createAdminClient()
      .from('injuries')
      .delete()
      .eq('id', parsed.data.id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/injuries');
    return { success: true, message: 'Injury deleted.' };
  } catch (error) {
    return failed(error);
  }
}

// ══════════════════════════════════════════════════════
// Attendance Actions
// ══════════════════════════════════════════════════════

const attendanceFields = {
  artistRecordId: idSchema,
  sessionDate: z.string().min(1, 'Session date is required'),
  status: z.enum(['Present', 'Absent', 'Late']),
  notes: z.string().trim().max(500).optional(),
};

const createAttendanceSchema = z.object(attendanceFields);
const updateAttendanceSchema = z.object({ id: idSchema, ...attendanceFields });

export async function createAttendanceAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = createAttendanceSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { artistRecordId, sessionDate, status, notes } = parsed.data;
    const { error } = await createAdminClient().from('attendance').insert({
      artist_record_id: artistRecordId,
      session_date: sessionDate,
      status,
      notes: notes || null,
    });
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/attendance');
    return { success: true, message: 'Attendance record created.' };
  } catch (error) {
    return failed(error);
  }
}

export async function updateAttendanceAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = updateAttendanceSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { id, artistRecordId, sessionDate, status, notes } = parsed.data;
    const { error } = await createAdminClient()
      .from('attendance')
      .update({
        artist_record_id: artistRecordId,
        session_date: sessionDate,
        status,
        notes: notes || null,
      })
      .eq('id', id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/attendance');
    return { success: true, message: 'Attendance record updated.' };
  } catch (error) {
    return failed(error);
  }
}

export async function deleteAttendanceAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = deleteSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { error } = await createAdminClient()
      .from('attendance')
      .delete()
      .eq('id', parsed.data.id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/attendance');
    return { success: true, message: 'Attendance record deleted.' };
  } catch (error) {
    return failed(error);
  }
}

// ══════════════════════════════════════════════════════
// Post Actions
// ══════════════════════════════════════════════════════

const postFields = {
  userId: idSchema,
  title: z.string().trim().min(1, 'Title is required').max(255),
  body: z.string().trim().min(1, 'Body is required').max(10000),
};

const createPostSchema = z.object(postFields);
const updatePostSchema = z.object({ id: idSchema, ...postFields });

export async function createPostAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = createPostSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { userId, title, body } = parsed.data;
    const { error } = await createAdminClient().from('posts').insert({
      user_id: userId,
      title,
      body,
    });
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/posts');
    return { success: true, message: 'Post created.' };
  } catch (error) {
    return failed(error);
  }
}

export async function updatePostAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = updatePostSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { id, userId, title, body } = parsed.data;
    const { error } = await createAdminClient()
      .from('posts')
      .update({ user_id: userId, title, body })
      .eq('id', id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/posts', '/dashboard');
    return { success: true, message: 'Post updated.' };
  } catch (error) {
    return failed(error);
  }
}

export async function deletePostAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = deleteSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { error } = await createAdminClient()
      .from('posts')
      .delete()
      .eq('id', parsed.data.id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshAdmin('/admin/posts', '/dashboard');
    return { success: true, message: 'Post deleted.' };
  } catch (error) {
    return failed(error);
  }
}
