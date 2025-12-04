import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    document.getElementById('loan-prediction')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openChatbot = () => {
    // Trigger chatbot open by dispatching a custom event
    window.dispatchEvent(new CustomEvent('open-loan-advisor'));
  };
  
  return (
    <section className="relative overflow-hidden bg-background py-12 sm:py-20 lg:py-32">
      <div className="container responsive-padding">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col gap-4 sm:gap-5 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance tracking-tight">
              <span className="inline-block text-primary">Smart</span> Financial Decisions with AI
            </h1>
            <p className="responsive-text-xl text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
              Predict loan approvals and find the perfect bank for your needs with our AI-powered financial assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:mt-4 justify-center lg:justify-start">
              <Button onClick={openChatbot} size="lg" className="group w-full sm:w-auto">
                <Bot className="mr-2 h-4 w-4" />
                AI Loan Advisor
              </Button>
              <Button onClick={handleGetStarted} variant="outline" size="lg" className="group w-full sm:w-auto">
                Try Loan Prediction
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/loan-application')}
                className="w-full sm:w-auto"
              >
                Apply Now
              </Button>
            </div>
            
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-sm text-muted-foreground justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                    <span className="text-xs font-medium">U{i}</span>
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left">Join 10,000+ users making smarter financial decisions</div>
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="rounded-md bg-fintech-50 p-4">
                <div className="grid gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-fintech-400" />
                    <div className="text-sm font-medium">Loan Approval Prediction</div>
                  </div>
                  <div className="h-2.5 w-24 rounded-full bg-fintech-200" />
                  <div className="mt-1 h-32 rounded-lg bg-gradient-to-br from-fintech-100 via-fintech-50 to-background" />
                  <div className="flex justify-between">
                    <div className="h-2 w-12 rounded-full bg-fintech-200" />
                    <div className="h-2 w-12 rounded-full bg-fintech-200" />
                  </div>
                </div>
              </div>
              <div className="mt-2 rounded-md bg-fintech-50 p-4">
                <div className="grid gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-fintech-400" />
                    <div className="text-sm font-medium">Bank Recommendations</div>
                  </div>
                  <div className="h-2.5 w-16 rounded-full bg-fintech-200" />
                  <div className="grid gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded bg-fintech-200 mt-0.5" />
                        <div>
                          <div className="h-2 w-24 rounded-full bg-fintech-200" />
                          <div className="mt-1 h-2 w-16 rounded-full bg-fintech-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Abstract Elements */}
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-fintech-400/20 blur-3xl" />
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-fintech-600/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
