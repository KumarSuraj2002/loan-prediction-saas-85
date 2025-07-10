
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LoanApplicationFormProps {
  loanType: string;
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ loanType }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  // Map URL loan type to internal loan type key
  const mapLoanTypeToKey = (urlLoanType: string): string => {
    const loanTypeMapping: Record<string, string> = {
      'Personal Loan': 'personal',
      'Home Loan': 'home',
      'Car Loan': 'car',
      'Education Loan': 'education',
      'Business Loan': 'business',
      // Also handle lowercase versions in case they come from the selector
      'personal': 'personal',
      'home': 'home',
      'car': 'car',
      'education': 'education',
      'business': 'business'
    };
    
    return loanTypeMapping[urlLoanType] || 'personal';
  };

  const loanTypeKey = mapLoanTypeToKey(loanType);

  // Get questions based on loan type
  const questions = getLoanQuestions(loanTypeKey);
  const totalSteps = questions.length;

  const handleInputChange = (questionId: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/loan-application'); // Go back to loan type selection
    }
  };

  const handleSubmit = () => {
    // In a real app, you would submit the data to your backend
    console.log('Form submitted:', formData);
    toast({
      title: "Application Submitted",
      description: `Your ${getLoanTypeLabel(loanTypeKey)} application has been submitted successfully.`,
    });
    navigate('/');
  };

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-2">{getLoanTypeLabel(loanTypeKey)}</h1>
        <div className="mb-8 text-sm text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </div>

        <Card className="p-6 mb-8">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
          
          {renderQuestionInput(currentQuestion, handleInputChange, formData)}
        </Card>

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
          {isLastStep ? (
            <Button 
              variant="default" 
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Submit
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getLoanTypeLabel(loanType: string): string {
  const labels: Record<string, string> = {
    personal: 'Personal Loan',
    home: 'Home Loan',
    car: 'Car Loan',
    education: 'Education Loan',
    business: 'Business Loan'
  };
  return labels[loanType] || 'Loan Application';
}

function renderQuestionInput(question: any, handleChange: any, formData: any) {
  const value = formData[question.id] || '';
  
  switch (question.type) {
    case 'text':
      return (
        <div className="space-y-2">
          <Label htmlFor={question.id}>{question.label}</Label>
          <Input 
            id={question.id}
            placeholder={question.placeholder || ''}
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value)}
          />
          {question.helpText && <p className="text-sm text-muted-foreground">{question.helpText}</p>}
        </div>
      );
    
    case 'number':
      return (
        <div className="space-y-2">
          <Label htmlFor={question.id}>{question.label}</Label>
          <Input 
            id={question.id}
            type="number" 
            placeholder={question.placeholder || ''}
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value)}
          />
          {question.helpText && <p className="text-sm text-muted-foreground">{question.helpText}</p>}
        </div>
      );
    
    case 'radio':
      return (
        <div className="space-y-3">
          <div className="font-medium">{question.label}</div>
          <RadioGroup 
            value={value}
            onValueChange={(value) => handleChange(question.id, value)}
          >
            {question.options.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {question.helpText && <p className="text-sm text-muted-foreground">{question.helpText}</p>}
        </div>
      );
      
    default:
      return null;
  }
}

