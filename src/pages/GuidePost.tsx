
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { guides } from '../data/guidesData';
import { Separator } from '@/components/ui/separator';

const GuidePost = () => {
  const { guideId } = useParams();
  const guide = guides.find(guide => guide.id === Number(guideId));

  if (!guide || !guide.content) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Guide Not Found</h1>
            <p className="mb-6">The financial guide you're looking for does not exist or has no content yet.</p>
            <Button asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all">
              <Link to="/guides">Back to Guides</Link>
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
        {/* Hero Section with Guide Title */}
        <div className={`w-full py-16 ${guide.color.replace('bg-', 'bg-')}`}>
          <div className="container px-4 md:px-6 mx-auto">
            <Badge variant="outline" className="bg-primary/10 text-primary mb-4">{guide.category}</Badge>
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-12 w-12 rounded-full bg-white flex items-center justify-center text-2xl`}>
                {guide.icon}
              </div>
              <Badge variant={guide.level === "Beginner" ? "outline" : guide.level === "Intermediate" ? "secondary" : "default"}>
                {guide.level}
              </Badge>
              <span className="text-sm text-muted-foreground">⏱️ {guide.estimatedTime}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{guide.title}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">{guide.description}</p>
          </div>
        </div>

        {/* Guide Content */}
        <div className="container px-4 md:px-6 mx-auto py-12">
          <Link to="/guides" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 group transition-colors">
            <Button variant="ghost" size="sm" className="group-hover:translate-x-[-2px] transition-transform">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to all guides
            </Button>
          </Link>

          <div className="prose prose-lg max-w-4xl mx-auto">
            <p className="lead">{guide.content.intro}</p>
            
            {guide.content.sections.map((section, index) => (
              <div key={index} className="my-8">
                <h2>{section.title}</h2>
                <p>{section.content}</p>
              </div>
            ))}

            <h2>{guide.content.conclusion.title}</h2>
            <p>{guide.content.conclusion.content}</p>

            {guide.content.tips && (
              <div className="my-8 p-6 bg-muted/30 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Quick Tips</h3>
                <ul>
                  {guide.content.tips.map((tip, index) => (
                    <li key={index} className="mb-2">{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {guide.content.resources && (
              <div className="my-8">
                <h3 className="text-xl font-bold mb-4">Additional Resources</h3>
                <Separator className="mb-4" />
                <ul className="space-y-2">
                  {guide.content.resources.map((resource, index) => (
                    <li key={index} className="mb-2">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline-offset-4 hover:underline inline-flex items-center gap-1 transition-colors"
                      >
                        {resource.title}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center mt-12 pt-6 border-t">
              <Badge variant="outline">{guide.category}</Badge>
              <Badge variant={guide.level === "Beginner" ? "outline" : guide.level === "Intermediate" ? "secondary" : "default"}>
                {guide.level} • {guide.estimatedTime}
              </Badge>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuidePost;
