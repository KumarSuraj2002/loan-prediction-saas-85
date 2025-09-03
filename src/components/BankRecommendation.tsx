
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search, CreditCard, ChevronRight, ChevronDown } from "lucide-react";
import { UserPreferences } from "@/data/loanDataTypes";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  bankingNeed: z.string().min(1, "Please select your primary banking need"),
  preferredFeatures: z.array(z.string()).min(1, "Please select at least one feature"),
  locationPreference: z.string().min(1, "Please select your location preference"),
  accountType: z.string().min(1, "Please select an account type"),
  interestRatePriority: z.string().optional(),
});

// Features list based on actual bank data features
const featureOptions = [
  {
    id: "mobile_banking",
    label: "Mobile Banking",
  },
  {
    id: "no_fees",
    label: "Low/No Fees",
  },
  {
    id: "high_apy",
    label: "High APY",
  },
  {
    id: "large_atm_network",
    label: "Large ATM Network",
  },
  {
    id: "rewards_program",
    label: "Rewards Program",
  },
  {
    id: "customer_service",
    label: "24/7 Customer Service",
  },
  {
    id: "investment_options",
    label: "Investment Options",
  },
  {
    id: "financial_planning",
    label: "Financial Planning",
  },
  {
    id: "online_bill_pay",
    label: "Online Bill Pay",
  },
  {
    id: "student_loans",
    label: "Student Loans",
  },
  {
    id: "cash_back",
    label: "Cash Back",
  },
];

