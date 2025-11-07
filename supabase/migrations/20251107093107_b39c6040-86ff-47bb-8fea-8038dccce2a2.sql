-- Add RLS policy to allow users to view their own loan applications
CREATE POLICY "Users can view their own loan applications"
ON public.loan_applications
FOR SELECT
USING (auth.uid() = user_id);