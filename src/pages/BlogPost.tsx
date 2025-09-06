import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Clock, Calendar, User } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from 'react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  featured_image: string;
  tags: string[];
  is_published: boolean;
  publish_date: string;
  created_at: string;
  updated_at: string;
}

const BlogPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);

  const fetchPost = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading article...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog" className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Blog
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
              <Link to="/blog" className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <article className="max-w-4xl mx-auto">
            <header className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
              
              <div className="aspect-video mb-8 overflow-hidden rounded-lg">
                <img 
                  src={post.featured_image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>By {post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>5 min read</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            </header>

            <Separator className="mb-8" />

            <div className="prose prose-lg max-w-none">
              <div 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            </div>

            <div className="mt-16 pt-16 border-t">
              <div className="text-center">
                <Button asChild size="lg">
                  <Link to="/blog" className="flex items-center gap-1">
                    Back to All Articles
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;