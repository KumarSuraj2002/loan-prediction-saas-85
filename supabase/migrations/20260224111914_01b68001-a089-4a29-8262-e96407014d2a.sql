
-- Create table to store documents linked to loan applications
CREATE TABLE public.loan_application_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_application_id UUID NOT NULL REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  document_type TEXT NOT NULL, -- e.g. 'pan_card', 'aadhar_card', 'income_certificate', 'bank_statement', 'address_proof'
  document_name TEXT NOT NULL, -- original file name
  storage_path TEXT NOT NULL, -- path in supabase storage
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loan_application_documents ENABLE ROW LEVEL SECURITY;

-- Users can insert their own documents
CREATE POLICY "Users can upload their own documents"
ON public.loan_application_documents
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can view their own documents
CREATE POLICY "Users can view their own documents"
ON public.loan_application_documents
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
ON public.loan_application_documents
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage all documents
CREATE POLICY "Admins can manage all documents"
ON public.loan_application_documents
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
