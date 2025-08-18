-- Create a more secure approach: completely restrict email access
-- Drop the current public policy that still exposes all data
DROP POLICY IF EXISTS "Public non-sensitive profile data" ON public.profiles;

-- Only allow users to see their own profiles (including email)
-- Public access will be handled through application-layer filtering
-- This ensures emails are never exposed in public queries

-- For public display needs (like blog authors), applications should:
-- 1. Use specific SELECT queries that exclude email: SELECT id, full_name, avatar_url FROM profiles
-- 2. Or create a public view that excludes sensitive data