# template-supabase-shadcn-next

A Next.js template with Supabase authentication and Shadcn UI components.

## Getting Started

1. Clone this repository
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_API_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

## Features

- Authentication with Supabase
- User profiles with username validation
- Modern UI with Shadcn components
- Responsive design

## SQL Commands

```sql
create table if not exists profiles (
    id uuid primary key default gen_random_uuid(),
    display_name text,
    email varchar not null unique,
    updated_at timestamptz default now(),
    created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can create own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can delete their own profile"
on public.profiles
for delete
to authenticated
using (auth.uid() = id);

create policy "Users can view all profiles"
on public.profiles
for select
to authenticated
using (true);

create or replace function handle_update_email()
returns trigger as $$
begin
  update public.profiles
  set email = new.email
  where id = new.id;
  return new;
end;
$$ language plpgsql
security definer;

create trigger on_auth_update_email
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function handle_update_email();

create or replace function delete_auth_user()
returns trigger as $$
begin
  delete from auth.users
  where id = old.id;
  return old;
end;
$$ language plpgsql
security definer;

create trigger on_profile_delete
after delete on public.profiles
for each row
execute function delete_auth_user();

alter table public.profiles
add constraint profiles_auth_users_fk
foreign key (id) references auth.users(id)
on delete cascade;

create or replace function update_auth_display_name()
returns trigger
as $$
begin
  update auth.users
  set raw_user_meta_data = jsonb_set(
    raw_user_meta_data,
    '{display_name}',
    to_jsonb(new.display_name)
  )
  where id = new.id;
  return new;
end;
$$
language plpgsql
security definer;

create trigger update_auth_display_name_trigger
after update of display_name on public.profiles
for each row
when (old.display_name is distinct from new.display_name)
execute function update_auth_display_name();
```
