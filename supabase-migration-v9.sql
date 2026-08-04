-- Seawise Studio — migration v9
-- Bilingual blog: v8 covered portfolio, pricing, and testimonials but left the
-- `posts` table Indonesian-only, so /en/blog and /id/blog served identical text
-- while hreflang told Google they were translations of each other.
--
-- Same convention as v8: Indonesian stays in the base column, English goes in a
-- matching *_en column, and blank English falls back to Indonesian at render
-- time, so you can translate articles gradually.
--
-- Run once in the Supabase SQL Editor. Safe to re-run (IF NOT EXISTS).

-- Posts
alter table posts
  add column if not exists title_en   text,
  add column if not exists excerpt_en text,
  add column if not exists content_en text;
