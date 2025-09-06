import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Book, ChevronRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FinancialGuide {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  featured_image: string;
  tags: string[];
  category: string;
  difficulty_level: string;
  estimated_read_time: number;
  is_published: boolean;
  publish_date: string;
  created_at: string;
  updated_at: string;
}

const FinancialGuides = () => {
  const [guides, setGuides] = useState<FinancialGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_guides')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setGuides(data);
      }
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'credit': return '📊';
      case 'mortgages': return '🏠';
      case 'savings': return '💰';
      case 'investing': return '📈';
      case 'loans': return '💳';
      default: return '📚';
    }
  };

  const getColorForLevel = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100';
      case 'intermediate': return 'bg-yellow-100';
      case 'advanced': return 'bg-red-100';
      default: return 'bg-blue-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading guides...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Book className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Financial Guides</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive guides to help you navigate every aspect of your financial journey.
            </p>
          </div>
        </section>

        {/* Featured Guides */}
        {guides.length > 0 && (
          <section className="py-16">
            <div className="container px-4 md:px-6 mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Popular Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {guides.slice(0, 3).map(guide => (
                  <Card key={guide.id} className={`overflow-hidden hover:shadow-lg transition-shadow border-t-4 ${getColorForLevel(guide.difficulty_level).replace('bg-', 'border-')}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className={`h-12 w-12 rounded-full ${getColorForLevel(guide.difficulty_level)} flex items-center justify-center text-2xl`}>
                          {getIconForCategory(guide.category)}
                        </div>
                        <Badge variant={guide.difficulty_level === "beginner" ? "outline" : guide.difficulty_level === "intermediate" ? "secondary" : "default"}>
                          {guide.difficulty_level.charAt(0).toUpperCase() + guide.difficulty_level.slice(1)}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                      <p className="text-muted-foreground mb-4">{guide.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">⏱️ {guide.estimated_read_time} mins</span>
                        <Button 
                          variant="default" 
                          className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
                          asChild
                        >
                          <Link to={`/guides/${guide.slug}`} className="flex items-center gap-1">
                            Read Guide
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Guides by Level */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Browse All Guides</h2>
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-4 w-full max-w-md">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="beginner">Beginner</TabsTrigger>
                  <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides.map(guide => (
                    <GuideCard key={guide.id} guide={guide} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="beginner" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides.filter(guide => guide.difficulty_level === "beginner").map(guide => (
                    <GuideCard key={guide.id} guide={guide} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="intermediate" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides.filter(guide => guide.difficulty_level === "intermediate").map(guide => (
                    <GuideCard key={guide.id} guide={guide} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides.filter(guide => guide.difficulty_level === "advanced").map(guide => (
                    <GuideCard key={guide.id} guide={guide} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Financial Topics */}
        <section className="py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Financial Topics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from(new Set(guides.map(guide => guide.category))).map((category, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow text-center cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-2">{getIconForCategory(category)}</div>
                    <h3 className="font-bold">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {guides.filter(guide => guide.category === category).length} guides
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary/10">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our financial experts are ready to help you with personalized guidance tailored to your unique situation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg">Schedule a Consultation</Button>
              <Button variant="outline" size="lg">Contact Support</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const GuideCard = ({ guide }: { guide: FinancialGuide }) => {
  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'credit': return '📊';
      case 'mortgages': return '🏠';
      case 'savings': return '💰';
      case 'investing': return '📈';
      case 'loans': return '💳';
      default: return '📚';
    }
  };

  const getColorForLevel = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100';
      case 'intermediate': return 'bg-yellow-100';
      case 'advanced': return 'bg-red-100';
      default: return 'bg-blue-100';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className={`h-10 w-10 rounded-full ${getColorForLevel(guide.difficulty_level)} flex items-center justify-center text-xl`}>
            {getIconForCategory(guide.category)}
          </div>
          <Badge variant={guide.difficulty_level === "beginner" ? "outline" : guide.difficulty_level === "intermediate" ? "secondary" : "default"}>
            {guide.difficulty_level.charAt(0).toUpperCase() + guide.difficulty_level.slice(1)}
          </Badge>
        </div>
        <h3 className="text-lg font-bold mb-2">{guide.title}</h3>
        <p className="text-muted-foreground mb-4 flex-1">{guide.excerpt}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-muted-foreground">⏱️ {guide.estimated_read_time} mins</span>
          <Button 
            variant="default" 
            size="sm" 
            className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-sm hover:shadow-md transition-all duration-300"
            asChild
          >
            <Link to={`/guides/${guide.slug}`} className="flex items-center gap-1">
              Read Guide
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialGuides;