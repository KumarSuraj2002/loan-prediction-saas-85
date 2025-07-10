
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

const APIDocumentation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="flex justify-center mb-6">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">API Documentation</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Integrate our financial intelligence into your applications.
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <Card>
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
                <p className="text-muted-foreground mb-6">
                  The FinanceBuddy API enables you to access our loan prediction and bank recommendation engines programmatically.
                  Use our RESTful APIs to power your applications with intelligent financial insights.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Authentication</h3>
                <p className="text-muted-foreground mb-6">
                  All API requests require an API key. You can obtain your key from your FinanceBuddy developer dashboard after creating an account.
                </p>
                
                <div className="bg-muted p-4 rounded-md mb-6 overflow-x-auto">
                  <pre className="text-sm">
                    <code>
                      # Example authentication header<br />
                      Authorization: Bearer YOUR_API_KEY
                    </code>
                  </pre>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button>Register for API Access</Button>
                  <Button variant="outline">View Developer Dashboard</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* API Documentation Main */}
        <section className="py-16">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <Tabs defaultValue="loan-api" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="loan-api">Loan Prediction API</TabsTrigger>
                <TabsTrigger value="bank-api">Bank Recommendation API</TabsTrigger>
              </TabsList>
              
              {/* Loan Prediction API */}
              <TabsContent value="loan-api">
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                      <h2 className="text-2xl font-bold">Loan Prediction API</h2>
                      <div className="flex items-center gap-2">
                        <Badge>v1.0</Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Stable</Badge>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      The Loan Prediction API uses machine learning to evaluate loan applications and determine approval likelihood based on various factors.
                    </p>
                    
                    <Accordion type="single" collapsible className="w-full">
                      {/* Endpoint: Predict Loan Approval */}
                      <AccordionItem value="predict-loan">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">POST</Badge>
                            <span className="font-mono">/api/v1/predict-loan</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-t pt-4">
                          <p className="mb-4">Returns a prediction of loan approval likelihood based on provided applicant information.</p>
                          
                          <h4 className="text-md font-semibold mb-2">Request Body</h4>
                          <div className="bg-muted p-4 rounded-md mb-4 overflow-x-auto">
                            <pre className="text-sm">
                              <code>
{`{
  "applicant": {
    "age": 35,
    "income": 75000,
    "employment_years": 5,
    "credit_score": 720
  },
  "loan": {
    "amount": 250000,
    "purpose": "home",
    "term_years": 15
  }
}`}
                              </code>
                            </pre>
                          </div>
                          
                          <h4 className="text-md font-semibold mb-2">Response</h4>
                          <div className="bg-muted p-4 rounded-md mb-4 overflow-x-auto">
                            <pre className="text-sm">
                              <code>
{`{
  "prediction": {
    "approval_probability": 0.87,
    "risk_level": "low",
    "recommended_interest_rate": 4.25,
    "max_loan_amount": 300000
  },
  "factors": {
    "positive": ["strong_credit_history", "stable_employment"],
    "negative": ["high_debt_to_income"]
  }
}`}
                              </code>
                            </pre>
                          </div>
                          
                          <h4 className="text-md font-semibold mb-2">Query Parameters</h4>
                          <table className="min-w-full text-sm mb-4">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-4 font-semibold">Parameter</th>
                                <th className="text-left py-2 px-4 font-semibold">Type</th>
                                <th className="text-left py-2 px-4 font-semibold">Required</th>
                                <th className="text-left py-2 px-4 font-semibold">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="py-2 px-4 font-mono">include_factors</td>
                                <td className="py-2 px-4">boolean</td>
                                <td className="py-2 px-4">No</td>
                                <td className="py-2 px-4">Include contributing factors in response (default: true)</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2 px-4 font-mono">detailed</td>
                                <td className="py-2 px-4">boolean</td>
                                <td className="py-2 px-4">No</td>
                                <td className="py-2 px-4">Provide additional details in prediction (default: false)</td>
                              </tr>
                            </tbody>
                          </table>
                        </AccordionContent>
                      </AccordionItem>
                      
                      {/* Endpoint: Loan Types */}
                      <AccordionItem value="loan-types">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-green-100 text-green-800">GET</Badge>
                            <span className="font-mono">/api/v1/loan-types</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-t pt-4">
                          <p className="mb-4">Returns a list of available loan types and their characteristics.</p>
                          
                          <h4 className="text-md font-semibold mb-2">Response</h4>
                          <div className="bg-muted p-4 rounded-md mb-4 overflow-x-auto">
                            <pre className="text-sm">
                              <code>
{`{
  "loan_types": [
    {
      "id": "home",
      "name": "Home Loan",
      "max_term": 30,
      "interest_range": {
        "min": 3.5,
        "max": 7.2
      },
      "requirements": [
        "minimum_credit_score": 640,
        "income_verification": true
      ]
    },
    {
      "id": "auto",
      "name": "Auto Loan",
      "max_term": 7,
      "interest_range": {
        "min": 4.0,
        "max": 8.5
      },
      "requirements": [
        "minimum_credit_score": 600,
        "income_verification": true
      ]
    }
    // Additional loan types...
  ]
}`}
                              </code>
                            </pre>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      {/* Bulk Predictions */}
                      <AccordionItem value="bulk-predict">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">POST</Badge>
                            <span className="font-mono">/api/v1/bulk-predict</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-t pt-4">
                          <p className="mb-4">Process multiple loan predictions in a single request.</p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Rate Limited</Badge>
                            <span className="text-sm text-muted-foreground">Max 100 applications per request</span>
                          </div>
                          
                          <h4 className="text-md font-semibold mb-2">Request Body</h4>
                          <div className="bg-muted p-4 rounded-md mb-4 overflow-x-auto">
                            <pre className="text-sm">
                              <code>
{`{
  "applications": [
    {
      "id": "app-001",
      "applicant": {
        "age": 35,
        "income": 75000,
        "employment_years": 5,
        "credit_score": 720
      },
      "loan": {
        "amount": 250000,
        "purpose": "home",
        "term_years": 15
      }
    },
    // Additional applications...
  ]
}`}
                              </code>
                            </pre>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Bank Recommendation API */}
              <TabsContent value="bank-api">
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                      <h2 className="text-2xl font-bold">Bank Recommendation API</h2>
                      <div className="flex items-center gap-2">
                        <Badge>v1.0</Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Stable</Badge>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      The Bank Recommendation API helps users find the most suitable banks and financial products based on their profile and preferences.
                    </p>
                    
                    <Accordion type="single" collapsible className="w-full">
                      {/* Endpoint: Recommend Banks */}
                      <AccordionItem value="recommend-banks">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">POST</Badge>
                            <span className="font-mono">/api/v1/recommend-banks</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-t pt-4">
                          <p className="mb-4">Returns personalized bank recommendations based on user profile and preferences.</p>
                          
                          <h4 className="text-md font-semibold mb-2">Request Body</h4>
                          <div className="bg-muted p-4 rounded-md mb-4 overflow-x-auto">
                            <pre className="text-sm">
                              <code>
{`{
  "user_profile": {
    "location": {
      "city": "San Francisco",
      "state": "CA",
      "zip": "94103"
    },
    "financial_profile": {
      "monthly_income": 6000,
      "credit_score_range": "700-749",
      "existing_accounts": ["checking", "savings", "credit_card"]
    },
    "preferences": {
      "online_banking": true,
      "mobile_app": true,
      "physical_branches": false,
      "low_fees": true,
      "high_interest_rates": true
    }
  },
  "product_types": ["checking", "savings", "credit_card"]
}`}
                              </code>
                            </pre>
                          </div>
                          
                          <h4 className="text-md font-semibold mb-2">Response</h4>
                          <div className="bg-muted p-4 rounded-md mb-4 overflow-x-auto">
                            <pre className="text-sm">
                              <code>
{`{
  "recommendations": {
    "checking": [
      {
        "bank_id": "chase",
        "bank_name": "Chase Bank",
        "product_name": "Chase Total Checking",
        "match_score": 0.92,
        "key_features": [
          "No monthly fee with direct deposit",
          "Extensive ATM network",
          "Highly rated mobile app"
        ],
        "pros": ["Large network", "Great digital experience"],
        "cons": ["Lower interest rates"]
      },
      // Additional recommendations...
    ],
    "savings": [
      // Savings account recommendations...
    ],
    "credit_card": [
      // Credit card recommendations...
    ]
  }
}`}
                              </code>
                            </pre>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      {/* Endpoint: Bank Details */}
                      <AccordionItem value="bank-details">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-green-100 text-green-800">GET</Badge>
                            <span className="font-mono">/api/v1/banks/{'{bank_id}'}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-t pt-4">
                          <p className="mb-4">Returns detailed information about a specific bank and its offerings.</p>
                          
                          <h4 className="text-md font-semibold mb-2">Path Parameters</h4>
                          <table className="min-w-full text-sm mb-4">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-4 font-semibold">Parameter</th>
                                <th className="text-left py-2 px-4 font-semibold">Type</th>
                                <th className="text-left py-2 px-4 font-semibold">Required</th>
                                <th className="text-left py-2 px-4 font-semibold">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="py-2 px-4 font-mono">bank_id</td>
                                <td className="py-2 px-4">string</td>
                                <td className="py-2 px-4">Yes</td>
                                <td className="py-2 px-4">Unique identifier for the bank</td>
                              </tr>
                            </tbody>
                          </table>
                          
                          <h4 className="text-md font-semibold mb-2">Response</h4>
                          <div className="bg-muted p-4 rounded-md mb-4 overflow-x-auto">
                            <pre className="text-sm">
                              <code>
{`{
  "bank_id": "chase",
  "name": "Chase Bank",
  "description": "JPMorgan Chase Bank, N.A., doing business as Chase Bank or often as Chase, is an American national bank.",
  "headquarters": "New York, NY",
  "year_founded": 2000,
  "website": "https://www.chase.com",
  "products": {
    "checking_accounts": [
      {
        "name": "Chase Total Checking",
        "monthly_fee": 12,
        "waiver_requirements": ["Monthly direct deposit of $500+", "Maintain $1,500 minimum balance"],
        "features": ["Mobile banking", "Chase QuickDeposit", "Online bill pay"]
      },
      // Additional checking accounts...
    ],
    "savings_accounts": [
      // Savings account details...
    ],
    "credit_cards": [
      // Credit card details...
    ]
  },
  "branches": {
    "total_count": 4700,
    "states_with_presence": ["CA", "NY", "TX", "FL", "IL", "...]
  },
  "customer_satisfaction": {
    "rating": 4.2,
    "total_reviews": 12500
  }
}`}
                              </code>
                            </pre>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      {/* Endpoint: Compare Banks */}
                      <AccordionItem value="compare-banks">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-green-100 text-green-800">GET</Badge>
                            <span className="font-mono">/api/v1/compare-banks</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-t pt-4">
                          <p className="mb-4">Compare multiple banks and their offerings side by side.</p>
                          
                          <h4 className="text-md font-semibold mb-2">Query Parameters</h4>
                          <table className="min-w-full text-sm mb-4">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-4 font-semibold">Parameter</th>
                                <th className="text-left py-2 px-4 font-semibold">Type</th>
                                <th className="text-left py-2 px-4 font-semibold">Required</th>
                                <th className="text-left py-2 px-4 font-semibold">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="py-2 px-4 font-mono">bank_ids</td>
                                <td className="py-2 px-4">string</td>
                                <td className="py-2 px-4">Yes</td>
                                <td className="py-2 px-4">Comma-separated list of bank IDs to compare (max 5)</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2 px-4 font-mono">product_types</td>
                                <td className="py-2 px-4">string</td>
                                <td className="py-2 px-4">No</td>
                                <td className="py-2 px-4">Comma-separated list of product types to compare</td>
                              </tr>
                            </tbody>
                          </table>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Rate Limits and Usage */}
        <section className="py-12 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Rate Limits & Usage</h2>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">API Rate Limits</h3>
                
                <table className="min-w-full text-sm mb-4">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-semibold">Plan</th>
                      <th className="text-left py-2 px-4 font-semibold">Requests per minute</th>
                      <th className="text-left py-2 px-4 font-semibold">Requests per day</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4">Free</td>
                      <td className="py-2 px-4">10</td>
                      <td className="py-2 px-4">1,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Basic</td>
                      <td className="py-2 px-4">60</td>
                      <td className="py-2 px-4">10,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Professional</td>
                      <td className="py-2 px-4">300</td>
                      <td className="py-2 px-4">100,000</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">Enterprise</td>
                      <td className="py-2 px-4">Custom</td>
                      <td className="py-2 px-4">Custom</td>
                    </tr>
                  </tbody>
                </table>
                
                <p className="text-sm text-muted-foreground">
                  Rate limits are applied per API key. When a rate limit is exceeded, the API will return a 429 Too Many Requests response.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Response Codes</h3>
                
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-semibold">Code</th>
                      <th className="text-left py-2 px-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">200</td>
                      <td className="py-2 px-4">OK - The request was successful</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">400</td>
                      <td className="py-2 px-4">Bad Request - Invalid parameters or request body</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">401</td>
                      <td className="py-2 px-4">Unauthorized - Invalid or missing API key</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">404</td>
                      <td className="py-2 px-4">Not Found - Resource not found</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">429</td>
                      <td className="py-2 px-4">Too Many Requests - Rate limit exceeded</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-mono">500</td>
                      <td className="py-2 px-4">Server Error - Something went wrong on our end</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SDKs and Libraries */}
        <section className="py-16">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-8 text-center">SDKs and Libraries</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">JavaScript</h3>
                  <p className="text-muted-foreground mb-4">Official JavaScript SDK for both browser and Node.js environments.</p>
                  <Button variant="outline" className="w-full">View Documentation</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M9.31 19a2.5 2.5 0 0 1-4.62 0z" /><path d="M9 6.2A9 9 0 0 1 20.8 18a1 1 0 0 0 1.7-.7A10.97 10.97 0 0 0 9 3.36C4.8 3.36 1.36 6.78 1.36 11c0 1.67.5 3.3 1.29 4.66a1 1 0 0 0 1.75-.99A8.97 8.97 0 0 1 9 6.2z" /><path d="M9.32 13a2.31 2.31 0 0 1-4.64 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Python</h3>
                  <p className="text-muted-foreground mb-4">Python library for seamless integration with our API services.</p>
                  <Button variant="outline" className="w-full">View Documentation</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M18 8a5 5 0 0 0-10 0v7h10V8z" /><path d="M8 15v2a4 4 0 0 0 8 0v-2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Java</h3>
                  <p className="text-muted-foreground mb-4">Java SDK for enterprise integrations and Android applications.</p>
                  <Button variant="outline" className="w-full">View Documentation</Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Looking for a different language? Check our GitHub repository for more libraries and community contributions.</p>
              <Button>View All SDKs on GitHub</Button>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-16 bg-primary/5">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our developer support team is ready to help you integrate our APIs into your application.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button>Contact Developer Support</Button>
              <Button variant="outline">Join Developer Community</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default APIDocumentation;
