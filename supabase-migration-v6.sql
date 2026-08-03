-- Seawise Studio — migration v6
-- Adds a dedicated mobile screenshot column for the homepage showcase
-- (laptop = screenshot_url, phone = mobile_url).
--
-- Run once in the Supabase SQL Editor. Safe to re-run (IF NOT EXISTS).

alter table portfolio
  add column if not exists mobile_url text;
