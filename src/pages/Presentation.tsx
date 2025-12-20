import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home,
  Brain,
  Building2,
  Shield,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Database,
  Globe,
  CheckCircle,
  TrendingUp,
  Zap,
  Lock,
  BarChart3,
  Layers,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import pptxgen from 'pptxgenjs';
import { toast } from 'sonner';

const slides = [
  {
    id: 1,
    type: 'title',
    title: 'Smart Loan Prediction System',
    subtitle: 'AI-Powered Financial Intelligence Platform',
    icon: Brain,
    gradient: 'from-primary via-primary/80 to-primary/60'
  },
  {
    id: 2,
    type: 'overview',
    title: 'Project Overview',
    icon: Globe,
    content: {
      description: 'A comprehensive full-stack web application that revolutionizes the loan application process through AI-powered predictions and digital transformation.',
      points: [
        'Instant loan approval predictions',
        'Multi-bank comparison platform',
        'Complete digital application process',
        'Real-time AI assistance'
      ]
    }
  },
  {
    id: 3,
    type: 'features',
    title: 'Key Features',
    icon: Zap,
    features: [
      { icon: Brain, title: 'AI Predictions', desc: 'Machine learning-based approval scoring' },
      { icon: Building2, title: 'Bank Comparison', desc: 'Compare rates across multiple banks' },
      { icon: FileText, title: 'Digital Applications', desc: 'Paperless loan submission' },
      { icon: MessageSquare, title: 'AI Chat Support', desc: '24/7 intelligent assistance' }
    ]
  },
  {
    id: 4,
    type: 'tech',
    title: 'Technology Stack',
    icon: Layers,
    categories: [
      { 
        title: 'Frontend', 
        items: ['React 18', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
        color: 'bg-blue-500'
      },
      { 
        title: 'Backend', 
        items: ['Supabase', 'PostgreSQL', 'Edge Functions', 'RLS'],
        color: 'bg-green-500'
      },
      { 
        title: 'Tools', 
        items: ['React Query', 'React Hook Form', 'Zod', 'Recharts'],
        color: 'bg-purple-500'
      }
    ]
  },
  {
    id: 5,
    type: 'feature-detail',
    title: 'Loan Prediction Tool',
    icon: TrendingUp,
    content: {
      description: 'Our AI-powered prediction engine analyzes multiple financial factors to provide instant approval probability.',
      factors: [
        'Income & Employment Status',
        'Credit Score Analysis',
        'Existing Debt Ratio',
        'Loan Amount & Term',
        'Purpose Evaluation'
      ],
      output: 'Approval Score, Interest Rate, Monthly Payment Estimate'
    }
  },
  {
    id: 6,
    type: 'feature-detail',
    title: 'Bank Recommendation Engine',
    icon: Building2,
    content: {
      description: 'Smart matching algorithm that connects users with the most suitable banking partners.',
      criteria: [
        'Interest rate preferences',
        'Account type requirements',
        'Location accessibility',
        'Feature priorities',
        'Credit profile matching'
      ],
      benefit: 'Personalized bank recommendations with match scores'
    }
  },
  {
    id: 7,
    type: 'process',
    title: 'User Journey',
    icon: Users,
    steps: [
      { step: 1, title: 'Sign Up', desc: 'Create account with email verification' },
      { step: 2, title: 'Complete Profile', desc: 'Add personal & financial details' },
      { step: 3, title: 'Upload Documents', desc: 'Secure document submission' },
      { step: 4, title: 'Get Predictions', desc: 'Receive AI-powered insights' },
      { step: 5, title: 'Apply for Loans', desc: 'Submit applications digitally' }
    ]
  },
  {
    id: 8,
    type: 'feature-detail',
    title: 'Loan Application Process',
    icon: FileText,
    content: {
      description: 'Streamlined multi-step application form with intelligent validation and document management.',
      features: [
        'Loan type selection (Personal, Home, Business, Education)',
        'Dynamic form fields based on loan type',
        'Document upload with preview',
        'Application tracking dashboard',
        'Status notifications'
      ]
    }
  },
  {
    id: 9,
    type: 'admin',
    title: 'Admin Dashboard',
    icon: Settings,
    modules: [
      { icon: FileText, title: 'Loan Applications', desc: 'Review & manage applications' },
      { icon: Users, title: 'User Management', desc: 'Handle user accounts & roles' },
      { icon: Building2, title: 'Bank Partners', desc: 'Manage partner banks' },
      { icon: BarChart3, title: 'Analytics', desc: 'View platform statistics' },
      { icon: MessageSquare, title: 'User Queries', desc: 'Handle support requests' },
      { icon: Settings, title: 'Site Settings', desc: 'Configure platform' }
    ]
  },
  {
    id: 10,
    type: 'feature-detail',
    title: 'AI Chat Assistant',
    icon: MessageSquare,
    content: {
      description: 'Intelligent conversational AI that guides users through the loan process and answers queries.',
      capabilities: [
        'Loan eligibility guidance',
        'Interest rate explanations',
        'Document requirements info',
        'Application status help',
        'General financial advice'
      ],
      tech: 'Powered by advanced LLM with Supabase Edge Functions'
    }
  },
  {
    id: 11,
    type: 'security',
    title: 'Security Features',
    icon: Shield,
    features: [
      { icon: Lock, title: 'Row Level Security', desc: 'Database-level access control' },
      { icon: Shield, title: 'Role-Based Access', desc: 'Admin & User role separation' },
      { icon: Database, title: 'Encrypted Storage', desc: 'Secure document handling' },
      { icon: CheckCircle, title: 'Auth Verification', desc: 'Email & session validation' }
    ]
  },
  {
    id: 12,
    type: 'architecture',
    title: 'System Architecture',
    icon: Database,
    layers: [
      { name: 'Presentation Layer', items: ['React Components', 'shadcn/ui', 'Tailwind CSS'], color: 'border-blue-500' },
      { name: 'Application Layer', items: ['React Query', 'React Router', 'State Management'], color: 'border-green-500' },
      { name: 'Backend Layer', items: ['Supabase Auth', 'Edge Functions', 'Real-time'], color: 'border-yellow-500' },
      { name: 'Data Layer', items: ['PostgreSQL', 'RLS Policies', 'Storage Buckets'], color: 'border-red-500' }
    ]
  },
  {
    id: 13,
    type: 'benefits',
    title: 'Why Choose Us?',
    icon: CheckCircle,
    benefits: [
      { title: 'Time Saving', desc: 'Get instant predictions instead of visiting multiple banks', icon: Zap },
      { title: 'Transparency', desc: 'Clear approval criteria and interest rate visibility', icon: CheckCircle },
      { title: 'Convenience', desc: 'Apply from anywhere with digital document upload', icon: Globe },
      { title: 'Smart Guidance', desc: 'AI chatbot provides 24/7 personalized assistance', icon: MessageSquare },
      { title: 'Secure Platform', desc: 'Bank-grade security for all your data', icon: Shield }
    ]
  },
  {
    id: 14,
    type: 'thankyou',
    title: 'Thank You!',
    subtitle: 'Smart Loan Prediction System',
    icon: Brain,
    contact: {
      tagline: 'Empowering Financial Decisions with AI',
      cta: 'Start Your Loan Journey Today'
    }
  }
];

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportToPPT = async () => {
    setIsExporting(true);
    try {
      const pptx = new pptxgen();
      pptx.author = 'Smart Loan Prediction System';
      pptx.title = 'Smart Loan Prediction System Presentation';
      pptx.subject = 'AI-Powered Financial Intelligence Platform';

      // Define colors
      const primaryColor = '3B82F6';
      const textColor = '1F2937';
      const mutedColor = '6B7280';
      const bgColor = 'FFFFFF';

      slides.forEach((slideData) => {
        const pptSlide = pptx.addSlide();
        pptSlide.background = { color: bgColor };

        switch (slideData.type) {
          case 'title':
            pptSlide.addText(slideData.title, {
              x: 0.5, y: 2.5, w: 9, h: 1,
              fontSize: 44, bold: true, color: primaryColor,
              align: 'center'
            });
            pptSlide.addText(slideData.subtitle || '', {
              x: 0.5, y: 3.6, w: 9, h: 0.5,
              fontSize: 24, color: mutedColor,
              align: 'center'
            });
            break;

          case 'overview':
            pptSlide.addText(slideData.title, {
              x: 0.5, y: 0.5, w: 9, h: 0.8,
              fontSize: 36, bold: true, color: textColor
            });
            pptSlide.addText(slideData.content?.description || '', {
              x: 0.5, y: 1.4, w: 9, h: 0.8,
              fontSize: 16, color: mutedColor
            });
            slideData.content?.points.forEach((point, idx) => {
              pptSlide.addText(`✓ ${point}`, {
                x: 0.5, y: 2.4 + idx * 0.5, w: 9, h: 0.4,
                fontSize: 14, color: textColor
              });
            });
            break;

          case 'features':
            pptSlide.addText(slideData.title, {
              x: 0.5, y: 0.5, w: 9, h: 0.8,
              fontSize: 36, bold: true, color: textColor
            });
            slideData.features?.forEach((feature, idx) => {
              const col = idx % 2;
              const row = Math.floor(idx / 2);
              pptSlide.addText(feature.title, {
                x: 0.5 + col * 4.5, y: 1.5 + row * 1.5, w: 4, h: 0.4,
                fontSize: 18, bold: true, color: primaryColor
              });
              pptSlide.addText(feature.desc, {
                x: 0.5 + col * 4.5, y: 1.9 + row * 1.5, w: 4, h: 0.4,
                fontSize: 12, color: mutedColor
              });
            });
            break;

          case 'tech':
            pptSlide.addText(slideData.title, {
              x: 0.5, y: 0.5, w: 9, h: 0.8,
              fontSize: 36, bold: true, color: textColor
            });
            slideData.categories?.forEach((category, idx) => {
              pptSlide.addText(category.title, {
                x: 0.5 + idx * 3, y: 1.5, w: 2.8, h: 0.5,
                fontSize: 18, bold: true, color: primaryColor
              });
              category.items.forEach((item, itemIdx) => {
                pptSlide.addText(`• ${item}`, {
                  x: 0.5 + idx * 3, y: 2.1 + itemIdx * 0.4, w: 2.8, h: 0.35,
                  fontSize: 12, color: textColor
                });
              });
            });
            break;

          case 'feature-detail':
            pptSlide.addText(slideData.title, {
              x: 0.5, y: 0.5, w: 9, h: 0.8,
              fontSize: 36, bold: true, color: textColor
            });
            pptSlide.addText(slideData.content?.description || '', {
              x: 0.5, y: 1.4, w: 9, h: 0.6,
              fontSize: 14, color: mutedColor
            });
            const items = slideData.content?.factors || slideData.content?.criteria || slideData.content?.capabilities || slideData.content?.features || [];
            items.forEach((item, idx) => {
              pptSlide.addText(`✓ ${item}`, {
                x: 0.5, y: 2.2 + idx * 0.45, w: 5, h: 0.4,
                fontSize: 13, color: textColor
              });
            });
            const output = slideData.content?.output || slideData.content?.benefit || slideData.content?.tech;
            if (output) {
              pptSlide.addText('Output:', {
                x: 5.5, y: 2.2, w: 4, h: 0.4,
                fontSize: 14, bold: true, color: primaryColor
              });
              pptSlide.addText(output, {
                x: 5.5, y: 2.7, w: 4, h: 1,
                fontSize: 12, color: textColor
              });
            }
            break;

          case 'process':
            pptSlide.addText(slideData.title, {
              x: 0.5, y: 0.5, w: 9, h: 0.8,
              fontSize: 36, bold: true, color: textColor
            });
            slideData.steps?.forEach((step, idx) => {
              pptSlide.addShape('ellipse', {
                x: 0.7 + idx * 1.8, y: 1.5, w: 0.6, h: 0.6,
                fill: { color: primaryColor }
              });
              pptSlide.addText(String(step.step), {
                x: 0.7 + idx * 1.8, y: 1.55, w: 0.6, h: 0.5,
                fontSize: 16, bold: true, color: 'FFFFFF', align: 'center'
              });
              pptSlide.addText(step.title, {
                x: 0.3 + idx * 1.8, y: 2.2, w: 1.4, h: 0.4,
                fontSize: 11, bold: true, color: textColor, align: 'center'
              });
              pptSlide.addText(step.desc, {
                x: 0.3 + idx * 1.8, y: 2.6, w: 1.4, h: 0.6,
                fontSize: 9, color: mutedColor, align: 'center'
              });
            });
            break;

          case 'admin':
            pptSlide.addText(slideData.title, {
              x: 0.5, y: 0.5, w: 9, h: 0.8,
              fontSize: 36, bold: true, color: textColor
            });
            slideData.modules?.forEach((module, idx) => {
              const col = idx % 3;
              const row = Math.floor(idx / 3);
              pptSlide.addText(module.title, {
                x: 0.5 + col * 3, y: 1.5 + row * 1.2, w: 2.8, h: 0.4,
                fontSize: 14, bold: true, color: primaryColor
              });
              pptSlide.addText(module.desc, {
                x: 0.5 + col * 3, y: 1.9 + row * 1.2, w: 2.8, h: 0.4,
                fontSize: 10, color: mutedColor
              });
            });
            break;

          case 'security':
            pptSlide.addText(slideData.title, {
              x: 0.5, y: 0.5, w: 9, h: 0.8,
              fontSize: 36, bold: true, color: textColor
            });
            slideData.features?.forEach((feature, idx) => {
              const col = idx % 2;
              const row = Math.floor(idx / 2);
              pptSlide.addText(feature.title, {
                x: 0.5 + col * 4.5, y: 1.5 + row * 1.3, w: 4, h: 0.4,
                fontSize: 16, bold: true, color: '22C55E'
              });
              pptSlide.addText(feature.desc, {
                x: 0.5 + col * 4.5, y: 1.9 + row * 1.3, w: 4, h: 0.4,
                fontSize: 12, color: mutedColor
              });
            });
            break;

          case 'architecture':
            pptSlide.addText(slideData.title, {
              x: 0.5, y: 0.5, w: 9, h: 0.8,
              fontSize: 36, bold: true, color: textColor
            });
            const layerColors = ['3B82F6', '22C55E', 'EAB308', 'EF4444'];
            slideData.layers?.forEach((layer, idx) => {
              pptSlide.addText(layer.name, {
                x: 0.5, y: 1.4 + idx * 1.1, w: 3, h: 0.4,
                fontSize: 14, bold: true, color: layerColors[idx]
              });
              pptSlide.addText(layer.items.join(' • '), {
                x: 3.5, y: 1.4 + idx * 1.1, w: 6, h: 0.4,
                fontSize: 12, color: textColor
              });
            });
            break;

          case 'benefits':
            pptSlide.addText(slideData.title, {
              x: 0.5, y: 0.5, w: 9, h: 0.8,
              fontSize: 36, bold: true, color: textColor
            });
            slideData.benefits?.forEach((benefit, idx) => {
              pptSlide.addText(benefit.title, {
                x: 0.5, y: 1.4 + idx * 0.8, w: 2.5, h: 0.4,
                fontSize: 14, bold: true, color: primaryColor
              });
              pptSlide.addText(benefit.desc, {
                x: 3, y: 1.4 + idx * 0.8, w: 6.5, h: 0.4,
                fontSize: 12, color: textColor
              });
            });
            break;

          case 'thankyou':
            pptSlide.addText(slideData.title, {
              x: 0.5, y: 2, w: 9, h: 1,
              fontSize: 54, bold: true, color: textColor,
              align: 'center'
            });
            pptSlide.addText(slideData.subtitle || '', {
              x: 0.5, y: 3.2, w: 9, h: 0.6,
              fontSize: 24, color: primaryColor,
              align: 'center'
            });
            pptSlide.addText(slideData.contact?.tagline || '', {
              x: 0.5, y: 4, w: 9, h: 0.5,
              fontSize: 16, color: mutedColor,
              align: 'center'
            });
            break;

          default:
            pptSlide.addText(slideData.title, {
              x: 0.5, y: 2, w: 9, h: 1,
              fontSize: 36, bold: true, color: textColor,
              align: 'center'
            });
        }
      });

      await pptx.writeFile({ fileName: 'Smart_Loan_Prediction_System.pptx' });
      toast.success('Presentation exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export presentation');
    } finally {
      setIsExporting(false);
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(index);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isAnimating]);

  const slide = slides[currentSlide];
  const SlideIcon = slide.icon;

  const renderSlideContent = () => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center animate-pulse`}>
              <SlideIcon className="w-16 h-16 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-fade-in">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {slide.subtitle}
            </p>
            <div className="flex gap-2 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        );

      case 'overview':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <SlideIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">{slide.title}</h2>
            </div>
            <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {slide.content?.description}
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {slide.content?.points.map((point, index) => (
                <Card 
                  key={index} 
                  className="p-4 border-l-4 border-l-primary bg-card/50 backdrop-blur animate-fade-in hover:scale-105 transition-transform"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium">{point}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <SlideIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">{slide.title}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {slide.features?.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <Card 
                    key={index} 
                    className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FeatureIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'tech':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <SlideIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">{slide.title}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {slide.categories?.map((category, index) => (
                <Card 
                  key={index} 
                  className="p-6 animate-fade-in overflow-hidden relative"
                  style={{ animationDelay: `${0.1 + index * 0.15}s` }}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 ${category.color}`} />
                  <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                  <div className="space-y-2">
                    {category.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${category.color}`} />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'feature-detail':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <SlideIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">{slide.title}</h2>
            </div>
            <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {slide.content?.description}
            </p>
            <Card className="p-6 mt-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4 text-lg">
                    {slide.content?.factors ? 'Analysis Factors' : slide.content?.criteria ? 'Matching Criteria' : slide.content?.capabilities ? 'Capabilities' : 'Features'}
                  </h4>
                  <ul className="space-y-3">
                    {(slide.content?.factors || slide.content?.criteria || slide.content?.capabilities || slide.content?.features)?.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {(slide.content?.output || slide.content?.benefit || slide.content?.tech) && (
                  <div className="flex items-center">
                    <Card className="p-6 bg-primary/5 border-primary/20 w-full">
                      <h4 className="font-semibold mb-2 text-primary">Output</h4>
                      <p className="text-lg">{slide.content?.output || slide.content?.benefit || slide.content?.tech}</p>
                    </Card>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      case 'process':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <SlideIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">{slide.title}</h2>
            </div>
            <div className="relative mt-12">
              <div className="absolute top-8 left-8 right-8 h-1 bg-primary/20 hidden md:block" />
              <div className="grid md:grid-cols-5 gap-4">
                {slide.steps?.map((step, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center text-center animate-fade-in"
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4 relative z-10">
                      {step.step}
                    </div>
                    <h4 className="font-semibold mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <SlideIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">{slide.title}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {slide.modules?.map((module, index) => {
                const ModuleIcon = module.icon;
                return (
                  <Card 
                    key={index} 
                    className="p-5 hover:shadow-md transition-all hover:border-primary/50 animate-fade-in"
                    style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <ModuleIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold">{module.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{module.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <SlideIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">{slide.title}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {slide.features?.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <Card 
                    key={index} 
                    className="p-6 border-2 hover:border-primary/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                        <FeatureIcon className="w-7 h-7 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'architecture':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <SlideIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">{slide.title}</h2>
            </div>
            <div className="space-y-4 mt-8">
              {slide.layers?.map((layer, index) => (
                <Card 
                  key={index} 
                  className={`p-5 border-l-4 ${layer.color} animate-fade-in`}
                  style={{ animationDelay: `${0.1 + index * 0.15}s` }}
                >
                  <h4 className="font-bold mb-3">{layer.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((item, i) => (
                      <span key={i} className="px-3 py-1 bg-muted rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'benefits':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <SlideIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">{slide.title}</h2>
            </div>
            <div className="space-y-4 mt-8">
              {slide.benefits?.map((benefit, index) => {
                const BenefitIcon = benefit.icon;
                return (
                  <Card 
                    key={index} 
                    className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow animate-fade-in"
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BenefitIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{benefit.title}</h4>
                      <p className="text-muted-foreground">{benefit.desc}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'thankyou':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-pulse">
              <SlideIcon className="w-14 h-14 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold animate-fade-in">
              {slide.title}
            </h1>
            <p className="text-2xl text-primary font-medium animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {slide.subtitle}
            </p>
            <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {slide.contact?.tagline}
            </p>
            <Link to="/">
              <Button size="lg" className="mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {slide.contact?.cta}
              </Button>
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToPPT}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export PPT'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto px-4 h-full min-h-[calc(100vh-10rem)]">
          <div 
            key={currentSlide}
            className={`h-full py-8 ${slide.type === 'title' || slide.type === 'thankyou' ? 'flex items-center' : ''}`}
          >
            {renderSlideContent()}
          </div>
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={prevSlide} 
              disabled={currentSlide === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Slide Indicators */}
            <div className="hidden md:flex items-center gap-1.5 overflow-x-auto max-w-md">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-primary w-6' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            <Button 
              onClick={nextSlide} 
              disabled={currentSlide === slides.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Presentation;
