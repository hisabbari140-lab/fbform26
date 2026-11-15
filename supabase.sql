-- Supabase > SQL Editor এ পেস্ট করে Run করুন
create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  date_of_birth date not null,
  gender text not null check (gender in ('Male','Female')),
  current_class text not null,
  school_name text not null,
  father_name text not null,
  mother_name text not null,
  whatsapp text not null,
  address text not null,
  class_mode text[] not null
);

alter table public.admissions enable row level security;

-- ভিজিটর শুধু ফর্ম জমা দিতে পারবে (বয়স ৪-১৩), কেউ ডেটা পড়তে পারবে না
drop policy if exists "public can submit" on public.admissions;
create policy "public can submit" on public.admissions
  for insert to anon
  with check (
    date_of_birth <= (current_date - interval '4 years')
    and date_of_birth > (current_date - interval '14 years')
  );
