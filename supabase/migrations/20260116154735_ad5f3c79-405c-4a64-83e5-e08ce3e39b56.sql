-- Drop existing policy on users table
DROP POLICY IF EXISTS "Only admins can access users" ON public.users;

-- Create proper PERMISSIVE policies for admin-only access
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert users"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update users"
ON public.users
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete users"
ON public.users
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));