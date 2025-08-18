
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  avatar: string;
  display_order: number;
}

interface SiteSettings {
  site_title: string;
  about_us: string;
}

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_title: 'FinanceBuddy',
    about_us: 'We\'re on a mission to simplify financial decisions for everyone through innovative technology and personalized insights.'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      console.log('Fetching site settings...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'general')
        .single();

      console.log('Site settings response:', { data, error });

      if (error) {
        console.error('Error fetching site settings:', error);
        return;
      }
      
      if (data && data.setting_value) {
        console.log('Setting site settings to:', data.setting_value);
        setSiteSettings(data.setting_value as unknown as SiteSettings);
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl md:text-5xl font-bold mb-6">About {siteSettings.site_title}</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {siteSettings.about_us}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2020, FinanceBuddy was born from a simple observation: most people find financial decisions overwhelming and complex.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our founder, Sarah Johnson, experienced firsthand the challenges of navigating loan options and banking services without clear guidance. She assembled a team of financial experts and technologists to build a solution.
                </p>
                <p className="text-muted-foreground">
                  Today, we help thousands of users make smarter financial choices through our AI-powered platform, combining cutting-edge technology with human financial expertise.
                </p>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop" 
                  alt="Team working together" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The passionate individuals behind FinanceBuddy who work tirelessly to make financial decisions simpler for you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Loading team members...</p>
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No team members found.</p>
                </div>
              ) : (
                teamMembers.map((member) => (
                  <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-primary font-medium mb-3">{member.position}</p>
                      <p className="text-muted-foreground">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at FinanceBuddy.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Transparency</h3>
                <p className="text-muted-foreground">We believe in clear, honest communication about financial options and their implications.</p>
              </div>
              <div className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M18 8h1a4 4 0 1 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" x2="6" y1="1" y2="4" /><line x1="10" x2="10" y1="1" y2="4" /><line x1="14" x2="14" y1="1" y2="4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Accessibility</h3>
                <p className="text-muted-foreground">We're committed to making financial tools and knowledge accessible to everyone.</p>
              </div>
              <div className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M7 11v2a3 3 0 0 0 6 0v-2H7Z" /><line x1="10" x2="10" y1="2" y2="4" /><line x1="14" x2="18" y1="8" y2="12" /><line x1="6" x2="2" y1="8" y2="12" /><path d="M16 7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7z" /><path d="M10 15v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground">We constantly push the boundaries of what's possible in financial technology.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
