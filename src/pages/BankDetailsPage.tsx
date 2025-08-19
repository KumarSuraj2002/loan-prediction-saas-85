
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowLeft, CreditCard, Home, Car, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BankDetailsPage = () => {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [bank, setBank] = useState<any>(null);

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
        }
      } catch (error) {
        console.error('Error fetching bank:', error);
        navigate('/');
      }
    };

    if (bankId) {
      fetchBank();
    }
  }, [bankId, navigate]);

  if (!bank) {
    return (
      <div className="container py-16 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const personalLoanRate = bank.interestRates.personal;
  const mortgageLoanRate = bank.interestRates.mortgage;
  // Adding a mock car loan rate that's between personal and mortgage
  const carLoanRate = (bank.interestRates.personal * 0.8).toFixed(1);
  // Adding a mock education loan rate
  const educationLoanRate = (bank.interestRates.personal * 0.75).toFixed(1);

  const handleKnowMore = (loanType: string) => {
    // Navigate to the loan details page
    navigate(`/bank/${bankId}/loan/${encodeURIComponent(loanType)}`);
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Back Button */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="pl-0 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </div>
      
      {/* Bank Header */}
      <Card className="mb-10">
        <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-24 h-24 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-primary">{bank.logoText}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{bank.name}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {bank.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {bank.features.map((feature: string, index: number) => (
                <span key={index} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Loan Cards */}
      <h2 className="text-2xl font-bold mb-6">Available Loan Products</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Personal Loan Card */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="pb-3 bg-primary/5">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Personal Loan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-2">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="py-2 font-medium">Interest Rate (p.a.)</TableCell>
                  <TableCell className="py-2 text-right">{personalLoanRate}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2 font-medium">Max Tenure</TableCell>
                  <TableCell className="py-2 text-right">5 Years</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2 font-medium">Loan Amount Range</TableCell>
                  <TableCell className="py-2 text-right">₹50,000 - ₹25 Lakh</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2 font-medium">Example EMI (₹5 Lakh for 5 Years)</TableCell>
                  <TableCell className="py-2 text-right">₹{Math.round(10999 * personalLoanRate / 11)}/month</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleKnowMore("Personal Loan")}
            >
              Know More
            </Button>
          </CardFooter>
        </Card>

        {/* Home Loan Card */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="pb-3 bg-primary/5">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Home Loan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-2">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="py-2 font-medium">Interest Rate (p.a.)</TableCell>
                  <TableCell className="py-2 text-right">{mortgageLoanRate}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2 font-medium">Max Tenure</TableCell>
                  <TableCell className="py-2 text-right">20 Years</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2 font-medium">Loan Amount Range</TableCell>
                  <TableCell className="py-2 text-right">₹5 Lakh - ₹2 Cr</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2 font-medium">Example EMI (₹5 Lakh for 5 Years)</TableCell>
                  <TableCell className="py-2 text-right">₹{Math.round(4267 * mortgageLoanRate / 6.5)}/month</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleKnowMore("Home Loan")}
            >
              Know More
            </Button>
          </CardFooter>
        </Card>

        {/* Car Loan Card */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="pb-3 bg-primary/5">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Car Loan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-2">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="py-2 font-medium">Interest Rate (p.a.)</TableCell>
                  <TableCell className="py-2 text-right">{carLoanRate}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2 font-medium">Max Tenure</TableCell>
                  <TableCell className="py-2 text-right">7 Years</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2 font-medium">Loan Amount Range</TableCell>
                  <TableCell className="py-2 text-right">₹1 Lakh - ₹25 Lakh</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2 font-medium">Example EMI (₹5 Lakh for 5 Years)</TableCell>
                  <TableCell className="py-2 text-right">₹{Math.round(8127 * Number(carLoanRate) / 9.2)}/month</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleKnowMore("Car Loan")}
            >
              Know More
            </Button>
          </CardFooter>
        </Card>
        
        {/* Education Loan Card */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="pb-3 bg-primary/5">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Education Loan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-2">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="py-2 font-medium">Interest Rate (p.a.)</TableCell>
                  <TableCell className="py-2 text-right">{educationLoanRate}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2 font-medium">Max Tenure</TableCell>
                  <TableCell className="py-2 text-right">15 Years</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2 font-medium">Loan Amount Range</TableCell>
                  <TableCell className="py-2 text-right">₹50,000 - ₹75 Lakh</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2 font-medium">Example EMI (₹5 Lakh for 5 Years)</TableCell>
                  <TableCell className="py-2 text-right">₹{Math.round(7500 * Number(educationLoanRate) / 8.5)}/month</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleKnowMore("Education Loan")}
            >
              Know More
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BankDetailsPage;
