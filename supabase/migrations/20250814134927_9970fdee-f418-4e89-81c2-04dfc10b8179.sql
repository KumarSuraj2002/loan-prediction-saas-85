-- Create a table to store site settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site settings (allow public read, admin only write)
CREATE POLICY "Site settings are publicly readable" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify site settings" 
ON public.site_settings 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES 
('general', '{
  "site_title": "Finance Buddy", 
  "about_us": "Finance Buddy is your trusted partner for loan applications and financial guidance. We help you find the best loan options from our network of verified bank partners, making your financial journey smooth and transparent."
}'),
('contacts', '{
  "address": "123 Finance Street, Mumbai, Maharashtra 400001",
  "phone_numbers": ["+91 98765 43210", "+91 87654 32109"],
  "email": "contact@financebuddy.com",
  "google_map": "https://goo.gl/maps/example",
  "social_links": {
    "facebook": "https://www.facebook.com/financebuddy",
    "twitter": "https://www.twitter.com/financebuddy",
    "instagram": "https://www.instagram.com/financebuddy",
    "linkedin": "https://www.linkedin.com/company/financebuddy"
  }
}'),
('maintenance', '{
  "is_maintenance": false,
  "maintenance_message": "We are currently updating our systems to serve you better. Please check back soon."
}');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();