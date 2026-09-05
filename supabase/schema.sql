-- ============================================================================
-- SNIST GUIDE - Supabase schema. Run ONCE in SQL Editor. Safe to re-run.
-- ============================================================================
create table if not exists public.subjects (
  id             text primary key,
  name           text not null,
  code           text,
  departments    jsonb not null default '[]'::jsonb,
  status         text not null default 'RESOURCES AVAILABLE',
  drive_url      text not null default '',
  category_tags  jsonb default '[]'::jsonb,
  description    text,
  semester_id    text not null,
  semester_title text not null,
  year_id        text not null,
  year_title     text not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists subjects_year_id_idx     on public.subjects (year_id);
create index if not exists subjects_semester_id_idx on public.subjects (semester_id);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin
  new.updated_at = now();
  return new;
end;
 $$;

drop trigger if exists subjects_touch_updated_at on public.subjects;
create trigger subjects_touch_updated_at
  before update on public.subjects
  for each row execute function public.touch_updated_at();

-- Row Level Security: public read, admin-only write
alter table public.subjects enable row level security;

drop policy if exists "public_read_subjects" on public.subjects;
create policy "public_read_subjects"
  on public.subjects for select
  to anon, authenticated
  using (true);

drop policy if exists "admin_insert_subjects" on public.subjects;
create policy "admin_insert_subjects"
  on public.subjects for insert
  to authenticated
  with check (true);

drop policy if exists "admin_update_subjects" on public.subjects;
create policy "admin_update_subjects"
  on public.subjects for update
  to authenticated
  using (true) with check (true);

drop policy if exists "admin_delete_subjects" on public.subjects;
create policy "admin_delete_subjects"
  on public.subjects for delete
  to authenticated
  using (true);