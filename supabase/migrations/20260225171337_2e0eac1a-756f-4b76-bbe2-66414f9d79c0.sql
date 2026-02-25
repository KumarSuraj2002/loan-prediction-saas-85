
-- Fix testimonials: drop restrictive SELECT and recreate as permissive
DROP POLICY IF EXISTS "Published testimonials are publicly readable" ON public.testimonials;
CREATE POLICY "Published testimonials are publicly readable"
ON public.testimonials
FOR SELECT
TO public
USING (is_published = true);

-- Fix banks: drop restrictive SELECT and recreate as permissive
DROP POLICY IF EXISTS "Banks are publicly readable" ON public.banks;
CREATE POLICY "Banks are publicly readable"
ON public.banks
FOR SELECT
TO public
USING (true);

-- Fix site_settings: drop restrictive SELECT and recreate as permissive
DROP POLICY IF EXISTS "Site settings are publicly readable" ON public.site_settings;
CREATE POLICY "Site settings are publicly readable"
ON public.site_settings
FOR SELECT
TO public
USING (true);
