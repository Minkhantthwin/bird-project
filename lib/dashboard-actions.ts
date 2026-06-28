'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { isDummyDataEnabled } from '@/lib/env';
import type { ReactionType } from '@/lib/types';
import { createClient } from '@/utils/supabase/server';

export interface DashboardActionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  serverError?: string;
}

export interface ReactionActionResult extends DashboardActionState {
  activeReaction?: ReactionType | null;
}

const reactionTypes = [
  'Like',
  'Celebrate',
  'Fire',
  'Love',
  'Insightful',
] as const satisfies readonly ReactionType[];

const postIdSchema = z.string().uuid('Invalid post ID');
const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Give your post a title.')
    .max(255, 'Title must be 255 characters or fewer.'),
  body: z
    .string()
    .trim()
    .min(1, 'Write something for your post.')
    .max(10000, 'Post body must be 10,000 characters or fewer.'),
});
const commentSchema = z.object({
  postId: postIdSchema,
  content: z
    .string()
    .trim()
    .min(1, 'Write a comment before posting.')
    .max(1000, 'Comments must be 1,000 characters or fewer.'),
});
const reactionSchema = z.object({
  postId: postIdSchema,
  reactionType: z.enum(reactionTypes),
});

function invalid(error: z.ZodError): DashboardActionState {
  return {
    errors: Object.fromEntries(
      Object.entries(error.flatten().fieldErrors).filter(
        (entry): entry is [string, string[]] => Boolean(entry[1]),
      ),
    ),
  };
}

function failed(error: unknown): DashboardActionState {
  return {
    serverError:
      error instanceof Error ? error.message : 'An unexpected error occurred.',
  };
}

async function requireAuthenticatedUser() {
  if (isDummyDataEnabled()) {
    throw new Error('Comments and reactions require Supabase data mode.');
  }

  const supabase = createClient(await cookies());
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('You must be signed in to interact with posts.');
  }

  return { supabase, user };
}

function refreshPost(postId: string) {
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/posts/${postId}`);
}

export async function createCommentAction(
  _state: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  try {
    const parsed = commentSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return invalid(parsed.error);

    const { supabase, user } = await requireAuthenticatedUser();
    const { postId, content } = parsed.data;
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content,
    });

    if (error) throw new Error(`Unable to post comment: ${error.message}`);

    refreshPost(postId);
    return { success: true, message: 'Comment posted.' };
  } catch (error) {
    return failed(error);
  }
}

export async function toggleReactionAction(
  postId: string,
  reactionType: ReactionType,
): Promise<ReactionActionResult> {
  try {
    const parsed = reactionSchema.safeParse({ postId, reactionType });
    if (!parsed.success) return invalid(parsed.error);

    const { supabase, user } = await requireAuthenticatedUser();
    const { data: existing, error: existingError } = await supabase
      .from('reactions')
      .select('id, reaction_type')
      .eq('post_id', parsed.data.postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingError) {
      throw new Error(`Unable to load your reaction: ${existingError.message}`);
    }

    let activeReaction: ReactionType | null;

    if (existing?.reaction_type === parsed.data.reactionType) {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('id', existing.id)
        .eq('user_id', user.id);
      if (error) throw new Error(`Unable to remove reaction: ${error.message}`);
      activeReaction = null;
    } else if (existing) {
      const { error } = await supabase
        .from('reactions')
        .update({ reaction_type: parsed.data.reactionType })
        .eq('id', existing.id)
        .eq('user_id', user.id);
      if (error) throw new Error(`Unable to change reaction: ${error.message}`);
      activeReaction = parsed.data.reactionType;
    } else {
      const { error } = await supabase.from('reactions').insert({
        post_id: parsed.data.postId,
        user_id: user.id,
        reaction_type: parsed.data.reactionType,
      });
      if (error) throw new Error(`Unable to add reaction: ${error.message}`);
      activeReaction = parsed.data.reactionType;
    }

    refreshPost(parsed.data.postId);
    return {
      success: true,
      message: activeReaction ? `${activeReaction} reaction saved.` : 'Reaction removed.',
      activeReaction,
    };
  } catch (error) {
    return failed(error);
  }
}

// ══════════════════════════════════════════════════════
// Create Post
// ══════════════════════════════════════════════════════

export async function createPostAction(
  _state: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  try {
    const { supabase, user } = await requireAuthenticatedUser();
    const parsed = postSchema.safeParse({
      title: formData.get('title'),
      body: formData.get('body'),
    });

    if (!parsed.success) return invalid(parsed.error);

    const { title, body } = parsed.data;
    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      title,
      body,
    });

    if (error) throw new Error(`Unable to create post: ${error.message}`);

    revalidatePath('/dashboard');
    return { success: true, message: 'Post published!' };
  } catch (error) {
    return failed(error);
  }
}
