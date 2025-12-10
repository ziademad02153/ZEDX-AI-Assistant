-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES Table (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  subscription_tier text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. RESUMES Table
create table public.resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  content text not null, -- The extracted text content
  file_path text, -- Path in Storage if we upload the PDF
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. INTERVIEWS Table
create table public.interviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text default 'Interview Session',
  transcript text,
  analysis jsonb, -- AI feedback and analysis
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) - This is CRITICAL for security
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.interviews enable row level security;

-- Policies: Users can only see/edit their OWN data

-- Profiles Policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Resumes Policies
create policy "Users can view own resumes." on public.resumes
  for select using (auth.uid() = user_id);

create policy "Users can insert own resumes." on public.resumes
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own resumes." on public.resumes
  for delete using (auth.uid() = user_id);

-- Interviews Policies
create policy "Users can view own interviews." on public.interviews
  for select using (auth.uid() = user_id);

create policy "Users can insert own interviews." on public.interviews
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own interviews." on public.interviews
  for delete using (auth.uid() = user_id);

-- Trigger to automatically create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
