
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Home, Car, CreditCard } from "lucide-react";

interface BankDetailCardProps {
  bank: {
    id: string;
    name: string;
    logoText: string;
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
  };
  isOpen: boolean;
  onClose: () => void;
}

const BankDetailCard: React.FC<BankDetailCardProps> = ({ bank, isOpen, onClose }) => {
  const navigate = useNavigate();
  const personalLoanRate = bank.interestRates.personal;
  const mortgageLoanRate = bank.interestRates.mortgage;
  // Adding a mock car loan rate that's between personal and mortgage
  const carLoanRate = (bank.interestRates.personal * 0.8).toFixed(1);

  const handleKnowMore = (loanType: string) => {
    // Close the dialog and navigate to the loan details page
    onClose();
    navigate(`/bank/${bank.id}/loan/${encodeURIComponent(loanType)}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{bank.logoText}</span>
            </div>
            <span>{bank.name}</span>
          </DialogTitle>
          <DialogDescription>
            {bank.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <Card className="mb-6 bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.floor(bank.rating) ? "text-amber-500" : "text-gray-300"}`}>★</span>
                    ))}
                    <span className="text-sm ml-1 text-muted-foreground">({bank.rating})</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Features:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {bank.features.map((feature, index) => (
                      <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Available in:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {bank.locations.map((location, index) => (
                      <span key={index} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Personal Loan Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Personal Loan</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
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
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Home Loan</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
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
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Car Loan</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
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
          </div>

          {/* View Full Details Button */}
          <div className="flex justify-center">
            <Button 
              variant="outline"
              size="lg"
              onClick={() => {
                onClose();
                navigate(`/bank/${bank.id}`);
              }}
            >
              View Full Bank Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BankDetailCard;
