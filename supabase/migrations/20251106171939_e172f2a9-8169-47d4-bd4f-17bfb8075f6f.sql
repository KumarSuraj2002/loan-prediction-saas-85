-- Allow anyone to insert loan applications
CREATE POLICY "Anyone can submit loan applications"
ON public.loan_applications
FOR INSERT
WITH CHECK (true);