function getLoanQuestions(loanType: string) {
  const commonQuestions = [
    {
      id: 'fullName',
      type: 'text',
      question: 'What is your full name?',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true
    },
    {
      id: 'dob',
      type: 'text',
      question: 'What is your date of birth?',
      label: 'Date of Birth',
      placeholder: 'DD/MM/YYYY',
      required: true
    },
    {
      id: 'email',
      type: 'text',
      question: 'What is your email address?',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true
    },
    {
      id: 'phone',
      type: 'text',
      question: 'What is your phone number?',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      required: true
    },
    {
      id: 'address',
      type: 'text',
      question: 'What is your current address?',
      label: 'Current Address',
      placeholder: 'Enter your address',
      required: true
    }
  ];
  
  const specificQuestions: Record<string, any[]> = {
    personal: [
      {
        id: 'loanAmount',
        type: 'number',
        question: 'How much money would you like to borrow?',
        label: 'Loan Amount (₹)',
        placeholder: 'Enter amount',
        required: true
      },
      {
        id: 'loanPurpose',
        type: 'radio',
        question: 'What is the purpose of this loan?',
        label: 'Loan Purpose',
        options: [
          { value: 'medical', label: 'Medical Expenses' },
          { value: 'debt_consolidation', label: 'Debt Consolidation' },
          { value: 'home_improvement', label: 'Home Improvement' },
          { value: 'wedding', label: 'Wedding' },
          { value: 'other', label: 'Other' }
        ],
        required: true
      },
      {
        id: 'employmentStatus',
        type: 'radio',
        question: 'What is your current employment status?',
        label: 'Employment Status',
        options: [
          { value: 'full_time', label: 'Full-time employed' },
          { value: 'part_time', label: 'Part-time employed' },
          { value: 'self_employed', label: 'Self-employed' },
          { value: 'unemployed', label: 'Unemployed' },
          { value: 'retired', label: 'Retired' }
        ],
        required: true
      },
      {
        id: 'monthlyIncome',
        type: 'number',
        question: 'What is your monthly income?',
        label: 'Monthly Income (₹)',
        placeholder: 'Enter amount',
        required: true
      },
      {
        id: 'existingLoans',
        type: 'radio',
        question: 'Do you have any existing loans?',
        label: 'Existing Loans',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        required: true
      },
      {
        id: 'creditScore',
        type: 'radio',
        question: 'What is your credit score range?',
        label: 'Credit Score Range',
        options: [
          { value: 'excellent', label: 'Excellent (750+)' },
          { value: 'good', label: 'Good (700-749)' },
          { value: 'fair', label: 'Fair (650-699)' },
          { value: 'poor', label: 'Poor (600-649)' },
          { value: 'bad', label: 'Bad (below 600)' },
          { value: 'unknown', label: 'I don\'t know' }
        ],
        required: true
      },
      {
        id: 'loanTerm',
        type: 'radio',
        question: 'What loan term are you looking for?',
        label: 'Loan Term',
        options: [
          { value: '1', label: '1 year' },
          { value: '2', label: '2 years' },
          { value: '3', label: '3 years' },
          { value: '5', label: '5 years' }
        ],
        required: true
      }
    ],
    
    education: [
      {
        id: 'instituteName',
        type: 'text',
        question: 'What is the name of the educational institution?',
        label: 'Institution Name',
        placeholder: 'Enter institution name',
        required: true
      },
      {
        id: 'courseName',
        type: 'text',
        question: 'What course are you planning to study?',
        label: 'Course Name',
        placeholder: 'Enter course name',
        required: true
      },
      {
        id: 'courseCountry',
        type: 'radio',
        question: 'Where is the institution located?',
        label: 'Course Location',
        options: [
          { value: 'india', label: 'India' },
          { value: 'usa', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'canada', label: 'Canada' },
          { value: 'australia', label: 'Australia' },
          { value: 'other', label: 'Other' }
        ],
        required: true
      },
      {
        id: 'courseDuration',
        type: 'radio',
        question: 'What is the duration of the course?',
        label: 'Course Duration',
        options: [
          { value: 'less_than_1', label: 'Less than 1 year' },
          { value: '1_year', label: '1 year' },
          { value: '2_years', label: '2 years' },
          { value: '3_years', label: '3 years' },
          { value: '4_years', label: '4 years' },
          { value: '5_plus', label: '5+ years' }
        ],
        required: true
      },
      {
        id: 'totalFees',
        type: 'number',
        question: 'What is the total cost of education?',
        label: 'Total Course Fees (₹)',
        placeholder: 'Enter amount',
        required: true
      },
      {
        id: 'loanAmount',
        type: 'number',
        question: 'How much loan amount do you need?',
        label: 'Loan Amount Needed (₹)',
        placeholder: 'Enter amount',
        required: true
      },
      {
        id: 'admissionStatus',
        type: 'radio',
        question: 'What is your admission status?',
        label: 'Admission Status',
        options: [
          { value: 'confirmed', label: 'Confirmed admission' },
          { value: 'applied', label: 'Applied, waiting for decision' },
          { value: 'not_applied', label: 'Not yet applied' }
        ],
        required: true
      },
      {
        id: 'collateral',
        type: 'radio',
        question: 'Do you have any collateral to offer?',
        label: 'Collateral',
        options: [
          { value: 'property', label: 'Property' },
          { value: 'fixed_deposit', label: 'Fixed Deposit' },
          { value: 'none', label: 'No collateral' }
        ],
        required: true
      },
      {
        id: 'cosignerName',
        type: 'text',
        question: 'Who will be your co-applicant/guarantor?',
        label: 'Co-applicant Name',
        placeholder: 'Enter co-applicant name',
        required: true
      },
      {
        id: 'cosignerRelation',
        type: 'radio',
        question: 'What is your relationship with the co-applicant?',
        label: 'Relationship with Co-applicant',
        options: [
          { value: 'parent', label: 'Parent' },
          { value: 'sibling', label: 'Sibling' },
          { value: 'spouse', label: 'Spouse' },
          { value: 'relative', label: 'Other Relative' }
        ],
        required: true
      }
    ],
    
    home: [
      {
        id: 'propertyValue',
        type: 'number',
        question: 'What is the total value of the property?',
        label: 'Property Value (₹)',
        placeholder: 'Enter property value',
        required: true
      },
      {
        id: 'loanAmount',
        type: 'number',
        question: 'How much loan amount do you need?',
        label: 'Loan Amount (₹)',
        placeholder: 'Enter loan amount',
        required: true
      },
      {
        id: 'propertyType',
        type: 'radio',
        question: 'What type of property are you purchasing?',
        label: 'Property Type',
        options: [
          { value: 'apartment', label: 'Apartment/Flat' },
          { value: 'independent_house', label: 'Independent House' },
          { value: 'villa', label: 'Villa' },
          { value: 'plot', label: 'Plot of Land' }
        ],
        required: true
      },
      {
        id: 'propertyStatus',
        type: 'radio',
        question: 'What is the construction status of the property?',
        label: 'Property Status',
        options: [
          { value: 'ready_to_move', label: 'Ready to Move In' },
          { value: 'under_construction', label: 'Under Construction' },
          { value: 'new_construction', label: 'New Construction Planned' },
          { value: 'resale', label: 'Resale' }
        ],
        required: true
      },
      {
        id: 'propertyLocation',
        type: 'text',
        question: 'Where is the property located?',
        label: 'Property Location',
        placeholder: 'Enter property address',
        required: true
      },
      {
        id: 'employmentType',
        type: 'radio',
        question: 'What type of employment do you have?',
        label: 'Employment Type',
        options: [
          { value: 'salaried', label: 'Salaried' },
          { value: 'self_employed', label: 'Self-employed Professional' },
          { value: 'business', label: 'Business Owner' },
          { value: 'other', label: 'Other' }
        ],
        required: true
      },
      {
        id: 'monthlyIncome',
        type: 'number',
        question: 'What is your monthly income?',
        label: 'Monthly Income (₹)',
        placeholder: 'Enter monthly income',
        required: true
      },
      {
        id: 'loanTenure',
        type: 'radio',
        question: 'What loan tenure are you looking for?',
        label: 'Loan Tenure',
        options: [
          { value: '5', label: '5 years' },
          { value: '10', label: '10 years' },
          { value: '15', label: '15 years' },
          { value: '20', label: '20 years' },
          { value: '25', label: '25 years' },
          { value: '30', label: '30 years' }
        ],
        required: true
      }
    ],
    
    car: [
      {
        id: 'carMake',
        type: 'text',
        question: 'What is the make of the car you want to purchase?',
        label: 'Car Make',
        placeholder: 'E.g., Honda, Toyota, Maruti Suzuki',
        required: true
      },
      {
        id: 'carModel',
        type: 'text',
        question: 'What is the model of the car?',
        label: 'Car Model',
        placeholder: 'E.g., Civic, Corolla, Swift',
        required: true
      },
      {
        id: 'carType',
        type: 'radio',
        question: 'What type of car are you purchasing?',
        label: 'Car Type',
        options: [
          { value: 'new', label: 'New Car' },
          { value: 'used', label: 'Used Car' }
        ],
        required: true
      },
      {
        id: 'carValue',
        type: 'number',
        question: 'What is the on-road price of the car?',
        label: 'Car Price (₹)',
        placeholder: 'Enter car price',
        required: true
      },
      {
        id: 'loanAmount',
        type: 'number',
        question: 'How much loan do you need?',
        label: 'Loan Amount (₹)',
        placeholder: 'Enter loan amount',
        required: true
      },
      {
        id: 'downPayment',
        type: 'number',
        question: 'How much down payment can you make?',
        label: 'Down Payment (₹)',
        placeholder: 'Enter down payment amount',
        required: true
      },
      {
        id: 'employmentType',
        type: 'radio',
        question: 'What is your employment type?',
        label: 'Employment Type',
        options: [
          { value: 'salaried', label: 'Salaried' },
          { value: 'self_employed', label: 'Self-employed' },
          { value: 'business', label: 'Business Owner' },
          { value: 'other', label: 'Other' }
        ],
        required: true
      },
      {
        id: 'monthlyIncome',
        type: 'number',
        question: 'What is your monthly income?',
        label: 'Monthly Income (₹)',
        placeholder: 'Enter monthly income',
        required: true
      },
      {
        id: 'loanTenure',
        type: 'radio',
        question: 'What loan tenure are you looking for?',
        label: 'Loan Tenure',
        options: [
          { value: '1', label: '1 year' },
          { value: '2', label: '2 years' },
          { value: '3', label: '3 years' },
          { value: '5', label: '5 years' },
          { value: '7', label: '7 years' }
        ],
        required: true
      }
    ],
    
    business: [
      {
        id: 'businessName',
        type: 'text',
        question: 'What is the name of your business?',
        label: 'Business Name',
        placeholder: 'Enter business name',
        required: true
      },
      {
        id: 'businessType',
        type: 'radio',
        question: 'What type of business do you have?',
        label: 'Business Type',
        options: [
          { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
          { value: 'partnership', label: 'Partnership' },
          { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
          { value: 'pvt_ltd', label: 'Private Limited Company' },
          { value: 'other', label: 'Other' }
        ],
        required: true
      },
      {
        id: 'businessIndustry',
        type: 'radio',
        question: 'What industry does your business operate in?',
        label: 'Industry',
        options: [
          { value: 'retail', label: 'Retail' },
          { value: 'manufacturing', label: 'Manufacturing' },
          { value: 'services', label: 'Services' },
          { value: 'it', label: 'Information Technology' },
          { value: 'hospitality', label: 'Hospitality' },
          { value: 'healthcare', label: 'Healthcare' },
          { value: 'education', label: 'Education' },
          { value: 'other', label: 'Other' }
        ],
        required: true
      },
      {
        id: 'yearsInBusiness',
        type: 'radio',
        question: 'How long have you been in business?',
        label: 'Years in Business',
        options: [
          { value: 'less_than_1', label: 'Less than 1 year' },
          { value: '1_to_3', label: '1-3 years' },
          { value: '3_to_5', label: '3-5 years' },
          { value: '5_plus', label: '5+ years' }
        ],
        required: true
      },
      {
        id: 'annualRevenue',
        type: 'number',
        question: 'What is your business\'s annual revenue?',
        label: 'Annual Revenue (₹)',
        placeholder: 'Enter annual revenue',
        required: true
      },
      {
        id: 'loanPurpose',
        type: 'radio',
        question: 'What is the purpose of this business loan?',
        label: 'Loan Purpose',
        options: [
          { value: 'expansion', label: 'Business Expansion' },
          { value: 'equipment', label: 'Equipment Purchase' },
          { value: 'inventory', label: 'Inventory Purchase' },
          { value: 'working_capital', label: 'Working Capital' },
          { value: 'refinance', label: 'Debt Refinancing' },
          { value: 'other', label: 'Other' }
        ],
        required: true
      },
      {
        id: 'loanAmount',
        type: 'number',
        question: 'How much loan amount do you need?',
        label: 'Loan Amount (₹)',
        placeholder: 'Enter loan amount',
        required: true
      },
      {
        id: 'collateral',
        type: 'radio',
        question: 'Do you have any collateral to offer?',
        label: 'Collateral',
        options: [
          { value: 'property', label: 'Property' },
          { value: 'equipment', label: 'Equipment' },
          { value: 'inventory', label: 'Inventory' },
          { value: 'vehicle', label: 'Vehicle' },
          { value: 'none', label: 'No collateral' }
        ],
        required: true
      }
    ]
  };
  
  // Combine common questions with specific questions for the loan type
  return [...commonQuestions, ...(specificQuestions[loanType] || [])];
}

export default LoanApplicationForm;
