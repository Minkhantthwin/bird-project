'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import type { AdminActionState } from '@/lib/admin-actions';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

const idSchema = z.string().uuid('Invalid record ID');
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date');

const artistFields = {
  userId: idSchema,
  stageName: z.string().trim().max(100),
  specialty: z.string().trim().max(150),
  joinDate: dateSchema,
};

const attendanceFields = {
  artistRecordId: idSchema,
  sessionDate: z.string().min(1, 'Session date is required'),
  status: z.enum(['Present', 'Absent', 'Late']),
  notes: z.string().trim().max(500).optional(),
};

const injuryFields = {
  artistRecordId: idSchema,
  incidentDate: dateSchema,
  severity: z.enum(['Minor', 'Moderate', 'Severe']),
  description: z.string().trim().min(3).max(1000),
  status: z.enum(['Recovering', 'Cleared', 'Under Treatment']),
};

const postFields = {
  title: z.string().trim().min(1, 'Title is required').max(255),
  body: z.string().trim().min(1, 'Body is required').max(10000),
};

const createArtistSchema = z.object(artistFields);
const updateArtistSchema = z.object({ id: idSchema, ...artistFields });
const createAttendanceSchema = z.object(attendanceFields);
const updateAttendanceSchema = z.object({ id: idSchema, ...attendanceFields });
const createInjurySchema = z.object(injuryFields);
const updateInjurySchema = z.object({ id: idSchema, ...injuryFields });
const createPostSchema = z.object(postFields);
const updatePostSchema = z.object({ id: idSchema, ...postFields });
const deleteSchema = z.object({ id: idSchema });

async function requireInstructor() {
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

  if (profileError || role !== 'Instructor') {
    throw new Error('You are not authorized to perform this action.');
  }

  return { supabase, user };
}

async function ensureOwnedArtistRecord(
  artistRecordId: string,
  instructorId: string,
) {
  const { data, error } = await createAdminClient()
    .from('artist_records')
    .select('id')
    .eq('id', artistRecordId)
    .eq('instructor_id', instructorId)
    .single();

  if (error || !data) {
    throw new Error('Artist does not belong to your instructor account.');
  }
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

function refreshInstructor(...paths: string[]) {
  revalidatePath('/instructor');
  revalidatePath('/admin');
  paths.forEach((path) => {
    revalidatePath(path);
  });
}

async function ensureMemberUser(userId: string) {
  const { data, error } = await createAdminClient()
    .from('profiles')
    .select('roles(name)')
    .eq('id', userId)
    .single();

  const relation = data?.roles as unknown as
    | { name: string }
    | { name: string }[]
    | null;
  const role = Array.isArray(relation) ? relation[0]?.name : relation?.name;

  if (error || role !== 'Member') {
    throw new Error('Artists can only be linked to Member users.');
  }
}

export async function createInstructorArtistAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { user } = await requireInstructor();
    const parsed = createArtistSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { userId, stageName, specialty, joinDate } = parsed.data;
    await ensureMemberUser(userId);

    const { error } = await createAdminClient().from('artist_records').insert({
      user_id: userId,
      instructor_id: user.id,
      stage_name: stageName || null,
      specialty: specialty || null,
      join_date: joinDate,
    });
    if (error) throw new Error(error.message);

    refreshInstructor(
      '/instructor/artists',
      '/instructor/attendance',
      '/instructor/injuries',
      '/admin/artists',
    );
    return { success: true, message: 'Artist created.' };
  } catch (error) {
    return failed(error);
  }
}

export async function updateInstructorArtistAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { user } = await requireInstructor();
    const parsed = updateArtistSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { id, userId, stageName, specialty, joinDate } = parsed.data;
    await ensureMemberUser(userId);
    await ensureOwnedArtistRecord(id, user.id);

    const { error } = await createAdminClient()
      .from('artist_records')
      .update({
        user_id: userId,
        instructor_id: user.id,
        stage_name: stageName || null,
        specialty: specialty || null,
        join_date: joinDate,
      })
      .eq('id', id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshInstructor(
      '/instructor/artists',
      '/instructor/attendance',
      '/instructor/injuries',
      '/admin/artists',
    );
    return { success: true, message: 'Artist updated.' };
  } catch (error) {
    return failed(error);
  }
}

