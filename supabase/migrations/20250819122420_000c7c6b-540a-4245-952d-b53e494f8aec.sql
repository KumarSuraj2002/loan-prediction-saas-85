-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert default user role for new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update RLS policies to check for admin role
DROP POLICY IF EXISTS "Only authenticated users can modify banks" ON public.banks;
CREATE POLICY "Only admins can modify banks"
ON public.banks
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only authenticated users can modify loan products" ON public.loan_products;
CREATE POLICY "Only admins can modify loan products"
ON public.loan_products
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only authenticated users can access loan applications" ON public.loan_applications;
CREATE POLICY "Only admins can access loan applications"
ON public.loan_applications
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only authenticated users can access users" ON public.users;
CREATE POLICY "Only admins can access users"
ON public.users
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only authenticated users can access user queries" ON public.user_queries;
CREATE POLICY "Only admins can access user queries"
ON public.user_queries
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only authenticated users can modify site settings" ON public.site_settings;
CREATE POLICY "Only admins can modify site settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only authenticated users can modify team members" ON public.team_members;
CREATE POLICY "Only admins can modify team members"
ON public.team_members
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only authenticated users can modify testimonials" ON public.testimonials;
CREATE POLICY "Only admins can modify testimonials"
ON public.testimonials
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policy for user_roles table
CREATE POLICY "Admins can manage all user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());