-- Seawise Studio — migration v7
-- Adds a dedicated cover photo column for the portfolio grid cards
-- (card = cover_url, falls back to screenshot_url when empty).
--
-- Run once in the Supabase SQL Editor. Safe to re-run (IF NOT EXISTS).

alter table portfolio
  add column if not exists cover_url text;
