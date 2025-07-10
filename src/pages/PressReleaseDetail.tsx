
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Calendar, Clock, Share2, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Define press release data structure
interface PressRelease {
  id: number;
  title: string;
  date: string;
  summary: string;
  category: string;
  content?: {
    intro: string;
    body: string[];
    conclusion: string;
  };
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
}

// Sample press releases data
const pressReleasesData: PressRelease[] = [
  {
    id: 1,
    title: "FinanceBuddy Launches AI-Powered Loan Prediction Platform",
    date: "March 15, 2024",
    summary: "FinanceBuddy today announced the launch of its innovative loan prediction platform, designed to help consumers make more informed financial decisions using artificial intelligence.",
    category: "Product Launch",
    content: {
      intro: "FinanceBuddy, a leading fintech startup, today announced the launch of its revolutionary loan prediction platform that leverages artificial intelligence to transform how consumers make financial decisions. This innovative technology aims to bridge the gap between traditional banking and modern consumer needs by providing personalized, data-driven loan recommendations.",
      body: [
        "The new AI-powered platform analyzes over 100 different data points to provide accurate loan approval predictions, helping users understand their chances of approval before they apply. This approach not only saves time but also protects credit scores from unnecessary hard inquiries.",
        "\"We created this platform to demystify the loan application process,\" said Jane Doe, CEO of FinanceBuddy. \"Many consumers don't understand why they're denied for loans, or which loans they should apply for. Our AI eliminates that guesswork.\"",
        "The platform features an intuitive interface that guides users through a simple questionnaire, after which the proprietary algorithm calculates approval odds across multiple lenders. Early beta testing showed a 92% accuracy rate in predicting loan approvals.",
        "In addition to loan predictions, the platform offers personalized recommendations to improve approval chances and find better interest rates. These financial health tips are tailored to each user's unique financial situation."
      ],
      conclusion: "The FinanceBuddy loan prediction platform is available today for all users. The company plans to expand its AI capabilities to include mortgage and auto loan predictions by the end of the year."
    },
    contactPerson: "Sarah Johnson",
    contactEmail: "press@financebuddy.com",
    contactPhone: "(555) 123-4567"
  },
  {
    id: 2,
    title: "FinanceBuddy Secures $5M in Seed Funding",
    date: "January 10, 2024",
    summary: "FinanceBuddy has secured $5 million in seed funding led by Tech Ventures Partners, with participation from Finance Innovation Fund and several angel investors.",
    category: "Funding",
    content: {
      intro: "FinanceBuddy, the AI-powered financial decision platform, today announced it has raised $5 million in seed funding to accelerate its growth and expand its product offerings. The funding round was led by Tech Ventures Partners, with significant participation from Finance Innovation Fund and a group of strategic angel investors from the banking and technology sectors.",
      body: [
        "This substantial seed investment will fuel FinanceBuddy's mission to democratize financial decision-making through innovative technology solutions. The company plans to use the funds to expand its engineering team, enhance its AI algorithms, and accelerate market penetration.",
        "\"We're thrilled to partner with investors who share our vision of making complex financial decisions accessible to everyone,\" said Michael Chen, Founder and CEO of FinanceBuddy. \"This funding will allow us to build out our platform and reach millions of consumers who struggle with financial choices.\"",
        "Sarah Miller, Partner at Tech Ventures Partners, commented, \"FinanceBuddy represents the future of personal finance - combining powerful AI with an intuitive user experience to solve real consumer problems. We believe their approach will transform how people interact with financial products.\"",
        "The funding comes after FinanceBuddy's successful beta phase, which demonstrated strong user engagement and positive feedback. Early metrics show users saving an average of 2.3% on loan interest rates through the platform's recommendations."
      ],
      conclusion: "FinanceBuddy will use this investment to launch additional features in Q2 2024, including a bank recommendation engine and personalized financial education resources tailored to each user's financial situation."
    },
    contactPerson: "David Wilson",
    contactEmail: "investors@financebuddy.com",
    contactPhone: "(555) 987-6543"
  },
  {
    id: 3,
    title: "FinanceBuddy Partners with Five Major Banks to Enhance Recommendation System",
    date: "November 22, 2023",
    summary: "FinanceBuddy announces strategic partnerships with five major financial institutions to enhance its bank recommendation system with real-time data and special offers.",
    category: "Partnership",
    content: {
      intro: "FinanceBuddy today announced strategic partnerships with five leading national banks to enhance its bank recommendation system. These partnerships will provide users with access to real-time data, exclusive offers, and streamlined application processes when using the platform to find banking products.",
      body: [
        "The partnerships mark a significant milestone in FinanceBuddy's growth strategy, bringing together traditional financial institutions and innovative fintech solutions. Users of the FinanceBuddy platform will now benefit from up-to-date interest rates, reduced fees, and expedited application processes when applying through the platform.",
        "\"These partnerships allow us to offer our users a truly comprehensive view of the banking landscape,\" said Alex Rivera, Chief Partnership Officer at FinanceBuddy. \"By working directly with these major financial institutions, we can now provide more accurate, timely recommendations and exclusive benefits you can't find elsewhere.\"",
        "The participating banks, which include national and regional leaders in consumer banking, will gain access to FinanceBuddy's growing user base of financially motivated consumers. This creates a new customer acquisition channel with higher conversion rates due to FinanceBuddy's precise matching algorithm.",
        "James Thompson, VP of Digital Strategy at First National Bank, one of the participating institutions, noted, \"We're excited to work with FinanceBuddy to reach consumers who are actively looking for banking solutions. Their technology helps match our products with the right customers at the right time.\""
      ],
      conclusion: "The enhanced bank recommendation system is now live on the FinanceBuddy platform. The company is actively working to add more banking partners in the coming months to further expand the options available to users."
    },
    contactPerson: "Maria Garcia",
    contactEmail: "partnerships@financebuddy.com",
    contactPhone: "(555) 234-5678"
  },
  {
    id: 4,
    title: "FinanceBuddy Releases 2023 Consumer Financial Decision Report",
    date: "October 5, 2023",
    summary: "Our latest research shows that 68% of consumers find loan applications stressful and 72% are unsure if they're getting the best banking deals.",
    category: "Research",
    content: {
      intro: "FinanceBuddy has released its inaugural Consumer Financial Decision Report, highlighting significant challenges facing consumers as they navigate complex financial choices. The comprehensive study surveyed over 2,000 Americans about their experiences with loans, banking, and financial decision-making.",
      body: [
        "The report reveals several concerning trends in consumer financial literacy and confidence. Nearly 68% of respondents described the loan application process as \"stressful\" or \"very stressful,\" while 72% expressed uncertainty about whether they were getting the best available banking deals.",
        "\"What we're seeing is a widespread lack of confidence when it comes to making important financial decisions,\" said Dr. Jennifer Patel, Research Director at FinanceBuddy. \"This uncertainty often leads consumers to make suboptimal choices or avoid making decisions altogether.\"",
        "Other key findings from the report include:",
        "• 63% of consumers have stayed with the same bank for over five years, despite potentially better options elsewhere",
        "• 54% have never compared loan options from multiple lenders",
        "• 47% don't fully understand how their credit score affects loan approval and interest rates",
        "• 81% would use AI-powered tools to help make financial decisions if they were readily available"
      ],
      conclusion: "The full 2023 Consumer Financial Decision Report is now available for download on the FinanceBuddy website. The company plans to use these insights to further refine its platform and address the specific pain points identified in the research."
    },
    contactPerson: "Dr. Jennifer Patel",
    contactEmail: "research@financebuddy.com",
    contactPhone: "(555) 345-6789"
  },
  {
    id: 5,
    title: "FinanceBuddy Expands Team with Industry Veterans",
    date: "September 12, 2023",
    summary: "FinanceBuddy welcomes former banking executives and data scientists to its growing team as part of its mission to transform financial decision-making.",
    category: "Company News",
    content: {
      intro: "FinanceBuddy today announced the expansion of its leadership team with the addition of several industry veterans from the banking, data science, and consumer finance sectors. These strategic hires will help drive the company's next phase of growth as it continues to transform how consumers make financial decisions.",
      body: [
        "The new appointments include Robert Johnson, former VP of Consumer Banking at National Trust Bank, who joins as Chief Banking Officer; Dr. Lisa Chang, previously Lead Data Scientist at Financial AI Innovations, who will serve as Head of AI Research; and Marcus Williams, former Head of Product at Consumer Finance Technologies, joining as VP of Product Development.",
        "\"We're assembling a world-class team of experts who understand both the technical aspects of our AI platform and the real-world financial challenges that consumers face,\" said Emily Roberts, COO of FinanceBuddy. \"These key hires bring decades of combined experience that will be invaluable as we scale our platform.\"",
        "The expansion comes as FinanceBuddy experiences rapid growth, with user numbers increasing 300% in the past quarter. The company has now grown to over 50 employees, with plans to double that number by the end of next year.",
        "Robert Johnson commented on his appointment: \"After 20 years in traditional banking, I've seen firsthand how consumers struggle with financial decisions. FinanceBuddy's approach represents the future of consumer finance, and I'm excited to help build technology that truly empowers users.\""
      ],
      conclusion: "The expanded team will focus on launching several new features in the coming months, including personalized financial education resources and an enhanced loan comparison tool. The company is continuing to recruit top talent across engineering, data science, and financial analysis."
    },
    contactPerson: "Thomas Lee",
    contactEmail: "careers@financebuddy.com",
    contactPhone: "(555) 456-7890"
  }
];

