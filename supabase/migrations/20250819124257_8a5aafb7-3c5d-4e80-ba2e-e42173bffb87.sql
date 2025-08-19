-- Add missing banks from the original static data
INSERT INTO public.banks (name, logo_text, rating, features, account_types, interest_rates, locations, description) VALUES
('Citibank', 'CITI', 4.1, 
 ARRAY['Mobile Banking', 'Global Access', 'Investment Options', 'Premium Cards'],
 ARRAY['Checking', 'Savings', 'Credit Card', 'Investment'],
 '{"savings": 0.05, "checking": 0.01, "mortgage": 6.45, "personal": 10.75}',
 ARRAY['Urban', 'Suburban', 'Online'],
 'Global bank with comprehensive personal and business financial services and international presence.'),

('Capital One', 'CAPITAL', 4.3,
 ARRAY['No Fees', 'High APY', 'Cash Back Rewards', 'Mobile Banking'],
 ARRAY['Checking', 'Savings', 'Credit Card', 'Auto Loans'],
 '{"savings": 3.3, "checking": 0.1, "mortgage": 6.4, "personal": 9.5}',
 ARRAY['Urban', 'Suburban', 'Online'],
 'Modern bank offering competitive rates, innovative digital tools, and popular rewards credit cards.'),

('US Bank', 'USB', 3.9,
 ARRAY['Extensive Branches', 'Business Banking', 'Mobile Banking', 'Investment Services'],
 ARRAY['Checking', 'Savings', 'Credit Card', 'Mortgage', 'Business'],
 '{"savings": 0.01, "checking": 0.0, "mortgage": 6.55, "personal": 11.0}',
 ARRAY['Urban', 'Suburban', 'Rural'],
 'Full-service bank with extensive branch network and diverse financial products for individuals and businesses.'),

('SoFi', 'SOFI', 4.6,
 ARRAY['No Fees', 'High APY', 'Cash Rewards', 'Investment Options'],
 ARRAY['Checking', 'Savings', 'Credit Card', 'Student Loans', 'Mortgage'],
 '{"savings": 4.0, "checking": 0.5, "mortgage": 6.1, "personal": 8.5}',
 ARRAY['Online'],
 'Modern fintech company offering high-interest accounts with no fees and comprehensive financial products.');