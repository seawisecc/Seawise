-- Seawise Studio — migration v8
-- Bilingual content: Indonesian stays in the base column, English goes in a
-- matching *_en column. Blank English falls back to Indonesian at render time,
-- so you can translate gradually without breaking the /en pages.
--
-- Run once in the Supabase SQL Editor. Safe to re-run (IF NOT EXISTS).

-- Portfolio
alter table portfolio
  add column if not exists title_en       text,
  add column if not exists description_en text,
  add column if not exists body_en        text,
  add column if not exists industry_en    text,
  add column if not exists tech_stack_en  text[];

-- Pricing
alter table pricing
  add column if not exists tagline_en    text,
  add column if not exists price_note_en text,
  add column if not exists features_en   text[];

-- Testimonials
alter table testimonials
  add column if not exists content_en text,
  add column if not exists role_en    text;
