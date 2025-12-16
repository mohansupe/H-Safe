-- Ensure user_id column exists
ALTER TABLE security_rules ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Enable RLS
ALTER TABLE security_rules ENABLE ROW LEVEL SECURITY;

-- Drop strict policies that rely on auth.uid() since we are using Clerk
DROP POLICY IF EXISTS "Users can only see their own rules" ON security_rules;
DROP POLICY IF EXISTS "Users can insert their own rules" ON security_rules;
DROP POLICY IF EXISTS "Users can delete their own rules" ON security_rules;

-- Create a permissive policy to allow the frontend to manage rules
-- Note: In a production environment with Clerk + Supabase, you would configure JWT verification.
-- For now, we allow access and rely on the frontend to filter by user_id.
CREATE POLICY "Allow public access for app"
ON security_rules
FOR ALL
USING (true)
WITH CHECK (true);
