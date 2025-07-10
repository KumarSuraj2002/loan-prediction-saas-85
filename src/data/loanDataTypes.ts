
export interface UserFinancialData {
  income: number;
  creditScore: number;
  loanAmount: number;
  loanTerm: number;
  employment: string;
  existingDebt: number;
  loanPurpose: string;
}

export interface LoanPredictionResult {
  approved: boolean;
  interestRate?: number;
  monthlyPayment?: number;
  reason?: string;
  score: number;
  confidence: number;
  recommendation?: string;
}

export interface UserPreferences {
  bankingNeed: string;
  preferredFeatures: string[];
  locationPreference: string;
  accountType: string;
  interestRatePriority?: string;
}
