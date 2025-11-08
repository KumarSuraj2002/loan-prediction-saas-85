-- Update loan product names to match the main application
UPDATE loan_products SET name = 'Car Loan' WHERE name = 'Auto Loan';
UPDATE loan_products SET name = 'Home Loan' WHERE name = 'Home Mortgage';
UPDATE loan_products SET name = 'Education Loan' WHERE name = 'Student Loan';