-- Extend profiles table with additional fields for enhanced user identity
-- These are optional fields to allow gradual adoption

alter table if exists public.profiles
add column if not exists bio text,
add column if not exists course text,
add column if not exists year text,
add column if not exists hostel text,
add column if not exists linkedin_url text,
add column if not exists instagram_username text,
add column if not exists verified_seller boolean default false,
add column if not exists public_profile boolean default true;

-- Create index on username for public profile lookups
create index if not exists profiles_username_idx
  on public.profiles (username);

-- Allow public access to public profile fields
drop policy if exists "Public profiles are readable" on public.profiles;

create policy "Public profiles are readable"
on public.profiles for select
to anon, authenticated
using (public_profile = true);
