
interface BankOption {
  id: string;
  name: string;
  logoText: string; // We'll just use text in place of actual logo images
  rating: number;
  features: string[];
  accountTypes: string[];
  interestRates: {
    savings: number;
    checking: number;
    mortgage: number;
    personal: number;
  };
  locations: string[];
  description: string;
}

export const bankOptions: BankOption[] = [
  {
    id: "chase",
    name: "Chase Bank",
    logoText: "CHASE",
    rating: 4.2,
    features: ["Mobile Banking", "24/7 Customer Service", "Large ATM Network", "Investment Options"],
    accountTypes: ["Checking", "Savings", "Credit Card", "Mortgage"],
    interestRates: {
      savings: 0.01,
      checking: 0.0,
      mortgage: 6.5,
      personal: 10.99
    },
    locations: ["Urban", "Suburban"],
    description: "A global financial services firm offering a wide range of products for personal and business banking needs."
  },
  {
    id: "bofa",
    name: "Bank of America",
    logoText: "BOA",
    rating: 4.0,
    features: ["Mobile Banking", "Rewards Program", "Financial Centers", "Auto Loans"],
    accountTypes: ["Checking", "Savings", "Investment", "Mortgage"],
    interestRates: {
      savings: 0.02,
      checking: 0.0,
      mortgage: 6.75,
      personal: 11.25
    },
    locations: ["Urban", "Suburban", "Rural"],
    description: "Offers comprehensive banking solutions with a focus on digital innovation and accessibility."
  },
  {
    id: "wells",
    name: "Wells Fargo",
    logoText: "WELLS",
    rating: 3.8,
    features: ["Online Bill Pay", "Mobile Deposit", "Financial Planning", "Student Loans"],
    accountTypes: ["Checking", "Savings", "Business", "Mortgage"],
    interestRates: {
      savings: 0.01,
      checking: 0.0,
      mortgage: 6.6,
      personal: 11.5
    },
    locations: ["Urban", "Suburban", "Rural"],
    description: "Provides personal, small business and commercial financial services with thousands of branches nationwide."
  },
  {
    id: "ally",
    name: "Ally Bank",
    logoText: "ALLY",
    rating: 4.5,
    features: ["No Fees", "High APY", "24/7 Support", "Easy Transfers"],
    accountTypes: ["Online Savings", "Online Checking", "Money Market", "CDs"],
    interestRates: {
      savings: 3.75,
      checking: 0.25,
      mortgage: 6.25,
      personal: 9.75
    },
    locations: ["Online"],
    description: "An online-only bank offering competitive rates with no monthly maintenance fees or minimum balance requirements."
  },
  {
    id: "discover",
    name: "Discover Bank",
    logoText: "DISCOVER",
    rating: 4.4,
    features: ["Cash Back", "No Annual Fee", "No Overdraft Fee", "FICO Score"],
    accountTypes: ["Online Savings", "Online Checking", "Credit Card", "Personal Loans"],
    interestRates: {
      savings: 3.5,
      checking: 0.2,
      mortgage: 0,
      personal: 8.99
    },
    locations: ["Online"],
    description: "Offers online banking services with cash back rewards on debit card purchases and no-fee banking."
  }
];

// Additional banks to be shown when clicking "View More"
export const additionalBanks = [
  {
    id: "citi",
    name: "Citibank",
    logoText: "CITI",
    rating: 4.1,
    features: ["Mobile Banking", "Global Access", "Investment Options", "Premium Cards"],
    accountTypes: ["Checking", "Savings", "Credit Card", "Investment"],
    interestRates: {
      savings: 0.05,
      checking: 0.01,
      mortgage: 6.45,
      personal: 10.75
    },
    locations: ["Urban", "Suburban", "Online"],
    description: "Global bank with comprehensive personal and business financial services and international presence."
  },
  {
    id: "capital",
    name: "Capital One",
    logoText: "CAPITAL",
    rating: 4.3,
    features: ["No Fees", "High APY", "Cash Back Rewards", "Mobile Banking"],
    accountTypes: ["Checking", "Savings", "Credit Card", "Auto Loans"],
    interestRates: {
      savings: 3.3,
      checking: 0.1,
      mortgage: 6.4,
      personal: 9.5
    },
    locations: ["Urban", "Suburban", "Online"],
    description: "Modern bank offering competitive rates, innovative digital tools, and popular rewards credit cards."
  },
  {
    id: "usbank",
    name: "US Bank",
    logoText: "USB",
    rating: 3.9,
    features: ["Extensive Branches", "Business Banking", "Mobile Banking", "Investment Services"],
    accountTypes: ["Checking", "Savings", "Credit Card", "Mortgage", "Business"],
    interestRates: {
      savings: 0.01,
      checking: 0.0,
      mortgage: 6.55,
      personal: 11.0
    },
    locations: ["Urban", "Suburban", "Rural"],
    description: "Full-service bank with extensive branch network and diverse financial products for individuals and businesses."
  },
  {
    id: "sofi",
    name: "SoFi",
    logoText: "SOFI",
    rating: 4.6,
    features: ["No Fees", "High APY", "Cash Rewards", "Investment Options"],
    accountTypes: ["Checking", "Savings", "Credit Card", "Student Loans", "Mortgage"],
    interestRates: {
      savings: 4.0,
      checking: 0.5,
      mortgage: 6.1,
      personal: 8.5
    },
    locations: ["Online"],
    description: "Modern fintech company offering high-interest accounts with no fees and comprehensive financial products."
  }
];

