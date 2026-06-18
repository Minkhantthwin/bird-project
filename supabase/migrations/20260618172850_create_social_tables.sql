-- Migration: Social Tables (posts, comments, reactions)

-- ══════════════════════════════════════════
-- 1. Posts
-- ══════════════════════════════════════════
CREATE TABLE public.posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_user_id    ON public.posts (user_id);
CREATE INDEX idx_posts_created_at ON public.posts (created_at);

-- ══════════════════════════════════════════
-- 2. Comments
-- ══════════════════════════════════════════
CREATE TABLE public.comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post_id ON public.comments (post_id);
CREATE INDEX idx_comments_user_id ON public.comments (user_id);

-- ══════════════════════════════════════════
-- 3. Reactions
-- ══════════════════════════════════════════
CREATE TABLE public.reactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('Like', 'Celebrate', 'Fire', 'Love', 'Insightful')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reactions_post_id ON public.reactions (post_id);
CREATE INDEX idx_reactions_user_id ON public.reactions (user_id);

-- Composite unique constraint: one reaction per user per post
CREATE UNIQUE INDEX idx_reactions_unique_user_post ON public.reactions (user_id, post_id);