const BankRecommendation = () => {
  const navigate = useNavigate();
  const [matchingBanks, setMatchingBanks] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [allBanks, setAllBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const { data, error } = await supabase
          .from('banks')
          .select('*')
          .order('rating', { ascending: false });

        if (error) throw error;
        setAllBanks(data || []);
      } catch (error) {
        console.error('Error fetching banks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  const form = useForm<UserPreferences>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankingNeed: "",
      preferredFeatures: ["mobile_banking"],
      locationPreference: "",
      accountType: "",
      interestRatePriority: "",
    },
  });

  const onSubmit = (data: UserPreferences) => {
    setIsSearching(true);
    setShowMore(false);
    
    // Filter banks based on preferences
    setTimeout(() => {
      const filtered = allBanks.filter(bank => {
        // Basic filtering logic - can be enhanced based on your requirements
        if (data.locationPreference && data.locationPreference !== "Any") {
          if (!bank.locations.includes(data.locationPreference) && !bank.locations.includes("Online")) {
            return false;
          }
        }
        
        if (data.preferredFeatures.length > 0) {
          const hasMatchingFeature = data.preferredFeatures.some(featureId => {
            const feature = featureOptions.find(f => f.id === featureId);
            return feature && bank.features.some((bankFeature: string) => 
              bankFeature.toLowerCase().includes(feature.label.toLowerCase())
            );
          });
          if (!hasMatchingFeature) return false;
        }
        
        return true;
      });
      
      setMatchingBanks(filtered);
      setIsSearching(false);
    }, 1500);
  };

  // Display all banks initially when no search has been performed
  const displayBanks = matchingBanks.length > 0 ? matchingBanks : allBanks;

  const handleViewMore = () => {
    setShowMore(true);
  };

  const handleBankClick = (bank: any) => {
    navigate(`/bank/${bank.id}`);
  };

  return (
    <section id="bank-recommendation" className="responsive-section-padding bg-accent">
      <div className="responsive-container">
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <h2 className="responsive-text-3xl font-bold">Find Your Ideal Bank</h2>
          <p className="mt-2 sm:mt-3 responsive-text-xl text-muted-foreground max-w-[700px]">
            Answer a few questions and we'll recommend the best banks for your specific needs.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          <Card className="lg:col-span-1 border shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Bank Finder
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Tell us what you're looking for in a bank
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                  <FormField
                    control={form.control}
                    name="bankingNeed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Banking Need</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your primary need" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="checking">Checking Account</SelectItem>
                            <SelectItem value="savings">Savings Account</SelectItem>
                            <SelectItem value="mortgage">Mortgage</SelectItem>
                            <SelectItem value="personal">Personal Loan</SelectItem>
                            <SelectItem value="credit">Credit Card</SelectItem>
                            <SelectItem value="investment">Investment</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="preferredFeatures"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Preferred Features</FormLabel>
                          <FormDescription>
                            Select the features that matter most to you
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {featureOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="preferredFeatures"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="locationPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Urban">Urban Areas</SelectItem>
                            <SelectItem value="Suburban">Suburban Areas</SelectItem>
                            <SelectItem value="Rural">Rural Areas</SelectItem>
                            <SelectItem value="Online">Online Only</SelectItem>
                            <SelectItem value="Any">No Preference</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Checking">Checking Account</SelectItem>
                            <SelectItem value="Savings">Savings Account</SelectItem>
                            <SelectItem value="Credit Card">Credit Card</SelectItem>
                            <SelectItem value="Mortgage">Mortgage</SelectItem>
                            <SelectItem value="Investment">Investment Account</SelectItem>
                            <SelectItem value="Business">Business Account</SelectItem>
                            <SelectItem value="Any">Any Account Type</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interestRatePriority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Rate Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select interest rate priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high_savings">High Savings Rate</SelectItem>
                            <SelectItem value="low_mortgage">Low Mortgage Rate</SelectItem>
                            <SelectItem value="low_personal">Low Personal Loan Rate</SelectItem>
                            <SelectItem value="none">No Preference</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Which type of interest rate matters most to you?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-4 sm:mt-6 h-11 sm:h-12 text-sm sm:text-base"
                    disabled={isSearching}
                  >
                    {isSearching ? "Searching..." : "Find Banks"}
                    {!isSearching && <ChevronRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 border shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Bank Recommendations
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Personalized options based on your preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[350px] sm:min-h-[400px] p-4 sm:p-6 pt-0">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center h-[350px] sm:h-[400px] text-muted-foreground">
                  <div className="animate-pulse-gentle mb-2 text-sm sm:text-base">Searching for the best banks...</div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : allBanks.length > 0 ? (
                <div className="space-y-6">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
                      <TabsTrigger value="all" className="text-sm">All Banks</TabsTrigger>
                      <TabsTrigger value="online" className="text-sm">Online Banks</TabsTrigger>
                      <TabsTrigger value="traditional" className="text-sm">Traditional Banks</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-4">
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <div className="text-muted-foreground">Loading banks...</div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {displayBanks.map((bank) => (
                            <div 
                              key={bank.id} 
                              className="flex flex-col items-center p-4 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handleBankClick(bank)}
                            >
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <span className="text-base sm:text-lg font-bold text-primary">{bank.logo_text}</span>
                              </div>
                              <h3 className="text-sm sm:text-base font-medium text-center">{bank.name}</h3>
                              <div className="flex mt-2">
                                {Array(5).fill(0).map((_, i) => (
                                  <span key={i} className={`text-xs ${i < Math.floor(bank.rating) ? "text-amber-500" : "text-gray-300"}`}>★</span>
                                ))}
                              </div>
                            </div>
                          ))}
                          
                          {!showMore && displayBanks.length > 6 && (
                            <div className="md:col-span-3 mt-4 flex justify-center">
                              <Button 
                                variant="outline" 
                                onClick={handleViewMore}
                                className="group flex items-center gap-2"
                              >
                                View More Banks
                                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="online" className="mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {allBanks.filter(bank => bank.locations.includes("Online")).map((bank) => (
                          <div 
                            key={bank.id} 
                            className="flex flex-col items-center p-4 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleBankClick(bank)}
                          >
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                              <span className="text-lg font-bold text-primary">{bank.logo_text}</span>
                            </div>
                            <h3 className="text-base font-medium text-center">{bank.name}</h3>
                            <div className="flex mt-2">
                              {Array(5).fill(0).map((_, i) => (
                                <span key={i} className={`text-xs ${i < Math.floor(bank.rating) ? "text-amber-500" : "text-gray-300"}`}>★</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="traditional" className="mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {allBanks.filter(bank => !bank.locations.includes("Online") || bank.locations.length > 1).map((bank) => (
                          <div 
                            key={bank.id} 
                            className="flex flex-col items-center p-4 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleBankClick(bank)}
                          >
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                              <span className="text-lg font-bold text-primary">{bank.logo_text}</span>
                            </div>
                            <h3 className="text-base font-medium text-center">{bank.name}</h3>
                            <div className="flex mt-2">
                              {Array(5).fill(0).map((_, i) => (
                                <span key={i} className={`text-xs ${i < Math.floor(bank.rating) ? "text-amber-500" : "text-gray-300"}`}>★</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                  <div className="p-3 border-2 border-dashed rounded-full mb-3 inline-flex">
                    <CreditCard className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-medium">Find Your Perfect Bank</p>
                  <p className="text-sm max-w-md text-center mt-2">
                    Fill out the form to get personalized bank recommendations based on your preferences.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Data is for demonstration purposes only. Actual bank rates and offerings may vary.
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BankRecommendation;
