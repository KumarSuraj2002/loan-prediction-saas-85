
import React from 'react';
import LoanTypeSelector from '../components/LoanApplication/LoanTypeSelector';
import LoanApplicationForm from '../components/LoanApplication/LoanApplicationForm';
import { useParams, useNavigate } from 'react-router-dom';

const LoanApplication = () => {
  const { loanType } = useParams();
  const navigate = useNavigate();
  
  // If no loan type is selected, show the loan type selector
  if (!loanType) {
    return <LoanTypeSelector />;
  }
  
  // If loan type is selected, show the application form
  return <LoanApplicationForm loanType={loanType} />;
};

export default LoanApplication;
