-- Create table for loan product questions
CREATE TABLE public.loan_product_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_product_id UUID NOT NULL REFERENCES public.loan_products(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'text',
  field_name TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  is_required BOOLEAN NOT NULL DEFAULT true,
  sequence_order INTEGER NOT NULL DEFAULT 1,
  placeholder TEXT,
  help_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(loan_product_id, field_name)
);

-- Enable RLS
ALTER TABLE public.loan_product_questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Questions are publicly readable for active loan products"
ON public.loan_product_questions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.loan_products 
    WHERE id = loan_product_questions.loan_product_id 
    AND is_active = true
  )
);

CREATE POLICY "Only admins can modify loan product questions"
ON public.loan_product_questions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_loan_product_questions_updated_at
BEFORE UPDATE ON public.loan_product_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_loan_product_questions_product_id ON public.loan_product_questions(loan_product_id);
CREATE INDEX idx_loan_product_questions_sequence ON public.loan_product_questions(loan_product_id, sequence_order);