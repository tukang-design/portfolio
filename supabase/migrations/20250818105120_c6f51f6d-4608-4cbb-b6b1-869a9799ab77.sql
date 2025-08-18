-- Fix contact_inquiries RLS policies for proper security
-- Drop the current broad policy that might be too permissive
DROP POLICY IF EXISTS "Admins can manage contact inquiries" ON public.contact_inquiries;

-- Create separate, more granular policies for better security control

-- Allow public users to submit contact forms (INSERT only)
CREATE POLICY "Anyone can submit contact inquiries"
ON public.contact_inquiries
FOR INSERT
WITH CHECK (true);

-- Only admins can view contact inquiries (SELECT)
CREATE POLICY "Only admins can view contact inquiries"
ON public.contact_inquiries
FOR SELECT
USING (is_admin());

-- Only admins can update contact inquiries (UPDATE)
CREATE POLICY "Only admins can update contact inquiries"
ON public.contact_inquiries
FOR UPDATE
USING (is_admin());

-- Only admins can delete contact inquiries (DELETE)
CREATE POLICY "Only admins can delete contact inquiries"
ON public.contact_inquiries
FOR DELETE
USING (is_admin());