export async function deleteInstructorArtistAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { user } = await requireInstructor();
    const parsed = deleteSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);
    await ensureOwnedArtistRecord(parsed.data.id, user.id);

    const { error } = await createAdminClient()
      .from('artist_records')
      .delete()
      .eq('id', parsed.data.id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshInstructor(
      '/instructor/artists',
      '/instructor/attendance',
      '/instructor/injuries',
      '/admin/artists',
    );
    return { success: true, message: 'Artist deleted.' };
  } catch (error) {
    return failed(error);
  }
}

export async function createInstructorAttendanceAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { supabase, user } = await requireInstructor();
    const parsed = createAttendanceSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { artistRecordId, sessionDate, status, notes } = parsed.data;
    await ensureOwnedArtistRecord(artistRecordId, user.id);
    const { error } = await supabase.from('attendance').insert({
      artist_record_id: artistRecordId,
      session_date: sessionDate,
      status,
      notes: notes || null,
    });
    if (error) throw new Error(error.message);

    refreshInstructor('/instructor/attendance');
    return { success: true, message: 'Attendance record created.' };
  } catch (error) {
    return failed(error);
  }
}

export async function updateInstructorAttendanceAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { supabase, user } = await requireInstructor();
    const parsed = updateAttendanceSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { id, artistRecordId, sessionDate, status, notes } = parsed.data;
    await ensureOwnedArtistRecord(artistRecordId, user.id);
    const { error } = await supabase
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

    refreshInstructor('/instructor/attendance');
    return { success: true, message: 'Attendance record updated.' };
  } catch (error) {
    return failed(error);
  }
}

export async function deleteInstructorAttendanceAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { supabase } = await requireInstructor();
    const parsed = deleteSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', parsed.data.id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshInstructor('/instructor/attendance');
    return { success: true, message: 'Attendance record deleted.' };
  } catch (error) {
    return failed(error);
  }
}

export async function createInstructorInjuryAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { supabase, user } = await requireInstructor();
    const parsed = createInjurySchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { artistRecordId, incidentDate, severity, description, status } =
      parsed.data;
    await ensureOwnedArtistRecord(artistRecordId, user.id);
    const { error } = await supabase.from('injuries').insert({
      artist_record_id: artistRecordId,
      incident_date: incidentDate,
      severity,
      description,
      status,
    });
    if (error) throw new Error(error.message);

    refreshInstructor('/instructor/injuries');
    return { success: true, message: 'Injury created.' };
  } catch (error) {
    return failed(error);
  }
}

export async function updateInstructorInjuryAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { supabase, user } = await requireInstructor();
    const parsed = updateInjurySchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { id, artistRecordId, incidentDate, severity, description, status } =
      parsed.data;
    await ensureOwnedArtistRecord(artistRecordId, user.id);
    const { error } = await supabase
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

    refreshInstructor('/instructor/injuries');
    return { success: true, message: 'Injury updated.' };
  } catch (error) {
    return failed(error);
  }
}

export async function deleteInstructorInjuryAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { supabase } = await requireInstructor();
    const parsed = deleteSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { error } = await supabase
      .from('injuries')
      .delete()
      .eq('id', parsed.data.id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshInstructor('/instructor/injuries');
    return { success: true, message: 'Injury deleted.' };
  } catch (error) {
    return failed(error);
  }
}

export async function createInstructorPostAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { supabase, user } = await requireInstructor();
    const parsed = createPostSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { title, body } = parsed.data;
    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      title,
      body,
    });
    if (error) throw new Error(error.message);

    refreshInstructor('/instructor/posts', '/dashboard');
    return { success: true, message: 'Post created.' };
  } catch (error) {
    return failed(error);
  }
}

export async function updateInstructorPostAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { supabase } = await requireInstructor();
    const parsed = updatePostSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { id, title, body } = parsed.data;
    const { error } = await supabase
      .from('posts')
      .update({ title, body })
      .eq('id', id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshInstructor('/instructor/posts', '/dashboard');
    return { success: true, message: 'Post updated.' };
  } catch (error) {
    return failed(error);
  }
}

export async function deleteInstructorPostAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { supabase } = await requireInstructor();
    const parsed = deleteSchema.safeParse(values(formData));
    if (!parsed.success) return invalid(parsed.error);

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', parsed.data.id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    refreshInstructor('/instructor/posts', '/dashboard');
    return { success: true, message: 'Post deleted.' };
  } catch (error) {
    return failed(error);
  }
}
