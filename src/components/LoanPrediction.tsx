
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Calculator, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { LoanPredictionResult, UserFinancialData } from "@/data/loanDataTypes";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  income: z.coerce.number().min(10000, "Income must be at least $10,000"),
  creditScore: z.coerce.number().min(300, "Credit score must be between 300-850").max(850, "Credit score must be between 300-850"),
  loanAmount: z.coerce.number().min(1000, "Loan amount must be at least $1,000"),
  loanTerm: z.coerce.number().min(1, "Loan term must be at least 1 year"),
  employment: z.string().min(1, "Please select employment status"),
  existingDebt: z.coerce.number().min(0, "Existing debt cannot be negative"),
  loanPurpose: z.string().min(1, "Please select loan purpose"),
});

const LoanPrediction = () => {
  const { toast } = useToast();
  const [result, setResult] = useState<LoanPredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<UserFinancialData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 50000,
      creditScore: 700,
      loanAmount: 15000,
      loanTerm: 3,
      employment: "full_time",
      existingDebt: 5000,
      loanPurpose: "personal",
    },
  });

  const onSubmit = (values: UserFinancialData) => {
    setIsCalculating(true);
    
    // Simple mock calculation (in a real app, this would be a backend call)
    setTimeout(() => {
      const debtToIncomeRatio = (values.existingDebt + values.loanAmount) / values.income;
      const approved = values.creditScore > 650 && debtToIncomeRatio < 0.43;
      const score = Math.min(850, Math.max(300, 
        values.creditScore - (debtToIncomeRatio * 100) + 
        (values.employment === "full_time" ? 50 : 0)
      ));
      
      const confidence = Math.min(100, Math.max(0,
        ((score - 600) / 250) * 100
      ));
      
      // Generate interest rate based on credit score and other factors
      const baseRate = 5.0;
      const creditScoreAdjustment = (800 - values.creditScore) / 100;
      const loanTermAdjustment = values.loanTerm * 0.25;
      const debtRatioAdjustment = debtToIncomeRatio * 10;
      
      const interestRate = baseRate + creditScoreAdjustment + loanTermAdjustment + debtRatioAdjustment;
      
      // Calculate monthly payment
      const monthlyInterestRate = interestRate / 100 / 12;
      const totalPayments = values.loanTerm * 12;
      const monthlyPayment = (
        values.loanAmount * monthlyInterestRate * 
        Math.pow(1 + monthlyInterestRate, totalPayments)
      ) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
      
      const newResult: LoanPredictionResult = {
        approved,
        score,
        confidence,
        interestRate: approved ? parseFloat(interestRate.toFixed(2)) : undefined,
        monthlyPayment: approved ? parseFloat(monthlyPayment.toFixed(2)) : undefined,
        reason: approved 
          ? "Based on your strong credit profile and manageable debt-to-income ratio."
          : "Your credit score or debt-to-income ratio may need improvement.",
        recommendation: approved
          ? "Consider shopping around for better rates, or using our bank finder below."
          : "Work on improving your credit score and reducing existing debt before applying."
      };
      
      setResult(newResult);
      setIsCalculating(false);
      
      toast({
        title: approved ? "Good News!" : "Heads Up",
        description: approved 
          ? "Your loan is likely to be approved." 
          : "Your loan may face challenges for approval.",
        duration: 5000,
      });
    }, 2000);
  };

  return (
    <section id="loan-prediction" className="responsive-section-padding">
      <div className="responsive-container">
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <h2 className="responsive-text-3xl font-bold">Smart Loan Prediction</h2>
          <p className="mt-2 sm:mt-3 responsive-text-xl text-muted-foreground max-w-[700px]">
            Enter your financial details below to get an instant prediction on your loan approval chances.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          <Card className="border shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Your Financial Profile
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Fill in your details to predict loan approval likelihood
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="income"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Income ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="50000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="creditScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credit Score (300-850)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="700" min="300" max="850" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="loanAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Amount ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="15000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="loanTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Term (Years)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="3" min="1" max="30" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="employment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select employment status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full_time">Full Time</SelectItem>
                              <SelectItem value="part_time">Part Time</SelectItem>
                              <SelectItem value="self_employed">Self Employed</SelectItem>
                              <SelectItem value="unemployed">Unemployed</SelectItem>
                              <SelectItem value="retired">Retired</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="existingDebt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Existing Debt ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="5000" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="loanPurpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Purpose</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select loan purpose" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="home">Home/Mortgage</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="debt_consolidation">Debt Consolidation</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full mt-4 sm:mt-6 h-11 sm:h-12 text-sm sm:text-base"
                    disabled={isCalculating}
                  >
                    {isCalculating ? "Calculating..." : "Calculate Loan Prediction"}
                    {!isCalculating && <ChevronRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className={`border shadow-sm ${result ? 'bg-card' : 'bg-muted/40'}`}>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Loan Prediction Results</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Our AI will analyze your data and predict loan approval
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[250px] sm:min-h-[300px] flex items-center justify-center p-4 sm:p-6 pt-0">
              {isCalculating ? (
                <div className="text-center w-full">
                  <div className="animate-pulse-gentle mb-3 sm:mb-4 text-sm sm:text-base">Analyzing your financial profile...</div>
                  <Progress value={45} className="w-full max-w-xs mx-auto" />
                </div>
              ) : result ? (
                <div className="w-full space-y-4 sm:space-y-6">
                  <div className="flex flex-col items-center justify-center gap-3 p-3 sm:p-4 rounded-lg bg-muted/50">
                    {result.approved ? (
                      <div className="rounded-full bg-green-100 p-2 sm:p-3">
                        <ThumbsUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-amber-100 p-2 sm:p-3">
                        <ThumbsDown className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
                      </div>
                    )}
                    <h3 className="text-lg sm:text-xl font-medium text-center">
                      {result.approved ? "Likely to be Approved" : "May Face Approval Challenges"}
                    </h3>
                    <p className="text-xs sm:text-sm text-center text-muted-foreground">
                      {result.reason}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Prediction Score</span>
                        <span className="font-medium">{result.score}/850</span>
                      </div>
                      <Progress value={(result.score - 300) / 5.5} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Prediction Confidence</span>
                        <span className="font-medium">{result.confidence.toFixed(0)}%</span>
                      </div>
                      <Progress value={result.confidence} className="h-2" />
                    </div>

                    {result.approved && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                        <div className="p-3 border rounded-md bg-card">
                          <p className="text-xs sm:text-sm text-muted-foreground">Est. Interest Rate</p>
                          <p className="text-base sm:text-lg font-semibold">{result.interestRate}%</p>
                        </div>
                        <div className="p-3 border rounded-md bg-card">
                          <p className="text-xs sm:text-sm text-muted-foreground">Monthly Payment</p>
                          <p className="text-base sm:text-lg font-semibold">₹{result.monthlyPayment}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {result.recommendation && (
                    <div className="rounded-md bg-primary/10 p-3 sm:p-4 text-xs sm:text-sm">
                      <strong>Recommendation:</strong> {result.recommendation}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <div className="mb-3 border border-dashed rounded-full p-3 sm:p-4 inline-flex">
                    <Calculator className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <p className="text-sm sm:text-base">Fill out the form to get your loan prediction</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground p-4 sm:p-6 pt-0">
              Note: This is a prediction based on the information provided and not a guarantee of loan approval.
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LoanPrediction;
