-- Add user_id column to security_rules table
ALTER TABLE security_rules 
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Update RLS policies to restrict access based on user_id
ALTER TABLE security_rules ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see only their own rules
CREATE POLICY "Users can only see their own rules"
ON security_rules
FOR SELECT
USING (auth.uid()::text = user_id OR user_id IS NULL);

-- Policy to allow users to insert their own rules
CREATE POLICY "Users can insert their own rules"
ON security_rules
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Policy to allow users to delete their own rules
CREATE POLICY "Users can delete their own rules"
ON security_rules
FOR DELETE
USING (auth.uid()::text = user_id);
