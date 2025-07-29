
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const LoanTypeSelector = () => {
  const navigate = useNavigate();
  
  const loanTypes = [
    { id: 'personal', name: 'Personal Loan' },
    { id: 'home', name: 'Home Loan' },
    { id: 'car', name: 'Car Loan' },
    { id: 'education', name: 'Education Loan' },
    { id: 'business', name: 'Business Loan' }
  ];
  
  const handleLoanTypeSelect = (loanTypeId: string) => {
    navigate(`/loan-application/${loanTypeId}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto bg-card p-4 sm:p-6 md:p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">Type of Desired Loan</h1>
        
        <div className="space-y-3 sm:space-y-4">
          {loanTypes.map((loanType) => (
            <Card 
              key={loanType.id}
              className="p-3 sm:p-4 cursor-pointer hover:bg-accent transition-colors border"
              onClick={() => handleLoanTypeSelect(loanType.id)}
            >
              <div className="text-base sm:text-lg text-foreground">{loanType.name}</div>
            </Card>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
          <Button 
            variant="default" 
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
            disabled={true}
          >
            Next
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanTypeSelector;
