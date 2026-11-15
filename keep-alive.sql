-- Supabase > SQL Editor এ পেস্ট করে Run করুন (একবার)
create table if not exists public.keep_alive (
  id int primary key,
  note text
);
insert into public.keep_alive (id, note) values (1, 'keep project active')
on conflict (id) do nothing;

alter table public.keep_alive enable row level security;
drop policy if exists "public can read keep_alive" on public.keep_alive;
create policy "public can read keep_alive" on public.keep_alive
  for select to anon using (true);
