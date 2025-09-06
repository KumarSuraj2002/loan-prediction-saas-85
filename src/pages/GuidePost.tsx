import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';

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

const GuidePost = () => {
  const { guideId } = useParams();
  const [guide, setGuide] = useState<FinancialGuide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (guideId) {
      fetchGuide(guideId);
    }
  }, [guideId]);

  const fetchGuide = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('financial_guides')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setGuide(data);
    } catch (error) {
      console.error('Error fetching guide:', error);
      setGuide(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading guide...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Guide Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The guide you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/guides" className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Guides
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 md:px-6 mx-auto py-8">
          <div className="mb-8">
            <Button variant="ghost" asChild className="hover:bg-muted/50">
              <Link to="/guides" className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Guides
              </Link>
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{guide.title}</h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
                {guide.excerpt}
              </p>
              
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
                <span>By {guide.author}</span>
                <span>•</span>
                <span>⏱️ {guide.estimated_read_time} min read</span>
                <span>•</span>
                <Badge variant="outline">{guide.difficulty_level}</Badge>
              </div>
            </div>

            <Separator className="mb-8" />

            <div className="prose prose-lg max-w-none">
              <div 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: guide.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            </div>

            <div className="mt-12 pt-8 border-t flex justify-between items-center">
              <Button variant="outline" asChild>
                <Link to="/guides" className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  All Guides
                </Link>
              </Button>
              <Button asChild>
                <Link to="/contact" className="flex items-center gap-1">
                  Get Help
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuidePost;