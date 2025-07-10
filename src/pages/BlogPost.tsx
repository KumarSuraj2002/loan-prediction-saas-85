
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Clock, Calendar, User } from "lucide-react";
import { blogPosts } from '../data/blogData';
import { Separator } from "@/components/ui/separator";

const BlogPost = () => {
  const { postId } = useParams();
  const post = blogPosts.find(post => post.id === Number(postId));

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="mb-6">The blog post you're looking for does not exist.</p>
            <Button asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all">
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate estimated reading time (avg reading speed: 200 words per minute)
  const contentText = `${post.excerpt} ${post.content.intro} ${post.content.sections.map(section => `${section.title} ${section.content}`).join(' ')} ${post.content.conclusion.title} ${post.content.conclusion.content}`;
  const wordCount = contentText.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section with Blog Title */}
        <div 
          className="w-full h-[50vh] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${post.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 flex items-center justify-center">
            <div className="container px-4 md:px-6 text-center">
              <div className="inline-flex gap-2 mb-6">
                <Badge variant="outline" className="bg-primary/20 backdrop-blur-sm text-white border-primary/40 mb-4">
                  {post.category}
                </Badge>
                <Badge variant="outline" className="bg-black/20 backdrop-blur-sm text-white border-white/20 mb-4 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {readingTime} min read
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">{post.title}</h1>
              <div className="flex items-center justify-center gap-6 text-white/90">
                <span className="flex items-center gap-1 text-sm">
                  <User className="h-4 w-4" /> {post.author}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4" /> {post.date}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="container px-4 md:px-6 mx-auto py-12">
          <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 group transition-colors">
            <Button variant="ghost" size="sm" className="group-hover:translate-x-[-2px] transition-transform">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to all articles
            </Button>
          </Link>

          <div className="prose prose-lg md:prose-xl max-w-prose mx-auto">
            <div className="bg-muted/30 p-6 rounded-lg border border-muted mb-8">
              <p className="text-xl font-medium leading-relaxed text-foreground/90 not-prose">
                {post.excerpt}
              </p>
            </div>
            
            <p className="lead text-muted-foreground">
              {post.content.intro}
            </p>

            <Separator className="my-8" />

            <section className="my-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{post.content.sections[0].title}</h2>
              <p className="text-muted-foreground">{post.content.sections[0].content}</p>
            </section>

            <section className="my-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{post.content.sections[1].title}</h2>
              <p className="text-muted-foreground">{post.content.sections[1].content}</p>
            </section>

            {post.content.sections[2] && (
              <section className="my-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{post.content.sections[2].title}</h2>
                <p className="text-muted-foreground">{post.content.sections[2].content}</p>
              </section>
            )}

            <Separator className="my-8" />

            <section className="my-12 bg-accent/30 p-6 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{post.content.conclusion.title}</h2>
              <p className="text-muted-foreground">{post.content.conclusion.content}</p>
            </section>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-6 border-t gap-4">
              <Badge variant="outline" className="px-4 py-2">
                {post.category}
              </Badge>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-4 py-2 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {readingTime} min read
                </Badge>
                <p className="text-sm text-muted-foreground">Published on {post.date}</p>
              </div>
            </div>
            
            {/* Related Articles Section - You might want to expand this later */}
            <div className="mt-16">
              <h3 className="text-xl font-bold mb-6">Continue Reading</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {blogPosts
                  .filter(relatedPost => relatedPost.id !== post.id && relatedPost.category === post.category)
                  .slice(0, 2)
                  .map(relatedPost => (
                    <Link 
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.id}`}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors group flex flex-col gap-2 no-underline"
                    >
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h4>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <span className="text-primary text-sm mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read more <ChevronLeft className="h-3 w-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
