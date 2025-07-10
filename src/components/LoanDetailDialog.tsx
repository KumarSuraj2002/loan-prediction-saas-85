
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LoanDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  loanType: string;
  bankName: string;
  loanDetails: {
    interestRate: number;
    maxTenure: string;
    loanRange: string;
    exampleEmi: string;
    eligibility: string[];
    documents: string[];
    processingFee: string;
    prepaymentCharges: string;
    benefits: string[];
  };
}

const LoanDetailDialog: React.FC<LoanDetailDialogProps> = ({
  isOpen,
  onClose,
  loanType,
  bankName,
  loanDetails,
}) => {
  // Determine icon and color based on loan type
  const getLoanIcon = (type: string) => {
    switch (type) {
      case 'Personal Loan':
        return { bgColor: 'bg-blue-50', textColor: 'text-blue-600' };
      case 'Home Loan':
        return { bgColor: 'bg-green-50', textColor: 'text-green-600' };
      case 'Car Loan':
        return { bgColor: 'bg-amber-50', textColor: 'text-amber-600' };
      case 'Education Loan':
        return { bgColor: 'bg-purple-50', textColor: 'text-purple-600' };
      default:
        return { bgColor: 'bg-primary/10', textColor: 'text-primary' };
    }
  };

  const loanStyle = getLoanIcon(loanType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${loanStyle.bgColor}`}>
              <div className={`text-2xl font-bold ${loanStyle.textColor}`}>
                {loanType[0]}
              </div>
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {loanType} - {bankName}
              </DialogTitle>
              <DialogDescription>
                Comprehensive details about this loan product
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Key Features */}
          <div className="bg-card rounded-lg border p-5 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className={`mr-2 p-1 rounded ${loanStyle.bgColor} ${loanStyle.textColor}`}>
                <Check className="h-4 w-4" />
              </span>
              Key Features
            </h3>
            <Table>
              <TableBody>
                <TableRow className="hover:bg-accent/40">
                  <TableCell className="font-medium">Interest Rate</TableCell>
                  <TableCell className="text-right font-bold">{loanDetails.interestRate}% p.a.</TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/40">
                  <TableCell className="font-medium">Maximum Tenure</TableCell>
                  <TableCell className="text-right">{loanDetails.maxTenure}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/40">
                  <TableCell className="font-medium">Loan Amount Range</TableCell>
                  <TableCell className="text-right">{loanDetails.loanRange}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/40">
                  <TableCell className="font-medium">Example EMI</TableCell>
                  <TableCell className="text-right">{loanDetails.exampleEmi}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/40">
                  <TableCell className="font-medium">Processing Fee</TableCell>
                  <TableCell className="text-right">{loanDetails.processingFee}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/40">
                  <TableCell className="font-medium">Prepayment Charges</TableCell>
                  <TableCell className="text-right">{loanDetails.prepaymentCharges}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-medium">Important:</span> Interest rates may vary based on credit score, 
                loan amount, tenure, and relationship with the bank.
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Eligibility */}
            <Accordion type="single" collapsible className="w-full border rounded-lg shadow-sm">
              <AccordionItem value="eligibility" className="border-none">
                <AccordionTrigger className="px-4 py-3 hover:bg-accent/40">
                  <span className="flex items-center gap-2">
                    <Badge className={`${loanStyle.bgColor} ${loanStyle.textColor} hover:${loanStyle.bgColor}`}>Eligibility</Badge>
                    <span>Eligibility Criteria</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ul className="space-y-2">
                    {loanDetails.eligibility.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className={`h-5 w-5 ${loanStyle.textColor} mt-0.5 flex-shrink-0`} />
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Required Documents */}
            <Accordion type="single" collapsible className="w-full border rounded-lg shadow-sm">
              <AccordionItem value="documents" className="border-none">
                <AccordionTrigger className="px-4 py-3 hover:bg-accent/40">
                  <span className="flex items-center gap-2">
                    <Badge className={`${loanStyle.bgColor} ${loanStyle.textColor} hover:${loanStyle.bgColor}`}>Documents</Badge>
                    <span>Required Documents</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ul className="space-y-2">
                    {loanDetails.documents.map((document, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className={`h-5 w-5 ${loanStyle.textColor} mt-0.5 flex-shrink-0`} />
                        <span>{document}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Benefits */}
          <Accordion type="single" collapsible className="w-full border rounded-lg shadow-sm">
            <AccordionItem value="benefits" className="border-none">
              <AccordionTrigger className="px-4 py-3 hover:bg-accent/40">
                <span className="flex items-center gap-2">
                  <Badge className={`${loanStyle.bgColor} ${loanStyle.textColor} hover:${loanStyle.bgColor}`}>Benefits</Badge>
                  <span>Key Benefits</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ul className="space-y-2">
                  {loanDetails.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className={`h-5 w-5 ${loanStyle.textColor} mt-0.5 flex-shrink-0`} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoanDetailDialog;
