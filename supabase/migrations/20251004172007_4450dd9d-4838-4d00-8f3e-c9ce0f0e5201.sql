-- Add document fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pan_number text,
ADD COLUMN IF NOT EXISTS aadhar_number text,
ADD COLUMN IF NOT EXISTS pan_card_url text,
ADD COLUMN IF NOT EXISTS aadhar_card_url text,
ADD COLUMN IF NOT EXISTS income_certificate_url text,
ADD COLUMN IF NOT EXISTS address_proof_url text,
ADD COLUMN IF NOT EXISTS bank_statement_url text;

-- Create storage bucket for user documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-documents', 'user-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create policies for user documents bucket
CREATE POLICY "Users can view their own documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]);