
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface PressRelease {
  id: number;
  title: string;
  date: string;
  summary: string;
  category: string;
}

interface MediaMention {
  id: number;
  outlet: string;
  title: string;
  date: string;
  link: string;
  image: string;
}

const pressReleases: PressRelease[] = [
  {
    id: 1,
    title: "FinanceBuddy Launches AI-Powered Loan Prediction Platform",
    date: "March 15, 2024",
    summary: "FinanceBuddy today announced the launch of its innovative loan prediction platform, designed to help consumers make more informed financial decisions using artificial intelligence.",
    category: "Product Launch"
  },
  {
    id: 2,
    title: "FinanceBuddy Secures $5M in Seed Funding",
    date: "January 10, 2024",
    summary: "FinanceBuddy has secured $5 million in seed funding led by Tech Ventures Partners, with participation from Finance Innovation Fund and several angel investors.",
    category: "Funding"
  },
  {
    id: 3,
    title: "FinanceBuddy Partners with Five Major Banks to Enhance Recommendation System",
    date: "November 22, 2023",
    summary: "FinanceBuddy announces strategic partnerships with five major financial institutions to enhance its bank recommendation system with real-time data and special offers.",
    category: "Partnership"
  },
  {
    id: 4,
    title: "FinanceBuddy Releases 2023 Consumer Financial Decision Report",
    date: "October 5, 2023",
    summary: "Our latest research shows that 68% of consumers find loan applications stressful and 72% are unsure if they're getting the best banking deals.",
    category: "Research"
  },
  {
    id: 5,
    title: "FinanceBuddy Expands Team with Industry Veterans",
    date: "September 12, 2023",
    summary: "FinanceBuddy welcomes former banking executives and data scientists to its growing team as part of its mission to transform financial decision-making.",
    category: "Company News"
  }
];

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
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Press & Media</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Latest news, announcements, and media coverage about FinanceBuddy.
            </p>
          </div>
        </section>

        {/* Press Contacts */}
        <section className="py-12 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="bg-card border rounded-lg p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Press Contact</h2>
                <p className="text-muted-foreground mb-4">For media inquiries, please contact our press team.</p>
                <p><strong>Email:</strong> media@financebuddy.com</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all">
                Download Press Kit
              </Button>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-8">Press Releases</h2>
            <div className="space-y-6">
              {pressReleases.map(release => (
                <Card key={release.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <Badge variant="secondary" className="w-fit mb-2 md:mb-0">{release.category}</Badge>
                      <span className="text-sm text-muted-foreground">{release.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{release.title}</h3>
                    <p className="text-muted-foreground mb-4">{release.summary}</p>
                    <Button variant="outline" asChild className="group-hover:border-primary/50 group-hover:text-primary transition-all flex items-center gap-2">
                      <Link to={`/press/${release.id}`}>
                        Read Full Release <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Media Coverage */}
        <section className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-8">Media Coverage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaMentions.map(mention => (
                <Card key={mention.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                      <img 
                        src={mention.image} 
                        alt={mention.outlet} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6 md:w-2/3 flex flex-col">
                      <div className="mb-auto">
                        <div className="text-sm text-muted-foreground mb-2">{mention.outlet} • {mention.date}</div>
                        <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{mention.title}</h3>
                      </div>
                      <Button variant="outline" asChild className="group-hover:border-primary/50 group-hover:text-primary transition-all flex items-center gap-2">
                        <a href={mention.link} target="_blank" rel="noopener noreferrer">
                          Read Article <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Assets */}
        <section className="py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-8">Brand Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-md transition-shadow group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Logo Pack</h3>
                  <p className="text-muted-foreground mb-4">Download our logo in various formats and sizes.</p>
                  <Button variant="outline" className="w-full group-hover:border-primary/50 group-hover:text-primary transition-all">Download Logos</Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M8.8 20v-4.1l1.9.2c2 .2 3.8-1 4.4-2.9.6-1.9-.3-3.9-2.1-4.9s-3.9-.5-5.6 1.1c-1.7-1.6-4-2.1-5.8-1.1s-2.6 3-2.1 4.9c.6 1.9 2.4 3.2 4.4 2.9l1.9-.2V20" />
                      <path d="M18 2v2" /><path d="M22 6h-2" /><path d="M20 12h2" /><path d="M18 16v2" /><path d="M14 18h2" /><path d="M12 12h2" /><path d="M14 6h-2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Brand Guidelines</h3>
                  <p className="text-muted-foreground mb-4">Learn how to properly use our brand elements.</p>
                  <Button variant="outline" className="w-full group-hover:border-primary/50 group-hover:text-primary transition-all">View Guidelines</Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" />
                      <path d="M9 13v-1h6v1" /><path d="M11 18h2" /><path d="M12 12v6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Product Screenshots</h3>
                  <p className="text-muted-foreground mb-4">High-resolution images of our platform in action.</p>
                  <Button variant="outline" className="w-full group-hover:border-primary/50 group-hover:text-primary transition-all">Download Images</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Press;
