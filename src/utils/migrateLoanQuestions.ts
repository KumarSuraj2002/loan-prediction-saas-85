import { supabase } from '@/integrations/supabase/client';

export const migrateLoanQuestions = async () => {
  try {
    // Get loan products
    const { data: loanProducts, error: productsError } = await supabase
      .from('loan_products')
      .select('id, name')
      .order('name');

    if (productsError) throw productsError;

    const loanProductMap: Record<string, string> = {
      'Personal Loan': loanProducts?.find(p => p.name === 'Personal Loan')?.id || '',
      'Education Loan': loanProducts?.find(p => p.name === 'Education Loan')?.id || '',
      'Home Loan': loanProducts?.find(p => p.name === 'Home Loan')?.id || '',
      'Car Loan': loanProducts?.find(p => p.name === 'Car Loan')?.id || '',
      'Business Loan': loanProducts?.find(p => p.name === 'Business Loan')?.id || '',
    };

    // Common questions template
    const commonQuestions = [
      { text: 'What is your full name?', type: 'text', field: 'full_name', options: [], placeholder: 'Enter your full name' },
      { text: 'What is your date of birth?', type: 'date', field: 'dob', options: [], placeholder: 'DD/MM/YYYY' },
      { text: 'What is your email address?', type: 'email', field: 'email', options: [], placeholder: 'Enter your email' },
      { text: 'What is your phone number?', type: 'tel', field: 'phone', options: [], placeholder: 'Enter your phone number' },
      { text: 'What is your current address?', type: 'text', field: 'address', options: [], placeholder: 'Enter your address' },
    ];

    // Specific questions by loan type
    const specificQuestions: Record<string, any[]> = {
      'Personal Loan': [
        { text: 'How much money would you like to borrow?', type: 'number', field: 'loan_amount', options: [], placeholder: 'Enter amount' },
        { text: 'What is the purpose of this loan?', type: 'select', field: 'loan_purpose', options: ['Medical Expenses', 'Debt Consolidation', 'Home Improvement', 'Wedding', 'Other'] },
        { text: 'What is your current employment status?', type: 'select', field: 'employment_status', options: ['Full-time employed', 'Part-time employed', 'Self-employed', 'Unemployed', 'Retired'] },
        { text: 'What is your monthly income?', type: 'number', field: 'monthly_income', options: [], placeholder: 'Enter amount' },
        { text: 'Do you have any existing loans?', type: 'select', field: 'existing_loans', options: ['Yes', 'No'] },
        { text: 'What is your credit score range?', type: 'select', field: 'credit_score', options: ['Excellent (750+)', 'Good (700-749)', 'Fair (650-699)', 'Poor (600-649)', 'Bad (below 600)', "I don't know"] },
        { text: 'What loan term are you looking for?', type: 'select', field: 'loan_term', options: ['1 year', '2 years', '3 years', '5 years'] },
      ],
      'Education Loan': [
        { text: 'What is the name of the educational institution?', type: 'text', field: 'institute_name', options: [], placeholder: 'Enter institution name' },
        { text: 'What course are you planning to study?', type: 'text', field: 'course_name', options: [], placeholder: 'Enter course name' },
        { text: 'Where is the institution located?', type: 'select', field: 'course_country', options: ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Other'] },
        { text: 'What is the duration of the course?', type: 'select', field: 'course_duration', options: ['Less than 1 year', '1 year', '2 years', '3 years', '4 years', '5+ years'] },
        { text: 'What is the total cost of education?', type: 'number', field: 'total_fees', options: [], placeholder: 'Enter amount' },
        { text: 'How much loan amount do you need?', type: 'number', field: 'loan_amount', options: [], placeholder: 'Enter amount' },
        { text: 'What is your admission status?', type: 'select', field: 'admission_status', options: ['Confirmed admission', 'Applied, waiting for decision', 'Not yet applied'] },
        { text: 'Do you have any collateral to offer?', type: 'select', field: 'collateral', options: ['Property', 'Fixed Deposit', 'No collateral'] },
        { text: 'Who will be your co-applicant/guarantor?', type: 'text', field: 'cosigner_name', options: [], placeholder: 'Enter co-applicant name' },
        { text: 'What is your relationship with the co-applicant?', type: 'select', field: 'cosigner_relation', options: ['Parent', 'Sibling', 'Spouse', 'Other Relative'] },
      ],
      'Home Loan': [
        { text: 'What is the total value of the property?', type: 'number', field: 'property_value', options: [], placeholder: 'Enter property value' },
        { text: 'How much loan amount do you need?', type: 'number', field: 'loan_amount', options: [], placeholder: 'Enter loan amount' },
        { text: 'What type of property are you purchasing?', type: 'select', field: 'property_type', options: ['Apartment/Flat', 'Independent House', 'Villa', 'Plot of Land'] },
        { text: 'What is the construction status of the property?', type: 'select', field: 'property_status', options: ['Ready to Move In', 'Under Construction', 'New Construction Planned', 'Resale'] },
        { text: 'Where is the property located?', type: 'text', field: 'property_location', options: [], placeholder: 'Enter property address' },
        { text: 'What type of employment do you have?', type: 'select', field: 'employment_type', options: ['Salaried', 'Self-employed Professional', 'Business Owner', 'Other'] },
        { text: 'What is your monthly income?', type: 'number', field: 'monthly_income', options: [], placeholder: 'Enter monthly income' },
        { text: 'What loan tenure are you looking for?', type: 'select', field: 'loan_tenure', options: ['5 years', '10 years', '15 years', '20 years', '25 years', '30 years'] },
      ],
      'Car Loan': [
        { text: 'What is the make of the car you want to purchase?', type: 'text', field: 'car_make', options: [], placeholder: 'E.g., Honda, Toyota, Maruti Suzuki' },
        { text: 'What is the model of the car?', type: 'text', field: 'car_model', options: [], placeholder: 'E.g., Civic, Corolla, Swift' },
        { text: 'What type of car are you purchasing?', type: 'select', field: 'car_type', options: ['New Car', 'Used Car'] },
        { text: 'What is the on-road price of the car?', type: 'number', field: 'car_value', options: [], placeholder: 'Enter car price' },
        { text: 'How much loan do you need?', type: 'number', field: 'loan_amount', options: [], placeholder: 'Enter loan amount' },
        { text: 'How much down payment can you make?', type: 'number', field: 'down_payment', options: [], placeholder: 'Enter down payment amount' },
        { text: 'What is your employment type?', type: 'select', field: 'employment_type', options: ['Salaried', 'Self-employed', 'Business Owner', 'Other'] },
        { text: 'What is your monthly income?', type: 'number', field: 'monthly_income', options: [], placeholder: 'Enter monthly income' },
        { text: 'What loan tenure are you looking for?', type: 'select', field: 'loan_tenure', options: ['1 year', '2 years', '3 years', '5 years', '7 years'] },
      ],
      'Business Loan': [
        { text: 'What is the name of your business?', type: 'text', field: 'business_name', options: [], placeholder: 'Enter business name' },
        { text: 'What type of business do you have?', type: 'select', field: 'business_type', options: ['Sole Proprietorship', 'Partnership', 'Limited Liability Partnership (LLP)', 'Private Limited Company', 'Other'] },
        { text: 'What industry does your business operate in?', type: 'select', field: 'business_industry', options: ['Retail', 'Manufacturing', 'Services', 'Information Technology', 'Hospitality', 'Healthcare', 'Education', 'Other'] },
        { text: 'How long have you been in business?', type: 'select', field: 'years_in_business', options: ['Less than 1 year', '1-3 years', '3-5 years', '5+ years'] },
        { text: "What is your business's annual revenue?", type: 'number', field: 'annual_revenue', options: [], placeholder: 'Enter annual revenue' },
        { text: 'What is the purpose of this business loan?', type: 'select', field: 'loan_purpose', options: ['Business Expansion', 'Equipment Purchase', 'Inventory Purchase', 'Working Capital', 'Debt Refinancing', 'Other'] },
        { text: 'How much loan amount do you need?', type: 'number', field: 'loan_amount', options: [], placeholder: 'Enter loan amount' },
        { text: 'Do you have any collateral to offer?', type: 'select', field: 'collateral', options: ['Property', 'Equipment', 'Inventory', 'Vehicle', 'No collateral'] },
      ],
    };

    // Clear existing questions first
    const { error: deleteError } = await supabase
      .from('loan_product_questions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error deleting existing questions:', deleteError);
    }

    // Insert questions for each loan type
    let totalInserted = 0;
    const errors: any[] = [];

    for (const [loanType, loanProductId] of Object.entries(loanProductMap)) {
      if (!loanProductId) continue;

      const questions = [...commonQuestions, ...(specificQuestions[loanType] || [])];
      
      const questionsToInsert = questions.map((q, i) => ({
        loan_product_id: loanProductId,
        question_text: q.text,
        question_type: q.type,
        field_name: q.field,
        options: q.options,
        is_required: true,
        sequence_order: i + 1,
        placeholder: q.placeholder || null,
        help_text: null,
      }));

      const { error: insertError, data } = await supabase
        .from('loan_product_questions')
        .insert(questionsToInsert);

      if (insertError) {
        errors.push({ loanType, error: insertError });
      } else {
        totalInserted += questionsToInsert.length;
      }
    }

    return {
      success: true,
      message: `Successfully migrated ${totalInserted} questions`,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error: any) {
    console.error('Migration error:', error);
    return {
      success: false,
      message: error.message || 'Migration failed',
    };
  }
};
