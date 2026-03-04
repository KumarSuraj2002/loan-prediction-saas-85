-- Allow users to update their own loan applications (for status change after document upload)
CREATE POLICY "Users can update their own loan applications"
ON public.loan_applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow anyone to insert user queries (contact form - no auth required)
CREATE POLICY "Anyone can submit user queries"
ON public.user_queries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);