const PressReleaseDetail = () => {
  const { releaseId } = useParams();
  const pressRelease = pressReleasesData.find(release => release.id === Number(releaseId));

  if (!pressRelease) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Press Release Not Found</h1>
            <p className="mb-6">The press release you're looking for does not exist.</p>
            <Button asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all">
              <Link to="/press">Back to Press</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate estimated reading time (avg reading speed: 250 words per minute)
  const contentText = `${pressRelease.summary} ${pressRelease.content?.intro || ''} ${(pressRelease.content?.body || []).join(' ')} ${pressRelease.content?.conclusion || ''}`;
  const wordCount = contentText.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 250));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section with Title */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <Link to="/press" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 group transition-colors">
              <Button variant="ghost" size="sm" className="group-hover:translate-x-[-2px] transition-transform">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to all press releases
              </Button>
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                {pressRelease.category}
              </Badge>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {pressRelease.date}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {readingTime} min read
                </Badge>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">{pressRelease.title}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">{pressRelease.summary}</p>
          </div>
        </div>

        {/* Press Release Content */}
        <div className="container px-4 md:px-6 mx-auto py-12">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl">{pressRelease.content?.intro}</p>
              
              <Separator className="my-8" />
              
              {pressRelease.content?.body.map((paragraph, index) => (
                <p key={index} className="my-4">{paragraph}</p>
              ))}
              
              <Separator className="my-8" />
              
              <div className="bg-muted/30 p-6 rounded-lg border border-muted my-8">
                <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
                <p>{pressRelease.content?.conclusion}</p>
              </div>
              
              {/* Press Contact Information */}
              <div className="bg-card border rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold mb-4">Media Contact</h3>
                <div className="space-y-2">
                  <p><strong>Contact:</strong> {pressRelease.contactPerson}</p>
                  <p><strong>Email:</strong> {pressRelease.contactEmail}</p>
                  <p><strong>Phone:</strong> {pressRelease.contactPhone}</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                  <Download className="h-4 w-4" /> Download Press Release
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
            </div>
            
            {/* Related Press Releases */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6">More Press Releases</h3>
              <div className="grid grid-cols-1 gap-6">
                {pressReleasesData
                  .filter(release => release.id !== pressRelease.id)
                  .slice(0, 3)
                  .map(release => (
                    <Card key={release.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                          <Badge variant="outline" className="w-fit">{release.category}</Badge>
                          <span className="text-sm text-muted-foreground">{release.date}</span>
                        </div>
                        <h4 className="text-lg font-bold mb-2">{release.title}</h4>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{release.summary}</p>
                        <Button variant="outline" asChild>
                          <Link to={`/press/${release.id}`}>Read Full Release</Link>
                        </Button>
                      </CardContent>
                    </Card>
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

export default PressReleaseDetail;
