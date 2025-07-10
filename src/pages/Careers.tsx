
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

const jobListings: JobListing[] = [
  {
    id: "jr-data-scientist",
    title: "Junior Data Scientist",
    department: "Data Science",
    location: "Remote",
    type: "Full-time",
    description: "Join our data science team to help build and improve our loan prediction algorithms and financial recommendation systems.",
    requirements: [
      "Bachelor's degree in Computer Science, Statistics, or related field",
      "1-3 years of experience with machine learning and data analysis",
      "Proficiency in Python and data science libraries like Pandas, NumPy, and Scikit-learn",
      "Understanding of financial concepts is a plus",
      "Strong problem-solving skills and attention to detail"
    ],
    responsibilities: [
      "Develop and maintain prediction models for loan approvals",
      "Analyze financial data to identify patterns and insights",
      "Collaborate with product and engineering teams to implement data-driven features",
      "Monitor and improve model performance over time",
      "Stay updated on latest AI and machine learning advancements"
    ]
  },
  {
    id: "sr-frontend-dev",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Hybrid (San Francisco)",
    type: "Full-time",
    description: "We're looking for an experienced frontend developer to lead the development of our user interfaces and create intuitive financial tools.",
    requirements: [
      "5+ years of experience with React and modern JavaScript",
      "Strong understanding of TypeScript, responsive design, and accessibility",
      "Experience with state management libraries and frontend testing",
      "Knowledge of UI/UX design principles",
      "Ability to mentor junior developers"
    ],
    responsibilities: [
      "Build responsive, intuitive interfaces for our financial tools",
      "Collaborate with designers to implement and refine user experiences",
      "Optimize application performance and ensure cross-browser compatibility",
      "Implement and maintain coding standards and best practices",
      "Mentor junior developers and conduct code reviews"
    ]
  },
  {
    id: "financial-analyst",
    title: "Financial Analyst",
    department: "Finance",
    location: "New York",
    type: "Full-time",
    description: "Help develop the financial logic behind our recommendation systems and ensure our advice is accurate and beneficial to users.",
    requirements: [
      "Bachelor's degree in Finance, Economics, or related field",
      "3+ years of experience in financial analysis or banking",
      "Strong understanding of lending practices and loan assessment",
      "Experience with financial modeling and data analysis",
      "Excellent communication skills"
    ],
    responsibilities: [
      "Develop rules and criteria for our bank recommendation algorithm",
      "Research financial products across different banks and lenders",
      "Create content explaining financial concepts to users",
      "Verify the accuracy of our financial advice tools",
      "Stay updated on changes in lending practices and regulations"
    ]
  },
  {
    id: "marketing-manager",
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Lead our marketing efforts to help more people discover our financial tools and understand how they can benefit from our services.",
    requirements: [
      "5+ years of experience in digital marketing, preferably in fintech",
      "Experience with content marketing, SEO, and social media campaigns",
      "Strong analytical skills and experience with marketing metrics",
      "Excellent writing and communication skills",
      "Understanding of financial services and consumer needs"
    ],
    responsibilities: [
      "Develop and execute marketing strategies to grow our user base",
      "Create compelling content about financial decision-making",
      "Manage digital marketing campaigns across multiple channels",
      "Analyze marketing performance and optimize for conversion",
      "Collaborate with product team to gather user insights"
    ]
  }
];

const Careers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Help us revolutionize how people make financial decisions through innovative technology and personalized insights.
            </p>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Work With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M20 7h-3a2 2 0 0 1-2-2V2" /><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" /><path d="M3 7v10a2 2 0 0 0 2 2h4" /><path d="m12 19 2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Meaningful Impact</h3>
                  <p className="text-muted-foreground">Your work directly helps people make better financial decisions that impact their lives positively.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Cutting-Edge Tech</h3>
                  <p className="text-muted-foreground">Work with the latest technologies in AI, machine learning, and financial modeling.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M2 3h20" /><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" /><path d="m7 21 5-5 5 5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Growth Opportunities</h3>
                  <p className="text-muted-foreground">Fast-paced environment where your skills and career can grow rapidly as we expand.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Comprehensive Healthcare</h3>
                <p className="text-muted-foreground">Medical, dental, and vision coverage for you and your dependents.</p>
              </div>
              <div className="p-4">
                <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Flexible Time Off</h3>
                <p className="text-muted-foreground">Take time when you need it with our open PTO policy.</p>
              </div>
              <div className="p-4">
                <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 20.5c4.4 0 8-3.6 8-8V6.5l-8-4-8 4V12.5c0 4.4 3.6 8 8 8Z" /><path d="M12 12.5v3" /><path d="M12 2.5v3" /><path d="M16 12.5a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">401(k) Matching</h3>
                <p className="text-muted-foreground">We help you save for the future with employer matching.</p>
              </div>
              <div className="p-4">
                <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M2 20h20" /><path d="M5 20V7a1 1 0 0 1 1-1h4v14" /><path d="M9 6V3h2" /><path d="M9 10h12V6a1 1 0 0 0-1-1h-7" /><path d="M13 20v-5a1 1 0 0 1 1-1h5v6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Remote Work Options</h3>
                <p className="text-muted-foreground">Flexible work arrangements to suit your lifestyle.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {jobListings.map(job => (
                <AccordionItem key={job.id} value={job.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left">
                      <div className="font-bold text-lg">{job.title}</div>
                      <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-muted-foreground mt-2 md:mt-0">
                        <div>{job.department}</div>
                        <div className="hidden md:block">•</div>
                        <div>{job.location}</div>
                        <div className="hidden md:block">•</div>
                        <div>{job.type}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2 pb-4">
                      <p className="mb-4 text-muted-foreground">{job.description}</p>
                      
                      <h4 className="font-bold mt-4 mb-2">Requirements:</h4>
                      <ul className="list-disc pl-5 mb-4 text-muted-foreground">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="mb-1">{req}</li>
                        ))}
                      </ul>
                      
                      <h4 className="font-bold mt-4 mb-2">Responsibilities:</h4>
                      <ul className="list-disc pl-5 mb-4 text-muted-foreground">
                        {job.responsibilities.map((resp, index) => (
                          <li key={index} className="mb-1">{resp}</li>
                        ))}
                      </ul>
                      
                      <Button className="mt-2">Apply Now</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
