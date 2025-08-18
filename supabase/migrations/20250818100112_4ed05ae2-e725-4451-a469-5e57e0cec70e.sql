-- Fix security vulnerability: Restrict public access to user personal information
-- Drop the overly permissive policy that allows everyone to see all profile data
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that only allows users to view their own full profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Create a separate policy for public data (only non-sensitive fields)
-- This allows displaying user names and avatars without exposing emails
CREATE POLICY "Public profile data is viewable" 
ON public.profiles 
FOR SELECT 
USING (true)
WITH CHECK (false); -- This will be handled by a view or filtered query

-- Since we need public access to some profile data (like names for blog authors, etc.)
-- but want to protect emails, let's create a more nuanced approach:
-- Drop the public policy we just created
DROP POLICY IF EXISTS "Public profile data is viewable" ON public.profiles;

-- Create a policy that allows viewing of profiles but we'll handle email protection in the application layer
-- For now, let's be conservative and only allow users to see their own profiles
-- Applications can be updated to use specific queries that exclude sensitive fields

-- The new policy structure:
-- 1. Users can see their own complete profile (including email)
-- 2. For public display (like blog authors), the application should use specific SELECT queries that exclude email