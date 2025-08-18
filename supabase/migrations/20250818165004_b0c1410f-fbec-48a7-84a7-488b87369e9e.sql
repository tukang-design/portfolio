-- Security Fix 1: Harden user_roles RLS policies to prevent privilege escalation
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create more restrictive policies
CREATE POLICY "Only existing admins can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (is_admin());

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Security Fix 2: Harden database functions with explicit search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_view_count(article_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.blog_articles 
  SET view_count = view_count + 1 
  WHERE slug = article_slug AND status = 'published';
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = is_admin.user_id
    AND role = 'admin'
  );
$function$;

-- Security Fix 3: Create trigger function to prevent unauthorized admin role assignment
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_admin_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only allow admin role assignment if user is already an admin or during initial setup
  IF NEW.role = 'admin' AND auth.uid() IS NOT NULL THEN
    IF NOT is_admin() THEN
      RAISE EXCEPTION 'Only existing admins can assign admin roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Create trigger to enforce admin assignment rules
DROP TRIGGER IF EXISTS prevent_unauthorized_admin_assignment_trigger ON public.user_roles;
CREATE TRIGGER prevent_unauthorized_admin_assignment_trigger
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_unauthorized_admin_assignment();