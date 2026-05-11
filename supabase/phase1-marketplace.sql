-- Set up profiles table with college_id
-- The profiles table is auto-created by Supabase auth, but we need to add college_id column
alter table if exists public.profiles 
add column if not exists college_id uuid references public.colleges(id);

alter table if exists public.profiles 
add column if not exists username text unique;

alter table if exists public.profiles 
add column if not exists full_name text;

alter table if exists public.profiles 
add column if not exists role text default 'user';

-- Enable RLS on profiles table and add policies
alter table if exists public.profiles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can read other profiles" on public.profiles;
drop policy if exists "Users can create their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

-- Create policies
create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "Users can read other profiles"
on public.profiles for select
to authenticated
using (true);

create policy "Users can create their own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 4 and 120),
  description text not null check (char_length(description) >= 20),
  category text not null check (category in (
    'Electronics',
    'Books',
    'Fashion',
    'Cycles',
    'Hostel Essentials',
    'Gadgets',
    'Furniture',
    'Sports',
    'Other'
  )),
  condition text not null check (condition in ('New', 'Like New', 'Good', 'Fair')),
  price integer not null check (price >= 0),
  negotiable boolean not null default true,
  location text not null,
  contact_preference text not null check (contact_preference in ('Chat', 'Phone', 'WhatsApp', 'Email')),
  status text not null default 'active' check (status in ('active', 'sold')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sold_at timestamptz
);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_listings (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create index if not exists listings_status_created_at_idx
  on public.listings (status, created_at desc);

create index if not exists listings_seller_id_idx
  on public.listings (seller_id);

create index if not exists listings_category_idx
  on public.listings (category);

create index if not exists listing_images_listing_id_idx
  on public.listing_images (listing_id, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
before update on public.listings
for each row
execute function public.set_updated_at();

alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.saved_listings enable row level security;

drop policy if exists "Listings are visible to authenticated users" on public.listings;
create policy "Listings are visible to authenticated users"
on public.listings for select
to authenticated
using (true);

drop policy if exists "Users can create their own listings" on public.listings;
create policy "Users can create their own listings"
on public.listings for insert
to authenticated
with check (auth.uid() = seller_id);

drop policy if exists "Users can update their own listings" on public.listings;
create policy "Users can update their own listings"
on public.listings for update
to authenticated
using (auth.uid() = seller_id)
with check (auth.uid() = seller_id);

drop policy if exists "Users can delete their own listings" on public.listings;
create policy "Users can delete their own listings"
on public.listings for delete
to authenticated
using (auth.uid() = seller_id);

drop policy if exists "Listing images are visible to authenticated users" on public.listing_images;
create policy "Listing images are visible to authenticated users"
on public.listing_images for select
to authenticated
using (true);

drop policy if exists "Users can add images to own listings" on public.listing_images;
create policy "Users can add images to own listings"
on public.listing_images for insert
to authenticated
with check (
  exists (
    select 1 from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
);

drop policy if exists "Users can delete images from own listings" on public.listing_images;
create policy "Users can delete images from own listings"
on public.listing_images for delete
to authenticated
using (
  exists (
    select 1 from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
);

drop policy if exists "Users can view their saved listings" on public.saved_listings;
create policy "Users can view their saved listings"
on public.saved_listings for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can save listings" on public.saved_listings;
create policy "Users can save listings"
on public.saved_listings for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can unsave listings" on public.saved_listings;
create policy "Users can unsave listings"
on public.saved_listings for delete
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Listing images are publicly readable" on storage.objects;
create policy "Listing images are publicly readable"
on storage.objects for select
to public
using (bucket_id = 'listing-images');

drop policy if exists "Users can upload listing images" on storage.objects;
create policy "Users can upload listing images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'listing-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can delete own listing images" on storage.objects;
create policy "Users can delete own listing images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'listing-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
