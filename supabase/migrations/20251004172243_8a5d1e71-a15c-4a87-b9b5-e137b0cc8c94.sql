-- Add document fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pan_number text,
ADD COLUMN IF NOT EXISTS aadhar_number text,
ADD COLUMN IF NOT EXISTS pan_card_url text,
ADD COLUMN IF NOT EXISTS aadhar_card_url text,
ADD COLUMN IF NOT EXISTS income_certificate_url text,
ADD COLUMN IF NOT EXISTS address_proof_url text,
ADD COLUMN IF NOT EXISTS bank_statement_url text;