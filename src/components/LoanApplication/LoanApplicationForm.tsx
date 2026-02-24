
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface LoanApplicationFormProps {
  loanType: string;
}

interface FormData {
  [key: string]: string | number | boolean;
}

interface UploadedDoc {
  file: File;
  type: string;
  label: string;
}

const REQUIRED_DOCUMENTS = [
  { type: 'pan_card', label: 'PAN Card' },
  { type: 'aadhar_card', label: 'Aadhar Card' },
  { type: 'income_certificate', label: 'Income Certificate / Salary Slips' },
  { type: 'bank_statement', label: 'Bank Statements (last 3-6 months)' },
  { type: 'address_proof', label: 'Address Proof' },
];

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ loanType }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDoc>>({});
  const [submitting, setSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const mapLoanTypeToKey = (urlLoanType: string): string => {
    const loanTypeMapping: Record<string, string> = {
      'Personal Loan': 'personal', 'Home Loan': 'home', 'Car Loan': 'car',
      'Education Loan': 'education', 'Business Loan': 'business',
      'personal': 'personal', 'home': 'home', 'car': 'car',
      'education': 'education', 'business': 'business'
    };
    return loanTypeMapping[urlLoanType] || 'personal';
  };

  const loanTypeKey = mapLoanTypeToKey(loanType);
  const questions = getLoanQuestions(loanTypeKey);
  const totalSteps = questions.length;

  const handleInputChange = (questionId: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [questionId]: value }));
  };

  const validateCurrentQuestion = () => {
    const currentQuestion = questions[currentStep];
    const value = formData[currentQuestion.id];
    if (currentQuestion.required) {
      if (value === undefined || value === null || value === '') return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentQuestion()) {
      toast({ title: "Required Field", description: "Please answer the question before proceeding.", variant: "destructive" });
      return;
    }
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (showDocUpload) {
      setShowDocUpload(false);
      return;
    }
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else navigate('/loan-application');
  };

  const handleSubmitForm = async () => {
    if (!validateCurrentQuestion()) {
      toast({ title: "Required Field", description: "Please answer all questions before submitting.", variant: "destructive" });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        toast({ title: "Login Required", description: "Please login to submit a loan application.", variant: "destructive" });
        return;
      }

      const loanApplicationData = {
        applicant_name: String(formData.fullName || ''),
        email: String(formData.email || ''),
        phone: formData.phone ? String(formData.phone) : null,
        loan_type: getLoanTypeLabel(loanTypeKey),
        loan_amount: formData.loanAmount ? parseFloat(String(formData.loanAmount)) : 0,
        monthly_income: formData.monthlyIncome ? parseFloat(String(formData.monthlyIncome)) : 0,
        credit_score: formData.creditScore ? getCreditScoreValue(formData.creditScore) : null,
        employment_status: formData.employmentStatus ? String(formData.employmentStatus) : (formData.employmentType ? String(formData.employmentType) : null),
        application_data: formData,
        application_status: 'pending_documents',
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('loan_applications')
        .insert([loanApplicationData])
        .select('id')
        .single();

      if (error) throw error;

      setApplicationId(data.id);
      setShowDocUpload(true);
      toast({ title: "Form Submitted", description: "Now please upload the required documents to complete your application." });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({ title: "Submission Failed", description: "There was an error submitting your application.", variant: "destructive" });
    }
  };

  const handleFileSelect = (docType: string, docLabel: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }
    setUploadedDocs(prev => ({ ...prev, [docType]: { file, type: docType, label: docLabel } }));
  };

  const removeDoc = (docType: string) => {
    setUploadedDocs(prev => {
      const updated = { ...prev };
      delete updated[docType];
      return updated;
    });
  };

  const handleFinalSubmit = async () => {
    const missingDocs = REQUIRED_DOCUMENTS.filter(d => !uploadedDocs[d.type]);
    if (missingDocs.length > 0) {
      toast({
        title: "Documents Required",
        description: `Please upload: ${missingDocs.map(d => d.label).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    if (!applicationId) return;
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('Not authenticated');

      for (const [docType, doc] of Object.entries(uploadedDocs)) {
        const fileExt = doc.file.name.split('.').pop();
        const storagePath = `${user.id}/${applicationId}/${docType}_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('user-documents')
          .upload(storagePath, doc.file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('loan_application_documents')
          .insert({
            loan_application_id: applicationId,
            user_id: user.id,
            document_type: docType,
            document_name: doc.file.name,
            storage_path: storagePath,
          });

        if (dbError) throw dbError;
      }

      // Update application status to pending (documents uploaded)
      await supabase
        .from('loan_applications')
        .update({ application_status: 'pending' })
        .eq('id', applicationId);

      toast({ title: "Application Complete!", description: `Your ${getLoanTypeLabel(loanTypeKey)} application with documents has been submitted successfully.` });
      navigate('/');
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast({ title: "Upload Failed", description: "Failed to upload documents. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === totalSteps - 1;

  if (showDocUpload) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="max-w-3xl mx-auto bg-background p-4 sm:p-8 rounded-lg shadow-sm border">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{getLoanTypeLabel(loanTypeKey)}</h1>
          <p className="text-muted-foreground mb-6">Upload required documents to complete your application</p>

          <div className="space-y-4">
            {REQUIRED_DOCUMENTS.map((doc) => (
              <Card key={doc.type} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{doc.label}</p>
                      {uploadedDocs[doc.type] && (
                        <p className="text-xs text-muted-foreground">{uploadedDocs[doc.type].file.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {uploadedDocs[doc.type] ? (
                      <>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Uploaded
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeDoc(doc.type)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <input
                          type="file"
                          ref={el => { fileInputRefs.current[doc.type] = el; }}
                          onChange={(e) => handleFileSelect(doc.type, doc.label, e)}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="hidden"
                        />
                        <Button variant="outline" size="sm" onClick={() => fileInputRefs.current[doc.type]?.click()}>
                          <Upload className="h-4 w-4 mr-2" /> Choose File
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
            <Button variant="outline" onClick={handlePrevious} className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <ArrowLeft size={16} /> Back
            </Button>
            <Button onClick={handleFinalSubmit} disabled={submitting} className="flex items-center justify-center gap-2 w-full sm:w-auto">
              {submitting ? 'Uploading...' : 'Submit Application'}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto bg-background p-4 sm:p-8 rounded-lg shadow-sm border">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{getLoanTypeLabel(loanTypeKey)}</h1>
        <div className="mb-6 sm:mb-8 text-sm text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </div>

        <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-medium mb-4">{currentQuestion.question}</h3>
          {renderQuestionInput(currentQuestion, handleInputChange, formData)}
        </Card>

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
          <Button variant="outline" onClick={handlePrevious} className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <ArrowLeft size={16} /> Back
          </Button>
          {isLastStep ? (
            <Button variant="default" onClick={handleSubmitForm} className="flex items-center justify-center gap-2 w-full sm:w-auto">
              Next: Upload Documents <ArrowRight size={16} />
            </Button>
          ) : (
            <Button variant="default" onClick={handleNext} className="flex items-center justify-center gap-2 w-full sm:w-auto">
              Next <ArrowRight size={16} />
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
    personal: 'Personal Loan', home: 'Home Loan', car: 'Car Loan',
    education: 'Education Loan', business: 'Business Loan'
  };
  return labels[loanType] || 'Loan Application';
}

function getCreditScoreValue(creditScoreRange: string | number | boolean): number | null {
  const creditScoreString = String(creditScoreRange);
  const scoreMapping: Record<string, number> = {
    'excellent': 775, 'good': 725, 'fair': 675, 'poor': 625, 'bad': 575, 'unknown': 650
  };
  return scoreMapping[creditScoreString] || null;
}

function renderQuestionInput(question: any, handleChange: any, formData: any) {
  const value = formData[question.id] || '';
  
  switch (question.type) {
    case 'text':
      return (
        <div className="space-y-2">
          <Label htmlFor={question.id}>{question.label}</Label>
          <Input id={question.id} placeholder={question.placeholder || ''} value={value} onChange={(e) => handleChange(question.id, e.target.value)} />
          {question.helpText && <p className="text-sm text-muted-foreground">{question.helpText}</p>}
        </div>
      );
    case 'number':
      return (
        <div className="space-y-2">
          <Label htmlFor={question.id}>{question.label}</Label>
          <Input id={question.id} type="number" placeholder={question.placeholder || ''} value={value} onChange={(e) => handleChange(question.id, e.target.value)} />
          {question.helpText && <p className="text-sm text-muted-foreground">{question.helpText}</p>}
        </div>
      );
    case 'radio':
      return (
        <div className="space-y-3">
          <div className="font-medium text-sm sm:text-base">{question.label}</div>
          <RadioGroup value={value} onValueChange={(value) => handleChange(question.id, value)}>
            {question.options.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2 py-1">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label htmlFor={`${question.id}-${option.value}`} className="text-sm sm:text-base cursor-pointer">{option.label}</Label>
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
    { id: 'fullName', type: 'text', question: 'What is your full name?', label: 'Full Name', placeholder: 'Enter your full name', required: true },
    { id: 'dob', type: 'text', question: 'What is your date of birth?', label: 'Date of Birth', placeholder: 'DD/MM/YYYY', required: true },
    { id: 'email', type: 'text', question: 'What is your email address?', label: 'Email Address', placeholder: 'Enter your email', required: true },
    { id: 'phone', type: 'text', question: 'What is your phone number?', label: 'Phone Number', placeholder: 'Enter your phone number', required: true },
    { id: 'address', type: 'text', question: 'What is your current address?', label: 'Current Address', placeholder: 'Enter your address', required: true }
  ];
  
  const specificQuestions: Record<string, any[]> = {
    personal: [
      { id: 'loanAmount', type: 'number', question: 'How much money would you like to borrow?', label: 'Loan Amount (₹)', placeholder: 'Enter amount', required: true },
      { id: 'loanPurpose', type: 'radio', question: 'What is the purpose of this loan?', label: 'Loan Purpose', options: [{ value: 'medical', label: 'Medical Expenses' }, { value: 'debt_consolidation', label: 'Debt Consolidation' }, { value: 'home_improvement', label: 'Home Improvement' }, { value: 'wedding', label: 'Wedding' }, { value: 'other', label: 'Other' }], required: true },
      { id: 'employmentStatus', type: 'radio', question: 'What is your current employment status?', label: 'Employment Status', options: [{ value: 'full_time', label: 'Full-time employed' }, { value: 'part_time', label: 'Part-time employed' }, { value: 'self_employed', label: 'Self-employed' }, { value: 'unemployed', label: 'Unemployed' }, { value: 'retired', label: 'Retired' }], required: true },
      { id: 'monthlyIncome', type: 'number', question: 'What is your monthly income?', label: 'Monthly Income (₹)', placeholder: 'Enter amount', required: true },
      { id: 'existingLoans', type: 'radio', question: 'Do you have any existing loans?', label: 'Existing Loans', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], required: true },
      { id: 'creditScore', type: 'radio', question: 'What is your credit score range?', label: 'Credit Score Range', options: [{ value: 'excellent', label: 'Excellent (750+)' }, { value: 'good', label: 'Good (700-749)' }, { value: 'fair', label: 'Fair (650-699)' }, { value: 'poor', label: 'Poor (600-649)' }, { value: 'bad', label: 'Bad (below 600)' }, { value: 'unknown', label: "I don't know" }], required: true },
      { id: 'loanTerm', type: 'radio', question: 'What loan term are you looking for?', label: 'Loan Term', options: [{ value: '1', label: '1 year' }, { value: '2', label: '2 years' }, { value: '3', label: '3 years' }, { value: '5', label: '5 years' }], required: true }
    ],
    education: [
      { id: 'instituteName', type: 'text', question: 'What is the name of the educational institution?', label: 'Institution Name', placeholder: 'Enter institution name', required: true },
      { id: 'courseName', type: 'text', question: 'What course are you planning to study?', label: 'Course Name', placeholder: 'Enter course name', required: true },
      { id: 'courseCountry', type: 'radio', question: 'Where is the institution located?', label: 'Course Location', options: [{ value: 'india', label: 'India' }, { value: 'usa', label: 'United States' }, { value: 'uk', label: 'United Kingdom' }, { value: 'canada', label: 'Canada' }, { value: 'australia', label: 'Australia' }, { value: 'other', label: 'Other' }], required: true },
      { id: 'courseDuration', type: 'radio', question: 'What is the duration of the course?', label: 'Course Duration', options: [{ value: 'less_than_1', label: 'Less than 1 year' }, { value: '1_year', label: '1 year' }, { value: '2_years', label: '2 years' }, { value: '3_years', label: '3 years' }, { value: '4_years', label: '4 years' }, { value: '5_plus', label: '5+ years' }], required: true },
      { id: 'totalFees', type: 'number', question: 'What is the total cost of education?', label: 'Total Course Fees (₹)', placeholder: 'Enter amount', required: true },
      { id: 'loanAmount', type: 'number', question: 'How much loan amount do you need?', label: 'Loan Amount Needed (₹)', placeholder: 'Enter amount', required: true },
      { id: 'admissionStatus', type: 'radio', question: 'What is your admission status?', label: 'Admission Status', options: [{ value: 'confirmed', label: 'Confirmed admission' }, { value: 'applied', label: 'Applied, waiting for decision' }, { value: 'not_applied', label: 'Not yet applied' }], required: true },
      { id: 'collateral', type: 'radio', question: 'Do you have any collateral to offer?', label: 'Collateral', options: [{ value: 'property', label: 'Property' }, { value: 'fixed_deposit', label: 'Fixed Deposit' }, { value: 'none', label: 'No collateral' }], required: true },
      { id: 'cosignerName', type: 'text', question: 'Who will be your co-applicant/guarantor?', label: 'Co-applicant Name', placeholder: 'Enter co-applicant name', required: true },
      { id: 'cosignerRelation', type: 'radio', question: 'What is your relationship with the co-applicant?', label: 'Relationship with Co-applicant', options: [{ value: 'parent', label: 'Parent' }, { value: 'sibling', label: 'Sibling' }, { value: 'spouse', label: 'Spouse' }, { value: 'relative', label: 'Other Relative' }], required: true }
    ],
    home: [
      { id: 'propertyValue', type: 'number', question: 'What is the total value of the property?', label: 'Property Value (₹)', placeholder: 'Enter property value', required: true },
      { id: 'loanAmount', type: 'number', question: 'How much loan amount do you need?', label: 'Loan Amount (₹)', placeholder: 'Enter loan amount', required: true },
      { id: 'propertyType', type: 'radio', question: 'What type of property are you purchasing?', label: 'Property Type', options: [{ value: 'apartment', label: 'Apartment/Flat' }, { value: 'independent_house', label: 'Independent House' }, { value: 'villa', label: 'Villa' }, { value: 'plot', label: 'Plot of Land' }], required: true },
      { id: 'propertyStatus', type: 'radio', question: 'What is the construction status of the property?', label: 'Property Status', options: [{ value: 'ready_to_move', label: 'Ready to Move In' }, { value: 'under_construction', label: 'Under Construction' }, { value: 'new_construction', label: 'New Construction Planned' }, { value: 'resale', label: 'Resale' }], required: true },
      { id: 'propertyLocation', type: 'text', question: 'Where is the property located?', label: 'Property Location', placeholder: 'Enter property address', required: true },
      { id: 'employmentType', type: 'radio', question: 'What type of employment do you have?', label: 'Employment Type', options: [{ value: 'salaried', label: 'Salaried' }, { value: 'self_employed', label: 'Self-employed Professional' }, { value: 'business', label: 'Business Owner' }, { value: 'other', label: 'Other' }], required: true },
      { id: 'monthlyIncome', type: 'number', question: 'What is your monthly income?', label: 'Monthly Income (₹)', placeholder: 'Enter monthly income', required: true },
      { id: 'loanTenure', type: 'radio', question: 'What loan tenure are you looking for?', label: 'Loan Tenure', options: [{ value: '5', label: '5 years' }, { value: '10', label: '10 years' }, { value: '15', label: '15 years' }, { value: '20', label: '20 years' }, { value: '25', label: '25 years' }, { value: '30', label: '30 years' }], required: true }
    ],
    car: [
      { id: 'carMake', type: 'text', question: 'What is the make of the car you want to purchase?', label: 'Car Make', placeholder: 'E.g., Honda, Toyota, Maruti Suzuki', required: true },
      { id: 'carModel', type: 'text', question: 'What is the model of the car?', label: 'Car Model', placeholder: 'E.g., Civic, Corolla, Swift', required: true },
      { id: 'carType', type: 'radio', question: 'What type of car are you purchasing?', label: 'Car Type', options: [{ value: 'new', label: 'New Car' }, { value: 'used', label: 'Used Car' }], required: true },
      { id: 'carValue', type: 'number', question: 'What is the on-road price of the car?', label: 'Car Price (₹)', placeholder: 'Enter car price', required: true },
      { id: 'loanAmount', type: 'number', question: 'How much loan do you need?', label: 'Loan Amount (₹)', placeholder: 'Enter loan amount', required: true },
      { id: 'downPayment', type: 'number', question: 'How much down payment can you make?', label: 'Down Payment (₹)', placeholder: 'Enter down payment amount', required: true },
      { id: 'employmentType', type: 'radio', question: 'What is your employment type?', label: 'Employment Type', options: [{ value: 'salaried', label: 'Salaried' }, { value: 'self_employed', label: 'Self-employed' }, { value: 'business', label: 'Business Owner' }, { value: 'other', label: 'Other' }], required: true },
      { id: 'monthlyIncome', type: 'number', question: 'What is your monthly income?', label: 'Monthly Income (₹)', placeholder: 'Enter monthly income', required: true },
      { id: 'loanTenure', type: 'radio', question: 'What loan tenure are you looking for?', label: 'Loan Tenure', options: [{ value: '1', label: '1 year' }, { value: '2', label: '2 years' }, { value: '3', label: '3 years' }, { value: '5', label: '5 years' }, { value: '7', label: '7 years' }], required: true }
    ],
    business: [
      { id: 'businessName', type: 'text', question: 'What is the name of your business?', label: 'Business Name', placeholder: 'Enter business name', required: true },
      { id: 'businessType', type: 'radio', question: 'What type of business do you have?', label: 'Business Type', options: [{ value: 'sole_proprietorship', label: 'Sole Proprietorship' }, { value: 'partnership', label: 'Partnership' }, { value: 'llp', label: 'Limited Liability Partnership (LLP)' }, { value: 'pvt_ltd', label: 'Private Limited Company' }, { value: 'other', label: 'Other' }], required: true },
      { id: 'businessIndustry', type: 'radio', question: 'What industry does your business operate in?', label: 'Industry', options: [{ value: 'retail', label: 'Retail' }, { value: 'manufacturing', label: 'Manufacturing' }, { value: 'services', label: 'Services' }, { value: 'it', label: 'Information Technology' }, { value: 'hospitality', label: 'Hospitality' }, { value: 'healthcare', label: 'Healthcare' }, { value: 'education', label: 'Education' }, { value: 'other', label: 'Other' }], required: true },
      { id: 'yearsInBusiness', type: 'radio', question: 'How long have you been in business?', label: 'Years in Business', options: [{ value: 'less_than_1', label: 'Less than 1 year' }, { value: '1_to_3', label: '1-3 years' }, { value: '3_to_5', label: '3-5 years' }, { value: '5_plus', label: '5+ years' }], required: true },
      { id: 'annualRevenue', type: 'number', question: "What is your business's annual revenue?", label: 'Annual Revenue (₹)', placeholder: 'Enter annual revenue', required: true },
      { id: 'loanPurpose', type: 'radio', question: 'What is the purpose of this business loan?', label: 'Loan Purpose', options: [{ value: 'expansion', label: 'Business Expansion' }, { value: 'equipment', label: 'Equipment Purchase' }, { value: 'inventory', label: 'Inventory Purchase' }, { value: 'working_capital', label: 'Working Capital' }, { value: 'refinance', label: 'Debt Refinancing' }, { value: 'other', label: 'Other' }], required: true },
      { id: 'loanAmount', type: 'number', question: 'How much loan amount do you need?', label: 'Loan Amount (₹)', placeholder: 'Enter loan amount', required: true },
      { id: 'collateral', type: 'radio', question: 'Do you have any collateral to offer?', label: 'Collateral', options: [{ value: 'property', label: 'Property' }, { value: 'equipment', label: 'Equipment' }, { value: 'inventory', label: 'Inventory' }, { value: 'vehicle', label: 'Vehicle' }, { value: 'none', label: 'No collateral' }], required: true }
    ]
  };
  
  return [...commonQuestions, ...(specificQuestions[loanType] || [])];
}

export default LoanApplicationForm;
