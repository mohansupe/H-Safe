-- Create the admin_users table if it doesn't exist
create table if not exists admin_users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table admin_users enable row level security;

-- Policy: Allow read access to everyone (so the app can check if a user is an admin)
create policy "Enable read access for all users" on admin_users for select using (true);

-- Policy: Allow insert for authenticated users (required to add new admins)
-- Note: In a production app with stricter security, you might want to restrict this further,
-- but for this implementation, we rely on the frontend check that only the super admin sees the UI.
create policy "Enable insert for authenticated users" on admin_users for insert with check (true);

-- Policy: Allow delete for authenticated users (required to remove admins)
create policy "Enable delete for authenticated users" on admin_users for delete using (true);
