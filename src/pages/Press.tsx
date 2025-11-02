import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, ExternalLink } from "lucide-react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PressRelease {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  location: string;
  featured_image: string;
  press_contact_name: string;
  press_contact_email: string;
  press_contact_phone: string;
  is_published: boolean;
  publish_date: string;
  created_at: string;
  updated_at: string;
}

interface MediaMention {
  id: number;
  outlet: string;
  title: string;
  date: string;
  link: string;
  image: string;
}

// Static media mentions data
const mediaMentions: MediaMention[] = [
  {
    id: 1,
    outlet: "Tech Finance Today",
    title: "How FinanceBuddy is Changing Loan Applications Forever",
    date: "April 2, 2024",
    link: "#",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop"
  },
  {
    id: 2,
    outlet: "Business Insider",
    title: "The Fintech Startups to Watch in 2024",
    date: "February 15, 2024",
    link: "#",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop"
  },
  {
    id: 3,
    outlet: "Financial Review",
    title: "AI Tools Making Banking Accessible for Everyone",
    date: "January 23, 2024",
    link: "#",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=200&fit=crop"
  },
  {
    id: 4,
    outlet: "Digital Finance Magazine",
    title: "Is FinanceBuddy the Future of Financial Decision-Making?",
    date: "December 10, 2023",
    link: "#",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=300&h=200&fit=crop"
  }
];

const Press = () => {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPressReleases();

    // Set up real-time subscription
    const channel = supabase
      .channel('press-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'press_releases'
        },
        () => {
          fetchPressReleases();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPressReleases = async () => {
    try {
      const { data, error } = await supabase
        .from('press_releases')
        .select('*')
        .eq('is_published', true)
        .order('publish_date', { ascending: false });

      if (error) throw error;
      if (data) {
        setPressReleases(data);
      }
    } catch (error) {
      console.error('Error fetching press releases:', error);
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
              <Newspaper className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Press & Media</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest news, announcements, and media coverage about FinanceBuddy.
            </p>
          </div>
        </section>

        {/* Press Contact */}
        <section className="py-12 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Media Inquiries</h2>
              <p className="text-muted-foreground mb-6">
                For press inquiries, interviews, or media assets, please contact our press team.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg">
                  <a href="mailto:press@financebuddy.com">Contact Press Team</a>
                </Button>
                <Button variant="outline" size="lg">
                  Download Media Kit
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-8">Press Releases</h2>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading press releases...</p>
              </div>
            ) : pressReleases.length > 0 ? (
              <div className="space-y-6">
                {pressReleases.map(release => (
                  <Card key={release.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            <Link to={`/press/${release.slug}`}>
                              {release.title}
                            </Link>
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {release.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{new Date(release.publish_date || release.created_at).toLocaleDateString()}</span>
                            {release.location && (
                              <>
                                <span>•</span>
                                <span>{release.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6">
                          <Button asChild>
                            <Link to={`/press/${release.slug}`}>
                              Read More
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No Press Releases</h3>
                <p className="text-muted-foreground">No press releases available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Media Mentions */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">In the News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mediaMentions.map(mention => (
                <Card key={mention.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={mention.image} 
                      alt={mention.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {mention.outlet}
                    </Badge>
                    <h3 className="font-semibold mb-2 text-sm leading-tight line-clamp-2">
                      {mention.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {mention.date}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={mention.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Awards & Recognition</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h3 className="font-bold mb-2">Best Fintech Startup 2024</h3>
                  <p className="text-sm text-muted-foreground">
                    TechFinance Awards
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="font-bold mb-2">Innovation in AI</h3>
                  <p className="text-sm text-muted-foreground">
                    Financial Technology Excellence Awards
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h3 className="font-bold mb-2">Top 10 Startups to Watch</h3>
                  <p className="text-sm text-muted-foreground">
                    Business Innovation Magazine
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-primary/10">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Follow us on social media and subscribe to our newsletter to stay updated with the latest news and announcements.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" size="lg">
                Follow on Twitter
              </Button>
              <Button variant="outline" size="lg">
                Connect on LinkedIn
              </Button>
              <Button size="lg">
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Press;