
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
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-8">Type of Desired Loan</h1>
        
        <div className="space-y-4">
          {loanTypes.map((loanType) => (
            <Card 
              key={loanType.id}
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors border"
              onClick={() => handleLoanTypeSelect(loanType.id)}
            >
              <div className="text-lg text-gray-800">{loanType.name}</div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
          <Button 
            variant="default" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
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
