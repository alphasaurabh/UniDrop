-- Reports table for marketplace listings
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (reason in (
    'spam',
    'scam',
    'inappropriate',
    'duplicate',
    'fake_product',
    'other'
  )),
  description text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Prevent duplicate reports from same user on same listing
  unique(listing_id, reporter_id)
);

create index if not exists reports_listing_id_idx
  on public.reports (listing_id);

create index if not exists reports_reporter_id_idx
  on public.reports (reporter_id);

create index if not exists reports_status_created_at_idx
  on public.reports (status, created_at desc);

create index if not exists reports_listing_id_reporter_id_idx
  on public.reports (listing_id, reporter_id);

-- Enable RLS on reports table
alter table public.reports enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can create reports" on public.reports;
drop policy if exists "Users can view their own reports" on public.reports;

-- Users can create reports
create policy "Users can create reports"
on public.reports for insert
to authenticated
with check (auth.uid() = reporter_id);

-- Users can view their own reports
create policy "Users can view their own reports"
on public.reports for select
to authenticated
using (auth.uid() = reporter_id);

-- Admin can view all reports (future-ready - needs admin role check)
create policy "Admins can view all reports"
on public.reports for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- Trigger to update updated_at
drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
before update on public.reports
for each row
execute function public.set_updated_at();
