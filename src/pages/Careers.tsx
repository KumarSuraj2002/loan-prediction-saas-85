import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Briefcase, DollarSign } from "lucide-react";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Career {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  employment_type: string;
  experience_level: string;
  salary_range: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  is_active: boolean;
  application_deadline: string;
  created_at: string;
  updated_at: string;
}

const Careers = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setCareers(data);
      }
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVariantForLevel = (level: string) => {
    switch (level.toLowerCase()) {
      case 'entry-level': return 'outline';
      case 'mid-level': return 'secondary';
      case 'senior': return 'default';
      default: return 'outline';
    }
  };

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
                  <h3 className="text-xl font-bold mb-2">Cutting-Edge Technology</h3>
                  <p className="text-muted-foreground">Work with the latest AI and machine learning technologies to solve real-world financial challenges.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="m22 21-3-3m0 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Growth & Learning</h3>
                  <p className="text-muted-foreground">Continuous learning opportunities, mentorship programs, and career advancement paths to help you grow.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading positions...</p>
              </div>
            ) : careers.length > 0 ? (
              <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="space-y-4">
                  {careers.map((job) => (
                    <AccordionItem key={job.id} value={job.id} className="bg-background rounded-lg border px-6">
                      <AccordionTrigger className="hover:no-underline py-6">
                        <div className="flex items-center justify-between w-full text-left mr-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                <span>{job.department}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span>{job.salary_range}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge variant={getVariantForLevel(job.experience_level)}>
                              {job.experience_level.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                            <Badge variant="outline">
                              {job.employment_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="space-y-6">
                          <p className="text-muted-foreground leading-relaxed">
                            {job.description}
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-3">Requirements</h4>
                              <ul className="space-y-2 text-sm text-muted-foreground">
                                {job.requirements.map((req, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Responsibilities</h4>
                              <ul className="space-y-2 text-sm text-muted-foreground">
                                {job.responsibilities.map((resp, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {job.benefits && job.benefits.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3">Benefits</h4>
                              <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                {job.benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="pt-4 border-t">
                            <Button size="lg" className="w-full md:w-auto">
                              Apply for this Position
                            </Button>
                            {job.application_deadline && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Application deadline: {new Date(job.application_deadline).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No Open Positions</h3>
                <p className="text-muted-foreground">
                  We don't have any open positions at the moment, but we're always looking for talented individuals. Check back soon or send us your resume!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Company Culture */}
        <section className="py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We believe in creating an inclusive, collaborative environment where everyone can do their best work. 
                Our team is passionate about using technology to solve real problems and make a positive impact on people's financial lives.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="font-semibold mb-2">Collaboration</h3>
                  <p className="text-sm text-muted-foreground">We work together across teams to achieve common goals</p>
                </div>
                <div>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">We encourage creative thinking and innovative solutions</p>
                </div>
                <div>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💪</span>
                  </div>
                  <h3 className="font-semibold mb-2">Growth</h3>
                  <p className="text-sm text-muted-foreground">We invest in your professional and personal development</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary/10">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Don't See the Right Role?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for financial technology. 
              Send us your resume and let us know how you'd like to contribute to our mission.
            </p>
            <Button size="lg">Send Your Resume</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;