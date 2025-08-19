
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LoanDetailsPage = () => {
  const { bankId, loanType } = useParams();
  const navigate = useNavigate();
  const [bank, setBank] = useState<any>(null);
  const [loanDetails, setLoanDetails] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBank = async () => {
      try {
        const { data, error } = await supabase
          .from('banks')
          .select('*')
          .eq('id', bankId)
          .single();

        if (error) throw error;
        
        if (data) {
          // Transform Supabase data to match expected format
          const transformedBank = {
            id: data.id,
            name: data.name,
            logoText: data.logo_text,
            rating: data.rating,
            features: data.features,
            accountTypes: data.account_types,
            interestRates: data.interest_rates,
            locations: data.locations,
            description: data.description
          };
          setBank(transformedBank);
          
          // Generate loan details based on loan type and bank data
          const details = generateLoanDetails(loanType as string, transformedBank);
          setLoanDetails(details);
        }
      } catch (error) {
        console.error('Error fetching bank:', error);
        navigate('/');
      }
    };

    if (bankId) {
      fetchBank();
    }
  }, [bankId, loanType, navigate]);

  // Determine icon and color based on loan type
  const getLoanStyle = (type: string | undefined) => {
    switch (type) {
      case 'Personal Loan':
        return { bgColor: 'bg-blue-50', textColor: 'text-blue-600' };
      case 'Home Loan':
        return { bgColor: 'bg-green-50', textColor: 'text-green-600' };
      case 'Car Loan':
        return { bgColor: 'bg-amber-50', textColor: 'text-amber-600' };
      case 'Education Loan':
        return { bgColor: 'bg-purple-50', textColor: 'text-purple-600' };
      default:
        return { bgColor: 'bg-primary/10', textColor: 'text-primary' };
    }
  };

  const handleApplyNow = () => {
    // Show a toast notification
    toast({
      title: "Starting application",
      description: `Preparing ${loanType} application with ${bank.name}`,
    });
    
    // Navigate to loan application with loan type parameter
    navigate(`/loan-application/${encodeURIComponent(loanType as string)}`);
  };

  const loanStyle = getLoanStyle(loanType);

  if (!bank || !loanDetails) {
    return (
      <div className="container py-16 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Back Button */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="pl-0 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(`/bank/${bankId}`)}
        >
          <ArrowLeft className="h-4 w-4" /> Back to {bank.name}
        </Button>
      </div>
      
      {/* Loan Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-4 rounded-full ${loanStyle.bgColor}`}>
          <div className={`text-3xl font-bold ${loanStyle.textColor}`}>
            {loanType && loanType[0]}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{loanType} - {bank.name}</h1>
          <p className="text-lg text-muted-foreground">Comprehensive details about this loan product</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Key Features */}
        <Card className="shadow">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className={`mr-2 p-1 rounded ${loanStyle.bgColor} ${loanStyle.textColor}`}>
                <Check className="h-4 w-4" />
              </span>
              Key Features
            </h2>
            <Table>
              <TableBody>
                <TableRow className="hover:bg-accent/40">
                  <TableCell className="font-medium">Interest Rate</TableCell>
                  <TableCell className="text-right font-bold">{loanDetails.interestRate}% p.a.</TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/40">
                  <TableCell className="font-medium">Maximum Tenure</TableCell>
                  <TableCell className="text-right">{loanDetails.maxTenure}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/40">
                  <TableCell className="font-medium">Loan Amount Range</TableCell>
                  <TableCell className="text-right">{loanDetails.loanRange}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/40">
                  <TableCell className="font-medium">Example EMI</TableCell>
                  <TableCell className="text-right">{loanDetails.exampleEmi}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/40">
                  <TableCell className="font-medium">Processing Fee</TableCell>
                  <TableCell className="text-right">{loanDetails.processingFee}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/40">
                  <TableCell className="font-medium">Prepayment Charges</TableCell>
                  <TableCell className="text-right">{loanDetails.prepaymentCharges}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-6 p-3 bg-amber-50 text-amber-800 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-medium">Important:</span> Interest rates may vary based on credit score, 
                loan amount, tenure, and relationship with the bank.
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Eligibility */}
          <Card className="shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Badge className={`${loanStyle.bgColor} ${loanStyle.textColor} hover:${loanStyle.bgColor}`}>Eligibility</Badge>
                <span className="ml-2">Eligibility Criteria</span>
              </h2>
              <ul className="space-y-3">
                {loanDetails.eligibility.map((criteria: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className={`h-5 w-5 ${loanStyle.textColor} mt-0.5 flex-shrink-0`} />
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card className="shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Badge className={`${loanStyle.bgColor} ${loanStyle.textColor} hover:${loanStyle.bgColor}`}>Documents</Badge>
                <span className="ml-2">Required Documents</span>
              </h2>
              <ul className="space-y-3">
                {loanDetails.documents.map((document: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className={`h-5 w-5 ${loanStyle.textColor} mt-0.5 flex-shrink-0`} />
                    <span>{document}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <Card className="shadow">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Badge className={`${loanStyle.bgColor} ${loanStyle.textColor} hover:${loanStyle.bgColor}`}>Benefits</Badge>
              <span className="ml-2">Key Benefits</span>
            </h2>
            <ul className="space-y-3 grid md:grid-cols-2 gap-x-6">
              {loanDetails.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className={`h-5 w-5 ${loanStyle.textColor} mt-0.5 flex-shrink-0`} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Apply Now Section */}
        <div className="mt-8 flex flex-col items-center">
          <div className="max-w-xl text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Ready to Apply?</h2>
            <p className="text-muted-foreground">
              Get started with your {loanType} application at {bank.name} and receive a decision quickly.
            </p>
          </div>
          <Button 
            onClick={handleApplyNow}
            size="lg" 
            className="px-8 py-6 text-lg gap-2 bg-primary hover:bg-primary/90 transition-all transform hover:scale-105"
          >
            Apply Now <ArrowRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate loan details based on loan type and bank data
const generateLoanDetails = (loanType: string, bank: any) => {
  const personalLoanRate = bank.interestRates.personal;
  const mortgageLoanRate = bank.interestRates.mortgage;
  // Adding a mock car loan rate that's between personal and mortgage
  const carLoanRate = (bank.interestRates.personal * 0.8).toFixed(1);
  // Adding a mock education loan rate
  const educationLoanRate = (bank.interestRates.personal * 0.75).toFixed(1);

  let loanDetails;

  switch (loanType) {
    case "Personal Loan":
      loanDetails = {
        interestRate: personalLoanRate,
        maxTenure: "5 Years",
        loanRange: "₹50,000 - ₹25 Lakh",
        exampleEmi: `₹${Math.round(10999 * personalLoanRate / 11)}/month for ₹5 Lakh over 5 years`,
        eligibility: [
          "Age should be between 21-60 years",
          `Minimum monthly income of ₹${Math.round(personalLoanRate * 1500)}`,
          "Must be salaried or self-employed professional",
          "Minimum 1 year of work experience",
          "Good credit history with score above 700"
        ],
        documents: [
          "Identity proof (Aadhaar/PAN/Passport)",
          "Address proof (Utility bill/Aadhaar)",
          "Income proof (Salary slips of last 3 months)",
          "Bank statements of last 6 months",
          "2 passport-sized photographs"
        ],
        processingFee: `1-2% of loan amount (min ₹1,999, max ₹${Math.round(personalLoanRate * 1000)})`,
        prepaymentCharges: "2-5% of outstanding amount after 6 months",
        benefits: [
          "Quick approval within 48 hours",
          "No collateral required",
          "Flexible repayment options",
          "Special rates for existing customers",
          "Option to top-up loan after consistent repayment"
        ]
      };
      break;

    case "Home Loan":
      loanDetails = {
        interestRate: mortgageLoanRate,
        maxTenure: "20 Years",
        loanRange: "₹5 Lakh - ₹2 Cr",
        exampleEmi: `₹${Math.round(4267 * mortgageLoanRate / 6.5)}/month for ₹5 Lakh over 5 years`,
        eligibility: [
          "Age should be between 23-65 years",
          `Minimum monthly income of ₹${Math.round(mortgageLoanRate * 5000)}`,
          "Stable employment with at least 2 years of work experience",
          "Credit score above 750 for best rates",
          "Property should be approved by the bank"
        ],
        documents: [
          "Identity proof (Aadhaar/PAN/Passport)",
          "Address proof (Utility bill/Aadhaar)",
          "Income proof (Form 16, ITR for last 2 years)",
          "Bank statements of last 6 months",
          "Property documents and NOCs",
          "Employment proof and business stability documents"
        ],
        processingFee: `0.5-1% of loan amount (max ₹${Math.round(mortgageLoanRate * 5000)})`,
        prepaymentCharges: "Nil for floating rate loans, 2% for fixed rate loans",
        benefits: [
          "Tax benefits under Section 80C and 24",
          "Lower interest rates compared to personal loans",
          "Option to include spouse as co-applicant",
          "Balance transfer facility with top-up option",
          "Doorstep document collection service"
        ]
      };
      break;

    case "Car Loan":
      loanDetails = {
        interestRate: Number(carLoanRate),
        maxTenure: "7 Years",
        loanRange: "₹1 Lakh - ₹25 Lakh",
        exampleEmi: `₹${Math.round(8127 * Number(carLoanRate) / 9.2)}/month for ₹5 Lakh over 5 years`,
        eligibility: [
          "Age should be between 21-65 years",
          `Minimum monthly income of ₹${Math.round(Number(carLoanRate) * 3000)}`,
          "Stable employment with at least 1 year of work experience",
          "Credit score above 725",
          "Vehicle should be approved by the bank"
        ],
        documents: [
          "Identity proof (Aadhaar/PAN/Passport)",
          "Address proof (Utility bill/Aadhaar)",
          "Income proof (Form 16, salary slips)",
          "Bank statements of last 3 months",
          "Proforma invoice of the vehicle",
          "2 passport-sized photographs"
        ],
        processingFee: `1-1.5% of loan amount (max ₹${Math.round(Number(carLoanRate) * 2500)})`,
        prepaymentCharges: "2-6% of outstanding amount after 6 months",
        benefits: [
          "Quick approval within 24-48 hours",
          "Up to 100% financing for select models",
          "Flexible repayment options",
          "Special rates for existing customers",
          "Option for loan against used cars"
        ]
      };
      break;
        
    case "Education Loan":
      loanDetails = {
        interestRate: Number(educationLoanRate),
        maxTenure: "15 Years",
        loanRange: "₹50,000 - ₹75 Lakh",
        exampleEmi: `₹${Math.round(7500 * Number(educationLoanRate) / 8.5)}/month for ₹5 Lakh over 5 years`,
        eligibility: [
          "Secured admission in recognized institution",
          "Academic record with minimum 60% in previous education",
          "Co-applicant (parent/guardian) required",
          "Course should be job-oriented professional/technical",
          "Age should be between 18-35 years"
        ],
        documents: [
          "Identity proof (Aadhaar/PAN/Passport)",
          "Address proof (Utility bill/Aadhaar)",
          "Mark sheets of previous education",
          "Admission letter from institution",
          "Course fee structure",
          "Income proof of co-applicant",
          "Collateral documents (for loans above ₹7.5 Lakh)"
        ],
        processingFee: `0.5-1% of loan amount (max ₹${Math.round(Number(educationLoanRate) * 2000)})`,
        prepaymentCharges: "Nil",
        benefits: [
          "Tax benefits under Section 80E",
          "Moratorium period during study plus 6-12 months",
          "No collateral for loans up to ₹7.5 Lakh",
          "Option for part disbursement as per fee schedule",
          "Coverage for living expenses and equipment costs"
        ]
      };
      break;

    default:
      return null;
  }

  return loanDetails;
};

export default LoanDetailsPage;
