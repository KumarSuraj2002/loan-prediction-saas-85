
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book, ChevronRight } from "lucide-react";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setPosts(data);
        
        // Extract unique categories from tags
        const allTags = data.flatMap(post => post.tags || []);
        const uniqueCategories = Array.from(new Set(allTags));
        setCategories(['All', ...uniqueCategories.sort()]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (post.tags && post.tags.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });
  
  const featuredPosts = posts.slice(0, 2); // Show first 2 posts as featured
  
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
            <h1 className="text-3xl md:text-5xl font-bold mb-6">FinanceBuddy Blog</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Insights, tips, and guides to help you make smarter financial decisions.
            </p>
          </div>
        </section>

        {/* Featured Posts */}
        {!loading && featuredPosts.length > 0 && (
          <section className="py-12">
            <div className="container px-4 md:px-6 mx-auto">
              <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map(post => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex flex-wrap gap-1">
                          {post.tags?.slice(0, 1).map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">By {post.author}</span>
                        <Button 
                          variant="default" 
                          className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
                          asChild
                          size="sm"
                        >
                          <Link to={`/blog/${post.slug}`} className="flex items-center gap-1">
                            Read More
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

        {/* Search and Filter Section */}
        <section className="py-8 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="w-full md:w-1/3">
                <Input 
                  placeholder="Search articles..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge 
                    key={category} 
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* All Posts Grid */}
        <section className="py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading articles...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex flex-wrap gap-1">
                          {post.tags?.slice(0, 1).map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 hover:text-primary transition-colors">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-sm">By {post.author}</span>
                        <Button 
                          variant="default"
                          size="sm" 
                          className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-sm hover:shadow-md transition-all duration-300"
                          asChild
                        >
                          <Link to={`/blog/${post.slug}`} className="flex items-center gap-1">
                            Read More
                            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-primary/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-muted-foreground mb-6">
                Get the latest financial insights, tips and updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  placeholder="Enter your email" 
                  type="email" 
                  className="flex-1"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
