import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, TrendingUp, CheckCircle2, Info, AlertTriangle, BarChart3 } from "lucide-react";

type CreditRating = "Excellent" | "Good" | "Fair" | "Poor" | "Very Poor";

interface FactorScore {
  name: string;
  score: number;
  weight: number;
  weightedScore: number;
  explanation: string;
  suggestion: string;
}

interface CreditResult {
  score: number;
  rating: CreditRating;
  riskLevel: string;
  factors: FactorScore[];
}

const CreditScoreCalculator = () => {
  // Payment History
  const [latePayments, setLatePayments] = useState("");
  const [hasDefault, setHasDefault] = useState(false);

  // Credit Utilization
  const [creditLimit, setCreditLimit] = useState("");
  const [creditBalance, setCreditBalance] = useState("");

  // Credit History Length
  const [firstCreditYear, setFirstCreditYear] = useState("");

  // Credit Mix
  const [hasHomeLoan, setHasHomeLoan] = useState(false);
  const [hasCarLoan, setHasCarLoan] = useState(false);
  const [hasPersonalLoan, setHasPersonalLoan] = useState(false);
  const [hasCreditCard, setHasCreditCard] = useState(false);

  // New Credit Inquiries
  const [inquiries, setInquiries] = useState("");

  const [result, setResult] = useState<CreditResult | null>(null);

  const calculateScore = () => {
    const factors: FactorScore[] = [];

    // --- 1. Payment History (35%) ---
    let paymentScore: number;
    let paymentExplanation: string;
    let paymentSuggestion: string;
    const late = parseInt(latePayments) || 0;

    if (hasDefault) {
      paymentScore = 0;
      paymentExplanation = "Loan default or settlement detected. This severely impacts your score.";
      paymentSuggestion = "Clear all outstanding defaults. It takes 7 years for a default to be removed from your report.";
    } else if (late === 0) {
      paymentScore = 100;
      paymentExplanation = "Perfect payment track record with no late payments.";
      paymentSuggestion = "Keep up the excellent habit! Set up autopay to ensure consistency.";
    } else if (late <= 2) {
      paymentScore = 75;
      paymentExplanation = `${late} late payment(s) in the last 12 months.`;
      paymentSuggestion = "Set reminders or autopay to avoid future late payments. Each on-time payment helps recovery.";
    } else if (late <= 5) {
      paymentScore = 50;
      paymentExplanation = `${late} late payments detected — this moderately hurts your score.`;
      paymentSuggestion = "Prioritize clearing overdue payments immediately and set up autopay for all accounts.";
    } else {
      paymentScore = 30;
      paymentExplanation = `${late} late payments — this significantly impacts your creditworthiness.`;
      paymentSuggestion = "Seek a financial advisor. Focus on paying minimum dues on time before tackling larger debts.";
    }

    factors.push({
      name: "Payment History",
      score: paymentScore,
      weight: 0.35,
      weightedScore: paymentScore * 0.35,
      explanation: paymentExplanation,
      suggestion: paymentSuggestion,
    });

    // --- 2. Credit Utilization (30%) ---
    const limit = parseFloat(creditLimit) || 0;
    const balance = parseFloat(creditBalance) || 0;
    const utilPercent = limit > 0 ? (balance / limit) * 100 : 0;
    let utilScore: number;
    let utilExplanation: string;
    let utilSuggestion: string;

    if (limit === 0) {
      utilScore = 50;
      utilExplanation = "No credit card limit provided. Unable to assess utilization.";
      utilSuggestion = "Having a credit card with responsible usage helps build a stronger profile.";
    } else if (utilPercent < 30) {
      utilScore = 100;
      utilExplanation = `Excellent utilization at ${utilPercent.toFixed(0)}% — well below the 30% threshold.`;
      utilSuggestion = "Maintain utilization below 30% for optimal scores.";
    } else if (utilPercent <= 50) {
      utilScore = 80;
      utilExplanation = `Utilization at ${utilPercent.toFixed(0)}% — slightly above the ideal range.`;
      utilSuggestion = "Try to pay down balances to bring utilization below 30%.";
    } else if (utilPercent <= 75) {
      utilScore = 50;
      utilExplanation = `High utilization at ${utilPercent.toFixed(0)}% — this negatively impacts your score.`;
      utilSuggestion = "Pay more than the minimum due each month. Consider requesting a credit limit increase.";
    } else {
      utilScore = 20;
      utilExplanation = `Very high utilization at ${utilPercent.toFixed(0)}% — major negative impact.`;
      utilSuggestion = "Aggressively pay down credit card debt. Avoid making new charges until balance drops below 30%.";
    }

    factors.push({
      name: "Credit Utilization",
      score: utilScore,
      weight: 0.30,
      weightedScore: utilScore * 0.30,
      explanation: utilExplanation,
      suggestion: utilSuggestion,
    });

    // --- 3. Credit History Length (15%) ---
    const currentYear = new Date().getFullYear();
    const firstYear = parseInt(firstCreditYear) || currentYear;
    const historyYears = currentYear - firstYear;
    let historyScore: number;
    let historyExplanation: string;
    let historySuggestion: string;

    if (historyYears >= 8) {
      historyScore = 100;
      historyExplanation = `${historyYears} years of credit history — excellent track record.`;
      historySuggestion = "Your long credit history is a strong asset. Don't close your oldest accounts.";
    } else if (historyYears >= 5) {
      historyScore = 80;
      historyExplanation = `${historyYears} years of credit history — good length.`;
      historySuggestion = "Keep your oldest accounts active. Time will naturally strengthen this factor.";
    } else if (historyYears >= 2) {
      historyScore = 60;
      historyExplanation = `${historyYears} years of credit history — still building.`;
      historySuggestion = "Avoid closing old accounts. Maintain consistent usage of your oldest credit card.";
    } else {
      historyScore = 40;
      historyExplanation = `${historyYears < 1 ? "Less than 1 year" : `${historyYears} year(s)`} of credit history — too short.`;
      historySuggestion = "Start building credit early. Keep your first credit card active and use it responsibly.";
    }

    factors.push({
      name: "Credit History Length",
      score: historyScore,
      weight: 0.15,
      weightedScore: historyScore * 0.15,
      explanation: historyExplanation,
      suggestion: historySuggestion,
    });

    // --- 4. Credit Mix (10%) ---
    const secured = [hasHomeLoan, hasCarLoan].filter(Boolean).length;
    const unsecured = [hasPersonalLoan, hasCreditCard].filter(Boolean).length;
    const totalTypes = secured + unsecured;
    let mixScore: number;
    let mixExplanation: string;
    let mixSuggestion: string;

    if (secured > 0 && unsecured > 0) {
      mixScore = 100;
      mixExplanation = "Healthy mix of secured and unsecured credit accounts.";
      mixSuggestion = "Excellent diversity! Maintain a balanced credit portfolio.";
    } else if (unsecured > 1) {
      mixScore = 70;
      mixExplanation = "Multiple unsecured loans without secured credit.";
      mixSuggestion = "Consider adding a secured loan (home/car) to diversify your credit profile.";
    } else if (totalTypes === 1 && hasCreditCard) {
      mixScore = 50;
      mixExplanation = "Only credit card usage — limited credit diversity.";
      mixSuggestion = "A small personal or secured loan alongside your card can improve credit mix.";
    } else if (totalTypes === 0) {
      mixScore = 20;
      mixExplanation = "No credit accounts found.";
      mixSuggestion = "Start with a credit card and build a diverse credit portfolio gradually.";
    } else {
      mixScore = 60;
      mixExplanation = `${totalTypes} type(s) of credit accounts.`;
      mixSuggestion = "Diversify with a mix of secured and unsecured credit for a stronger profile.";
    }

    factors.push({
      name: "Credit Mix",
      score: mixScore,
      weight: 0.10,
      weightedScore: mixScore * 0.10,
      explanation: mixExplanation,
      suggestion: mixSuggestion,
    });

    // --- 5. New Credit Inquiries (10%) ---
    const inq = parseInt(inquiries) || 0;
    let inqScore: number;
    let inqExplanation: string;
    let inqSuggestion: string;

    if (inq <= 1) {
      inqScore = 100;
      inqExplanation = `${inq} inquiry in the last 6 months — minimal impact.`;
      inqSuggestion = "Great discipline! Only apply for credit when truly needed.";
    } else if (inq <= 3) {
      inqScore = 70;
      inqExplanation = `${inq} inquiries in the last 6 months — moderate activity.`;
      inqSuggestion = "Limit credit applications. Each hard inquiry can lower your score for up to 2 years.";
    } else if (inq <= 5) {
      inqScore = 40;
      inqExplanation = `${inq} inquiries — high number of recent applications.`;
      inqSuggestion = "Stop applying for new credit for at least 6 months to let your score recover.";
    } else {
      inqScore = 10;
      inqExplanation = `${inq} inquiries — excessive applications signal desperation to lenders.`;
      inqSuggestion = "Avoid all new credit applications. Focus on managing existing accounts well.";
    }

    factors.push({
      name: "New Credit Inquiries",
      score: inqScore,
      weight: 0.10,
      weightedScore: inqScore * 0.10,
      explanation: inqExplanation,
      suggestion: inqSuggestion,
    });

    // --- Final Calculation ---
    const finalScore = factors.reduce((sum, f) => sum + f.weightedScore, 0);
    const creditScore = Math.round(300 + finalScore * 6);
    const clampedScore = Math.max(300, Math.min(900, creditScore));

    let rating: CreditRating;
    let riskLevel: string;

    if (clampedScore >= 750) {
      rating = "Excellent";
      riskLevel = "Very Low Risk";
    } else if (clampedScore >= 700) {
      rating = "Good";
      riskLevel = "Low Risk";
    } else if (clampedScore >= 650) {
      rating = "Fair";
      riskLevel = "Moderate Risk";
    } else if (clampedScore >= 550) {
      rating = "Poor";
      riskLevel = "High Risk";
    } else {
      rating = "Very Poor";
      riskLevel = "Very High Risk";
    }

    setResult({ score: clampedScore, rating, riskLevel, factors });
  };

  const getProgressValue = (score: number) => ((score - 300) / 600) * 100;

  const getRatingColor = (rating: CreditRating) => {
    switch (rating) {
      case "Excellent": return "hsl(142, 76%, 36%)";
      case "Good": return "hsl(142, 60%, 45%)";
      case "Fair": return "hsl(48, 96%, 53%)";
      case "Poor": return "hsl(25, 95%, 53%)";
      case "Very Poor": return "hsl(0, 84%, 60%)";
    }
  };

  const getRatingBadgeVariant = (rating: CreditRating) => {
    switch (rating) {
      case "Excellent":
      case "Good":
        return "default" as const;
      case "Fair":
        return "secondary" as const;
      case "Poor":
      case "Very Poor":
        return "destructive" as const;
    }
  };

  const getFactorBarColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Banking-Grade Credit Score Estimator
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Credit Score Calculator</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get a realistic credit score estimate using the same weighted factors banks use — Payment History (35%), Credit Utilization (30%), Credit History (15%), Credit Mix (10%), and New Inquiries (10%).
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* INPUT FORM */}
            <div className="space-y-6">
              {/* Payment History */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                    Payment History
                    <Badge variant="outline" className="ml-auto text-xs">35% weight</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="late">Late payments in the last 12 months</Label>
                    <Input id="late" type="number" min="0" placeholder="e.g. 0" value={latePayments} onChange={(e) => setLatePayments(e.target.value)} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="default" checked={hasDefault} onCheckedChange={(c) => setHasDefault(c === true)} />
                    <Label htmlFor="default" className="text-sm cursor-pointer">Any loan default or settlement</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Utilization */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                    Credit Utilization
                    <Badge variant="outline" className="ml-auto text-xs">30% weight</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="limit">Total Credit Card Limit (₹)</Label>
                    <Input id="limit" type="number" min="0" placeholder="e.g. 200000" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="balance">Current Credit Card Balance (₹)</Label>
                    <Input id="balance" type="number" min="0" placeholder="e.g. 40000" value={creditBalance} onChange={(e) => setCreditBalance(e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              {/* Credit History Length */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                    Credit History Length
                    <Badge variant="outline" className="ml-auto text-xs">15% weight</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="firstYear">Year of first loan or credit card</Label>
                    <Input id="firstYear" type="number" min="1970" max={new Date().getFullYear()} placeholder={`e.g. ${new Date().getFullYear() - 5}`} value={firstCreditYear} onChange={(e) => setFirstCreditYear(e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              {/* Credit Mix */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                    Credit Mix
                    <Badge variant="outline" className="ml-auto text-xs">10% weight</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Select all credit accounts you have:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "home", label: "Home Loan", checked: hasHomeLoan, set: setHasHomeLoan },
                      { id: "car", label: "Car Loan", checked: hasCarLoan, set: setHasCarLoan },
                      { id: "personal", label: "Personal Loan", checked: hasPersonalLoan, set: setHasPersonalLoan },
                      { id: "cc", label: "Credit Card", checked: hasCreditCard, set: setHasCreditCard },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox id={item.id} checked={item.checked} onCheckedChange={(c) => item.set(c === true)} />
                        <Label htmlFor={item.id} className="text-sm cursor-pointer">{item.label}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* New Credit Inquiries */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">5</span>
                    New Credit Inquiries
                    <Badge variant="outline" className="ml-auto text-xs">10% weight</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="inq">Loan/credit applications in the last 6 months</Label>
                    <Input id="inq" type="number" min="0" placeholder="e.g. 1" value={inquiries} onChange={(e) => setInquiries(e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" onClick={calculateScore} size="lg">
                <BarChart3 className="w-4 h-4 mr-2" />
                Calculate Credit Score
              </Button>
            </div>

            {/* RESULTS */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Score Card */}
                  <Card>
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-lg">Your Estimated Credit Score</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="text-6xl font-bold" style={{ color: getRatingColor(result.rating) }}>
                        {result.score}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant={getRatingBadgeVariant(result.rating)} className="text-base px-4 py-1">
                          {result.rating}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Risk Level: <span className="text-foreground">{result.riskLevel}</span>
                      </p>
                      {(() => {
                        const limit = parseFloat(creditLimit) || 0;
                        const balance = parseFloat(creditBalance) || 0;
                        const util = limit > 0 ? ((balance / limit) * 100).toFixed(1) : null;
                        return util ? (
                          <p className="text-sm font-medium text-muted-foreground">
                            Credit Utilization: <span className="text-foreground">{util}%</span>
                          </p>
                        ) : null;
                      })()}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>300</span>
                          <span>550</span>
                          <span>650</span>
                          <span>750</span>
                          <span>900</span>
                        </div>
                        <Progress value={getProgressValue(result.score)} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Very Poor</span>
                          <span>Poor</span>
                          <span>Fair</span>
                          <span>Good</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Factor Breakdown */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Factor Breakdown
                      </CardTitle>
                      <CardDescription>How each factor contributes to your score</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.factors.map((factor, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">{factor.name}</span>
                            <span className="text-muted-foreground">{factor.score}/100 × {(factor.weight * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full transition-all ${getFactorBarColor(factor.score)}`}
                              style={{ width: `${factor.score}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">{factor.explanation}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Suggestions */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        How to Improve Your Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {result.factors
                          .filter((f) => f.score < 100)
                          .sort((a, b) => a.score - b.score)
                          .map((factor, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                              <div className="mt-0.5">
                                {factor.score < 50 ? (
                                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                                ) : (
                                  <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                                )}
                              </div>
                              <div>
                                <span className="font-medium">{factor.name}:</span>{" "}
                                <span className="text-muted-foreground">{factor.suggestion}</span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="sticky top-24 h-fit flex items-center justify-center">
                  <CardContent className="text-center py-16 space-y-4">
                    <Shield className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Enter Your Details</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Fill in your financial details to get a banking-grade credit score estimate with a detailed factor breakdown.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-2 mx-auto max-w-xs">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>This is an estimate. For official scores, visit CIBIL, Experian, or Equifax.</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground bg-muted/50 rounded-lg px-6 py-4 max-w-2xl mx-auto">
            <Info className="w-4 h-4 inline-block mr-1 -mt-0.5" />
            <strong>Disclaimer:</strong> This credit score is an estimate. Official credit scores are provided by credit bureaus such as CIBIL, Experian, or Equifax.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreditScoreCalculator;
