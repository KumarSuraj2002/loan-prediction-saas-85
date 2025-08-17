-- Create banks table to store bank information
CREATE TABLE public.banks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_text TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  features TEXT[] NOT NULL DEFAULT '{}',
  account_types TEXT[] NOT NULL DEFAULT '{}',
  interest_rates JSONB NOT NULL DEFAULT '{}',
  locations TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table to store user reviews
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loan_applications table to manage loan applications
CREATE TABLE public.loan_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  loan_type TEXT NOT NULL,
  loan_amount DECIMAL(15,2) NOT NULL,
  monthly_income DECIMAL(15,2) NOT NULL,
  credit_score INTEGER,
  employment_status TEXT,
  application_status TEXT NOT NULL DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected', 'under_review')),
  application_data JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create users table to manage user information
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  user_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_queries table to manage contact form submissions
CREATE TABLE public.user_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  query_type TEXT DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loan_products table to manage different loan types
CREATE TABLE public.loan_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  min_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  max_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  interest_rate_min DECIMAL(5,2) NOT NULL DEFAULT 0,
  interest_rate_max DECIMAL(5,2) NOT NULL DEFAULT 0,
  min_term_months INTEGER NOT NULL DEFAULT 12,
  max_term_months INTEGER NOT NULL DEFAULT 360,
  eligibility_criteria JSONB,
  features TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access and authenticated admin write access
CREATE POLICY "Banks are publicly readable" ON public.banks FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can modify banks" ON public.banks FOR ALL USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Published testimonials are publicly readable" ON public.testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Only authenticated users can modify testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Only authenticated users can access loan applications" ON public.loan_applications FOR ALL USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Only authenticated users can access users" ON public.users FOR ALL USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Only authenticated users can access user queries" ON public.user_queries FOR ALL USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Active loan products are publicly readable" ON public.loan_products FOR SELECT USING (is_active = true);
CREATE POLICY "Only authenticated users can modify loan products" ON public.loan_products FOR ALL USING (auth.role() = 'authenticated'::text);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_banks_updated_at
  BEFORE UPDATE ON public.banks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loan_applications_updated_at
  BEFORE UPDATE ON public.loan_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_queries_updated_at
  BEFORE UPDATE ON public.user_queries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loan_products_updated_at
  BEFORE UPDATE ON public.loan_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for banks
INSERT INTO public.banks (name, logo_text, rating, features, account_types, interest_rates, locations, description) VALUES
('Chase Bank', 'CHASE', 4.2, '{"Mobile Banking", "24/7 Customer Service", "Large ATM Network", "Investment Options"}', '{"Checking", "Savings", "Credit Card", "Mortgage"}', '{"savings": 0.01, "checking": 0.0, "mortgage": 6.5, "personal": 10.99}', '{"Urban", "Suburban"}', 'A global financial services firm offering a wide range of products for personal and business banking needs.'),
('Bank of America', 'BOA', 4.0, '{"Mobile Banking", "Rewards Program", "Financial Centers", "Auto Loans"}', '{"Checking", "Savings", "Investment", "Mortgage"}', '{"savings": 0.02, "checking": 0.0, "mortgage": 6.75, "personal": 11.25}', '{"Urban", "Suburban", "Rural"}', 'Offers comprehensive banking solutions with a focus on digital innovation and accessibility.'),
('Wells Fargo', 'WELLS', 3.8, '{"Online Bill Pay", "Mobile Deposit", "Financial Planning", "Student Loans"}', '{"Checking", "Savings", "Business", "Mortgage"}', '{"savings": 0.01, "checking": 0.0, "mortgage": 6.6, "personal": 11.5}', '{"Urban", "Suburban", "Rural"}', 'Provides personal, small business and commercial financial services with thousands of branches nationwide.'),
('Ally Bank', 'ALLY', 4.5, '{"No Fees", "High APY", "24/7 Support", "Easy Transfers"}', '{"Online Savings", "Online Checking", "Money Market", "CDs"}', '{"savings": 3.75, "checking": 0.25, "mortgage": 6.25, "personal": 9.75}', '{"Online"}', 'An online-only bank offering competitive rates with no monthly maintenance fees or minimum balance requirements.'),
('Discover Bank', 'DISCOVER', 4.4, '{"Cash Back", "No Annual Fee", "No Overdraft Fee", "FICO Score"}', '{"Online Savings", "Online Checking", "Credit Card", "Personal Loans"}', '{"savings": 3.5, "checking": 0.2, "mortgage": 0, "personal": 8.99}', '{"Online"}', 'Offers online banking services with cash back rewards on debit card purchases and no-fee banking.');

-- Insert initial data for testimonials
INSERT INTO public.testimonials (name, role, company, avatar, content, rating) VALUES
('Sarah Johnson', 'Small Business Owner', 'Bright Ideas Co.', 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=faces', 'This platform helped me secure a business loan with favorable terms. The loan prediction tool was spot-on with its assessment!', 5),
('Michael Chen', 'First-time Homebuyer', '', 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=faces', 'As someone new to mortgages, the bank recommendation system saved me countless hours of research and helped me find the perfect lender.', 5),
('Priya Patel', 'Financial Analyst', 'Global Investments', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=faces', 'The accuracy of the loan prediction algorithm is impressive. I recommend this tool to all my clients looking for financing options.', 5),
('James Wilson', 'Entrepreneur', 'Tech Innovations', 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=faces', 'The personalized bank matching feature connected me with a lender that perfectly understood my startup''s unique financial needs.', 4),
('Olivia Martinez', 'Real Estate Agent', 'Premier Properties', 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=faces', 'I now refer all my clients to this platform. The financial insights have helped numerous families secure their dream homes.', 5);

-- Insert initial data for loan products
INSERT INTO public.loan_products (name, description, min_amount, max_amount, interest_rate_min, interest_rate_max, min_term_months, max_term_months, features) VALUES
('Personal Loan', 'Unsecured personal loans for various purposes including debt consolidation, home improvement, and major purchases.', 1000, 100000, 6.99, 24.99, 12, 84, '{"Quick approval", "No collateral required", "Fixed interest rates", "Flexible terms"}'),
('Home Mortgage', 'Fixed and adjustable rate mortgages for purchasing or refinancing residential properties.', 50000, 2000000, 3.25, 8.50, 180, 360, '{"Competitive rates", "Various term options", "First-time buyer programs", "Refinancing available"}'),
('Auto Loan', 'Financing for new and used vehicle purchases with competitive rates and flexible terms.', 5000, 150000, 2.99, 12.99, 24, 84, '{"New and used vehicles", "Pre-approval available", "Gap insurance options", "Direct dealer financing"}'),
('Business Loan', 'Term loans and lines of credit for small to medium businesses for expansion and working capital.', 10000, 500000, 5.99, 18.99, 12, 120, '{"Working capital", "Equipment financing", "Business expansion", "Flexible repayment"}'),
('Student Loan', 'Educational loans for undergraduate and graduate studies with competitive rates and deferred payment options.', 1000, 200000, 3.73, 11.50, 60, 300, '{"Deferred payments", "Grace period", "Income-driven repayment", "No prepayment penalty"}')