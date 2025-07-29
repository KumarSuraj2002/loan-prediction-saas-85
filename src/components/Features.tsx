
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, CreditCard, Database, Lock, Search, Shield, TrendingUp, User } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Calculator className="h-6 w-6 text-primary" />,
      title: "Smart Loan Assessment",
      description: "Our AI analyzes your financial data and predicts loan approval likelihood with high accuracy."
    },
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "Personalized Bank Matching",
      description: "Find banks that match your specific needs, preferences and financial goals."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "Financial Insights",
      description: "Get detailed insights and recommendations to improve your financial health and loan eligibility."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Secure Data Processing",
      description: "Your financial data is processed with enterprise-grade encryption and never stored permanently."
    },
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: "Extensive Bank Database",
      description: "Compare features, interest rates and account options across a wide range of financial institutions."
    },
    {
      icon: <User className="h-6 w-6 text-primary" />,
      title: "Tailored Recommendations",
      description: "Receive customized advice based on your unique financial situation and banking needs."
    }
  ];

  return (
    <section id="features" className="bg-accent py-12 sm:py-16 lg:py-20">
      <div className="container responsive-padding">
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12">
          <h2 className="responsive-text-3xl font-bold tracking-tight">Powerful Financial Tools</h2>
          <p className="mt-3 sm:mt-4 responsive-text-xl text-muted-foreground max-w-[800px]">
            Our platform combines advanced AI with financial expertise to help you make better decisions.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="border bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 p-4 sm:p-6">
                <div className="mb-3 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-sm sm:text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
