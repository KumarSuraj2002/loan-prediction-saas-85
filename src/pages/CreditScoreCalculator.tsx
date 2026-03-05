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
import { Separator } from "@/components/ui/separator";
import { Shield, TrendingUp, AlertTriangle, CheckCircle2, Info } from "lucide-react";

type CreditRating = "Excellent" | "Good" | "Fair" | "Poor" | "Very Poor";

interface CreditResult {
  score: number;
  rating: CreditRating;
  color: string;
  tips: string[];
}

const CreditScoreCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [existingEMIs, setExistingEMIs] = useState("");
  const [creditCards, setCreditCards] = useState("");
  const [creditUtilization, setCreditUtilization] = useState("");
  const [loanHistory, setLoanHistory] = useState("");
  const [missedPayments, setMissedPayments] = useState("");
  const [creditAge, setCreditAge] = useState("");
  const [recentInquiries, setRecentInquiries] = useState("");
  const [result, setResult] = useState<CreditResult | null>(null);

  const calculateScore = () => {
    let score = 500;

    // Income factor (max +100)
    const income = parseFloat(monthlyIncome) || 0;
    if (income >= 100000) score += 100;
    else if (income >= 50000) score += 75;
    else if (income >= 25000) score += 50;
    else if (income >= 15000) score += 25;

    // Debt-to-income ratio (max +100)
    const emis = parseFloat(existingEMIs) || 0;
    const dtiRatio = income > 0 ? (emis / income) * 100 : 50;
    if (dtiRatio < 20) score += 100;
    else if (dtiRatio < 35) score += 70;
    else if (dtiRatio < 50) score += 40;
    else score -= 30;

    // Credit utilization (max +80)
    const utilization = parseFloat(creditUtilization) || 0;
    if (utilization < 30) score += 80;
    else if (utilization < 50) score += 50;
    else if (utilization < 75) score += 20;
    else score -= 40;

    // Loan history (max +60)
    if (loanHistory === "excellent") score += 60;
    else if (loanHistory === "good") score += 40;
    else if (loanHistory === "average") score += 20;
    else if (loanHistory === "poor") score -= 30;
    else score += 10; // no history

    // Missed payments (max -100)
    const missed = parseInt(missedPayments) || 0;
    if (missed === 0) score += 50;
    else if (missed <= 2) score -= 20;
    else if (missed <= 5) score -= 60;
    else score -= 100;

    // Credit age (max +60)
    if (creditAge === "10+") score += 60;
    else if (creditAge === "5-10") score += 45;
    else if (creditAge === "3-5") score += 30;
    else if (creditAge === "1-3") score += 15;
    else score += 0;

    // Recent inquiries (max -30)
    const inquiries = parseInt(recentInquiries) || 0;
    if (inquiries === 0) score += 20;
    else if (inquiries <= 2) score += 5;
    else if (inquiries <= 5) score -= 15;
    else score -= 30;

    // Credit cards factor
    const cards = parseInt(creditCards) || 0;
    if (cards >= 1 && cards <= 3) score += 20;
    else if (cards > 5) score -= 10;

    // Clamp score to 300-900 range
    score = Math.max(300, Math.min(900, score));

    let rating: CreditRating;
    let color: string;
    let tips: string[] = [];

    if (score >= 750) {
      rating = "Excellent";
      color = "hsl(var(--chart-2))";
      tips = [
        "You're in great shape! Keep maintaining low credit utilization.",
        "You qualify for the best interest rates on loans.",
        "Consider leveraging your score for premium credit cards.",
      ];
    } else if (score >= 650) {
      rating = "Good";
      color = "hsl(142, 76%, 36%)";
      tips = [
        "Pay all bills on time to push your score higher.",
        "Try to reduce credit utilization below 30%.",
        "Avoid opening too many new credit accounts.",
      ];
    } else if (score >= 550) {
      rating = "Fair";
      color = "hsl(48, 96%, 53%)";
      tips = [
        "Focus on paying off existing debts to improve your ratio.",
        "Set up autopay to avoid missed payments.",
        "Don't close old credit cards — they help credit age.",
      ];
    } else if (score >= 400) {
      rating = "Poor";
      color = "hsl(25, 95%, 53%)";
      tips = [
        "Prioritize clearing any overdue payments immediately.",
        "Consider a secured credit card to rebuild credit.",
        "Limit new credit applications for the next 6 months.",
      ];
    } else {
      rating = "Very Poor";
      color = "hsl(0, 84%, 60%)";
      tips = [
        "Seek help from a financial advisor for debt management.",
        "Clear all overdue payments as a first priority.",
        "Start with a secured credit card and build history gradually.",
      ];
    }

    setResult({ score, rating, color, tips });
  };

  const getProgressValue = (score: number) => ((score - 300) / 600) * 100;

  const getRatingBadgeVariant = (rating: CreditRating) => {
    switch (rating) {
      case "Excellent": return "default";
      case "Good": return "default";
      case "Fair": return "secondary";
      case "Poor": return "destructive";
      case "Very Poor": return "destructive";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Credit Score Estimator
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Check Your Credit Score</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get an estimated credit score based on your financial profile. This is an indicative score — for your official CIBIL score, visit the bureau's website.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Details</CardTitle>
                <CardDescription>Enter your details for an estimated score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income (₹)</Label>
                  <Input id="income" type="number" placeholder="e.g. 50000" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emis">Total Monthly EMIs (₹)</Label>
                  <Input id="emis" type="number" placeholder="e.g. 15000" value={existingEMIs} onChange={(e) => setExistingEMIs(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cards">Number of Credit Cards</Label>
                  <Input id="cards" type="number" placeholder="e.g. 2" value={creditCards} onChange={(e) => setCreditCards(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utilization">Credit Card Utilization (%)</Label>
                  <Input id="utilization" type="number" placeholder="e.g. 30" value={creditUtilization} onChange={(e) => setCreditUtilization(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Loan Repayment History</Label>
                  <Select value={loanHistory} onValueChange={setLoanHistory}>
                    <SelectTrigger><SelectValue placeholder="Select history" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent — Always on time</SelectItem>
                      <SelectItem value="good">Good — Rarely late</SelectItem>
                      <SelectItem value="average">Average — Occasionally late</SelectItem>
                      <SelectItem value="poor">Poor — Frequently late</SelectItem>
                      <SelectItem value="none">No loan history</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="missed">Missed Payments (last 12 months)</Label>
                  <Input id="missed" type="number" placeholder="e.g. 0" value={missedPayments} onChange={(e) => setMissedPayments(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Credit History Age</Label>
                  <Select value={creditAge} onValueChange={setCreditAge}>
                    <SelectTrigger><SelectValue placeholder="Select age" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">Less than 1 year</SelectItem>
                      <SelectItem value="1-3">1–3 years</SelectItem>
                      <SelectItem value="3-5">3–5 years</SelectItem>
                      <SelectItem value="5-10">5–10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inquiries">Credit Inquiries (last 6 months)</Label>
                  <Input id="inquiries" type="number" placeholder="e.g. 1" value={recentInquiries} onChange={(e) => setRecentInquiries(e.target.value)} />
                </div>
                <Button className="w-full mt-2" onClick={calculateScore} size="lg">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Calculate Credit Score
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {result ? (
                <>
                  <Card>
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-lg">Your Estimated Score</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="text-6xl font-bold" style={{ color: result.color }}>
                        {result.score}
                      </div>
                      <Badge variant={getRatingBadgeVariant(result.rating)} className="text-base px-4 py-1">
                        {result.rating}
                      </Badge>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>300</span>
                          <span>900</span>
                        </div>
                        <Progress value={getProgressValue(result.score)} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Poor</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        Tips to Improve
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {result.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-16 space-y-4">
                    <Shield className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Enter Your Details</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Fill in your financial details on the left to get an estimated credit score with personalized improvement tips.
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreditScoreCalculator;
