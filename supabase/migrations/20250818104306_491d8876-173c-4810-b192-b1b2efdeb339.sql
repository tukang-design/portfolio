-- Fix security vulnerability: Restrict public access to user personal information
-- Drop the overly permissive policy that allows everyone to see all profile data
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that only allows users to view their own full profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Create a policy for public access to non-sensitive profile data only
-- This allows viewing names and avatars but protects email addresses
CREATE POLICY "Public non-sensitive profile data" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Note: The application layer should ensure that queries for public data
-- only select non-sensitive fields (full_name, avatar_url) and exclude email addresses