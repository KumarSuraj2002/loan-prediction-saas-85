
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LoanTypeSelector = () => {
  const navigate = useNavigate();
  const [loanTypes, setLoanTypes] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchActiveLoanProducts();
  }, []);
  
  const fetchActiveLoanProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_products')
        .select('name')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      
      // Map loan product names to IDs used in routing
      const nameToIdMap: Record<string, string> = {
        'Personal Loan': 'personal',
        'Home Loan': 'home',
        'Car Loan': 'car',
        'Education Loan': 'education',
        'Business Loan': 'business'
      };
      
      const mappedLoanTypes = data
        .map(product => ({
          id: nameToIdMap[product.name] || product.name.toLowerCase().replace(' ', '-'),
          name: product.name
        }))
        .filter(loan => loan.id); // Only include loans with valid IDs
      
      setLoanTypes(mappedLoanTypes);
    } catch (error) {
      console.error('Error fetching loan products:', error);
      toast.error('Failed to load loan types');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoanTypeSelect = (loanTypeId: string) => {
    navigate(`/loan-application/${loanTypeId}`);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="max-w-3xl mx-auto bg-card p-4 sm:p-6 md:p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">Type of Desired Loan</h1>
          <div className="text-center py-8 text-muted-foreground">Loading loan types...</div>
        </div>
      </div>
    );
  }
  
  if (loanTypes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="max-w-3xl mx-auto bg-card p-4 sm:p-6 md:p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">Type of Desired Loan</h1>
          <div className="text-center py-8 text-muted-foreground">No loan products available at the moment.</div>
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
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
