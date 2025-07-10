
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';

const EMICalculator = () => {
  // State for loan inputs
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8);
  const [loanTerm, setLoanTerm] = useState(20);
  
  // State for calculation results
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Chart data
  const [chartData, setChartData] = useState([
    { name: 'Principal', value: 0, fill: '#4ade80' },
    { name: 'Interest', value: 0, fill: '#f43f5e' }
  ]);

  // Input handlers
  const handleLoanAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value.replace(/,/g, ""), 10);
    if (!isNaN(value)) {
      setLoanAmount(value);
    } else {
      setLoanAmount(0);
    }
  };
  
  const handleInterestRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setInterestRate(Math.min(30, Math.max(1, value)));
    }
  };

  const handleLoanTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setLoanTerm(Math.min(40, Math.max(1, value)));
    }
  };

  // Slider handlers
  const handleLoanAmountSlider = (value: number[]) => {
    setLoanAmount(value[0]);
  };
  
  const handleInterestRateSlider = (value: number[]) => {
    setInterestRate(value[0]);
  };
  
  const handleLoanTermSlider = (value: number[]) => {
    setLoanTerm(value[0]);
  };

  // Calculate EMI and update chart
  useEffect(() => {
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    // Total number of payments
    const totalPayments = loanTerm * 12;
    
    // Calculate monthly payment (EMI)
    // Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    if (monthlyRate && totalPayments) {
      const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
      
      // Total payment and interest
      const total = emi * totalPayments;
      const interest = total - loanAmount;
      
      setMonthlyPayment(emi);
      setTotalPayment(total);
      setTotalInterest(interest);
      
      // Update chart data
      setChartData([
        { name: 'Principal', value: loanAmount, fill: '#4ade80' },
        { name: 'Interest', value: interest, fill: '#f43f5e' }
      ]);
    }
  }, [loanAmount, interestRate, loanTerm]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return value.toFixed(2) + '%';
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Calculator className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">EMI Calculator</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Plan your loan repayments with our easy-to-use EMI calculator.
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Inputs */}
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Loan Details</h2>
                  
                  {/* Loan Amount */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="loanAmount">Loan Amount</Label>
                      <span className="text-sm font-medium">{formatCurrency(loanAmount)}</span>
                    </div>
                    <Slider 
                      id="loanSlider"
                      min={50000}
                      max={10000000}
                      step={10000}
                      value={[loanAmount]}
                      onValueChange={handleLoanAmountSlider}
                    />
                    <Input 
                      id="loanAmount" 
                      type="text" 
                      value={loanAmount.toLocaleString()}
                      onChange={handleLoanAmountChange}
                    />
                  </div>
                  
                  {/* Interest Rate */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                      <span className="text-sm font-medium">{formatPercentage(interestRate)}</span>
                    </div>
                    <Slider 
                      id="interestSlider"
                      min={1}
                      max={30}
                      step={0.1}
                      value={[interestRate]}
                      onValueChange={handleInterestRateSlider}
                    />
                    <Input 
                      id="interestRate" 
                      type="number" 
                      value={interestRate}
                      onChange={handleInterestRateChange}
                      min={1}
                      max={30}
                      step={0.1}
                    />
                  </div>
                  
                  {/* Loan Term */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="loanTerm">Loan Term (years)</Label>
                      <span className="text-sm font-medium">{loanTerm} years</span>
                    </div>
                    <Slider 
                      id="termSlider"
                      min={1}
                      max={40}
                      step={1}
                      value={[loanTerm]}
                      onValueChange={handleLoanTermSlider}
                    />
                    <Input 
                      id="loanTerm" 
                      type="number" 
                      value={loanTerm}
                      onChange={handleLoanTermChange}
                      min={1}
                      max={40}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-8">
                <Card className="bg-primary/5">
                  <CardContent className="p-6 space-y-6">
                    <h2 className="text-2xl font-bold mb-6">Payment Summary</h2>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="font-medium">Monthly EMI</span>
                        <span className="text-xl font-bold text-primary">{formatCurrency(monthlyPayment)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="font-medium">Total Principal</span>
                        <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="font-medium">Total Interest</span>
                        <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-medium">Total Payment</span>
                        <span className="text-lg font-bold">{formatCurrency(totalPayment)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Chart */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Payment Breakdown</h3>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Loan Table Button */}
            <div className="mt-12 text-center">
              <Button size="lg">
                Generate Amortization Schedule
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                See a detailed month-by-month breakdown of your loan repayments
              </p>
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Understanding EMI Calculations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">How EMI is Calculated</h3>
                <p className="text-muted-foreground mb-4">
                  EMI stands for Equated Monthly Installment. It's the fixed amount you pay to the lender on a specific date each month. The EMI formula is:
                </p>
                <div className="bg-card p-4 rounded-md border mb-4">
                  <p className="font-medium text-center">
                    EMI = P × r × (1 + r)ⁿ ÷ [(1 + r)ⁿ - 1]
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Where:<br />
                  P = Principal loan amount<br />
                  r = Monthly interest rate (annual rate ÷ 12 ÷ 100)<br />
                  n = Total number of monthly payments (tenure in years × 12)
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Factors Affecting EMI</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li><span className="font-medium">Loan Amount:</span> Higher loan amounts result in higher EMIs.</li>
                  <li><span className="font-medium">Interest Rate:</span> Higher interest rates increase the EMI and total interest paid.</li>
                  <li><span className="font-medium">Loan Tenure:</span> Longer tenures reduce the monthly EMI but increase the total interest paid.</li>
                  <li><span className="font-medium">Down Payment:</span> A larger down payment reduces the loan amount and the EMI.</li>
                  <li><span className="font-medium">Processing Fees:</span> Although not part of EMI, these affect your upfront costs.</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3">EMI Calculation Tips</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Consider a higher down payment to reduce your loan burden.</li>
                <li>Compare offers from different lenders to get the best interest rate.</li>
                <li>Your EMI ideally shouldn't exceed 40-50% of your monthly income.</li>
                <li>A shorter loan tenure means less interest paid overall.</li>
                <li>Make prepayments when possible to reduce the principal and interest.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary/5">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Apply for a Loan?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Use our loan prediction tool to check your eligibility and get matched with the best lenders for your needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg">Check Loan Eligibility</Button>
              <Button variant="outline" size="lg">Find Best Banks</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EMICalculator;
