-- Create feedbacks table
create table if not exists feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feedback_text text not null,
  is_public boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Create marketplace_activity table
create table if not exists marketplace_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid references listings(id) on delete cascade,
  activity_type text not null check (activity_type in ('listing_created', 'listing_sold', 'feedback_posted')),
  created_at timestamp with time zone not null default now()
);

-- Add indexes for common queries
create index if not exists idx_feedbacks_user_id on feedbacks(user_id);
create index if not exists idx_feedbacks_is_public_created on feedbacks(is_public, created_at desc);
create index if not exists idx_marketplace_activity_user_id on marketplace_activity(user_id);
create index if not exists idx_marketplace_activity_listing_id on marketplace_activity(listing_id);
create index if not exists idx_marketplace_activity_type_created on marketplace_activity(activity_type, created_at desc);
create index if not exists idx_marketplace_activity_created on marketplace_activity(created_at desc);

-- Enable RLS
alter table feedbacks enable row level security;
alter table marketplace_activity enable row level security;

-- Feedbacks RLS Policies
create policy "feedbacks_anyone_can_see_public"
  on feedbacks for select
  using (is_public = true);

create policy "feedbacks_users_can_see_own"
  on feedbacks for select
  using (auth.uid() = user_id);

create policy "feedbacks_authenticated_users_can_create"
  on feedbacks for insert
  with check (auth.uid() = user_id);

create policy "feedbacks_users_can_update_own"
  on feedbacks for update
  using (auth.uid() = user_id);

create policy "feedbacks_users_can_delete_own"
  on feedbacks for delete
  using (auth.uid() = user_id);

-- Marketplace Activity RLS Policies
create policy "marketplace_activity_anyone_can_view"
  on marketplace_activity for select
  using (true);

create policy "marketplace_activity_system_can_insert"
  on marketplace_activity for insert
  with check (true);
