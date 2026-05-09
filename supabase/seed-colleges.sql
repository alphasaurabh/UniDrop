insert into public.colleges (name, slug, allowed_email_domains, is_active)
values (
  'Gautam Buddha University',
  'gautam-buddha-university',
  array['gbu.ac.in'],
  true
)
on conflict (slug) do update
set
  name = excluded.name,
  allowed_email_domains = excluded.allowed_email_domains,
  is_active = excluded.is_active;