export const getMatchingBanks = (preferences: {
  bankingNeed: string;
  preferredFeatures: string[];
  locationPreference: string;
  accountType: string;
  interestRatePriority?: string;
}): BankOption[] => {
  // Simple algorithm to match banks based on preferences
  return bankOptions.filter(bank => {
    // Location match
    if (preferences.locationPreference !== "Any" && 
        !bank.locations.includes(preferences.locationPreference) && 
        bank.locations[0] !== "Online") {
      return false;
    }
    
    // Account type match
    if (preferences.accountType !== "Any" &&
        !bank.accountTypes.some(type => type.toLowerCase().includes(preferences.accountType.toLowerCase()))) {
      return false;  
    }
    
    // Need at least one preferred feature
    if (preferences.preferredFeatures.length > 0) {
      const hasMatchingFeature = preferences.preferredFeatures.some(feature => 
        bank.features.some(bankFeature => bankFeature.toLowerCase().includes(feature.toLowerCase()))
      );
      if (!hasMatchingFeature) return false;
    }
    
    // Banking need match (based on account types and interest rates)
    if (preferences.bankingNeed) {
      // For savings or checking accounts, verify the bank offers them
      if ((preferences.bankingNeed === 'savings' || preferences.bankingNeed === 'checking') && 
          !bank.accountTypes.some(type => type.toLowerCase().includes(preferences.bankingNeed))) {
        return false;
      }
      
      // For mortgage or personal loans, verify the bank offers non-zero rates
      if (preferences.bankingNeed === 'mortgage' && bank.interestRates.mortgage === 0) {
        return false;
      }
      if (preferences.bankingNeed === 'personal' && bank.interestRates.personal === 0) {
        return false;
      }
    }
    
    // Interest rate priority filtering
    if (preferences.interestRatePriority) {
      // High savings rate priority: filter for banks with above-average savings rates
      if (preferences.interestRatePriority === 'high_savings') {
        const avgSavingsRate = bankOptions.reduce((sum, b) => sum + b.interestRates.savings, 0) / bankOptions.length;
        if (bank.interestRates.savings <= avgSavingsRate) {
          return false;
        }
      }
      
      // Low mortgage rate priority: filter for banks with below-average mortgage rates (if they offer mortgages)
      if (preferences.interestRatePriority === 'low_mortgage' && bank.interestRates.mortgage > 0) {
        const mortgageBanks = bankOptions.filter(b => b.interestRates.mortgage > 0);
        const avgMortgageRate = mortgageBanks.reduce((sum, b) => sum + b.interestRates.mortgage, 0) / mortgageBanks.length;
        if (bank.interestRates.mortgage >= avgMortgageRate) {
          return false;
        }
      }
      
      // Low personal loan rate priority: filter for banks with below-average personal loan rates (if they offer them)
      if (preferences.interestRatePriority === 'low_personal' && bank.interestRates.personal > 0) {
        const personalLoanBanks = bankOptions.filter(b => b.interestRates.personal > 0);
        const avgPersonalRate = personalLoanBanks.reduce((sum, b) => sum + b.interestRates.personal, 0) / personalLoanBanks.length;
        if (bank.interestRates.personal >= avgPersonalRate) {
          return false;
        }
      }
    }
    
    return true;
  }).sort((a, b) => b.rating - a.rating);
};
