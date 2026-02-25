
import { useRef, useEffect, useState } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "a6da8df8-3290-4f3e-b33b-b6cc90d79d94",
    name: "Michael Chen",
    role: "First-time Homebuyer",
    company: "",
    avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=faces",
    content: "As someone new to mortgages, the bank recommendation system saved me countless hours of research and helped me find the perfect lender.",
    rating: 5,
  },
  {
    id: "f93b85d2-2390-43be-84ec-b05c1bf9d8c3",
    name: "Priya Patel",
    role: "Financial Analyst",
    company: "Global Investments",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=faces",
    content: "The accuracy of the loan prediction algorithm is impressive. I recommend this tool to all my clients looking for financing options.",
    rating: 5,
  },
  {
    id: "509a746d-3865-4349-8b51-ba65c58a2958",
    name: "James Wilson",
    role: "Entrepreneur",
    company: "Tech Innovations",
    avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=faces",
    content: "The personalized bank matching feature connected me with a lender that perfectly understood my startup's unique financial needs.",
    rating: 4,
  },
  {
    id: "2e6dc022-d612-4429-8a52-012bde8e3692",
    name: "Olivia Martinez",
    role: "Real Estate Agent",
    company: "Premier Properties",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=faces",
    content: "I now refer all my clients to this platform. The financial insights have helped numerous families secure their dream homes.",
    rating: 5,
  },
  {
    id: "cd1976f6-53ba-4639-a775-151bb8b7fdd3",
    name: "Sarah Johnson",
    role: "Small Business Owner",
    company: "Bright Ideas Co.",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=faces",
    content: "This platform helped me secure a business loan with favorable terms. The loan prediction tool was spot-on with its assessment!",
    rating: 5,
  },
];

const Testimonials = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials(FALLBACK_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);
  
  useEffect(() => {
    const speed = 1; // pixels per millisecond - adjust for faster/slower animation
    let animationFrameId: number;
    let startTimestamp: number | null = null;
    let previousTimestamp = 0;
    
    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - (previousTimestamp || timestamp);
      previousTimestamp = timestamp;
      
      if (!carouselRef.current) return;
      
      const container = carouselRef.current.querySelector('[data-embla-container="true"]');
      if (!container) return;
      
      // Move the carousel to the left
      container.scrollLeft += speed * elapsed;
      
      // Check if we need to reset for infinite loop
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth * 1.5) {
        // When approaching the end, jump back to start more smoothly
        container.scrollLeft = 0;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start the animation
    animationFrameId = requestAnimationFrame(animate);
    
    // Clean up the animation on component unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
  
  if (loading) {
    return (
      <section className="py-16 bg-background overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-[800px]">
              Loading testimonials...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-background overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-[800px]">
              No testimonials available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="responsive-section-padding bg-background overflow-hidden">
      <div className="responsive-container">
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12">
          <h2 className="responsive-text-3xl font-bold tracking-tight">What Our Users Say</h2>
          <p className="mt-3 sm:mt-4 responsive-text-xl text-muted-foreground max-w-[800px]">
            Discover how our platform has helped people make smarter financial decisions.
          </p>
        </div>
        
        <div ref={carouselRef} className="w-full overflow-hidden">
          <Carousel className="w-full" opts={{ loop: true, align: "start", dragFree: true }}>
            <CarouselContent className="py-2 sm:py-4">
              {/* Duplicate testimonials at the beginning to create seamless loop */}
              {testimonials.map((testimonial) => (
                <CarouselItem key={`start-${testimonial.id}`} className="basis-full sm:basis-1/2 lg:basis-1/3 pl-3 sm:pl-4">
                  <Card className="border bg-card h-full">
                    <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                      <div className="flex items-start mb-3 sm:mb-4">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-3 sm:mr-4 flex-shrink-0">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback className="text-xs sm:text-sm">{testimonial.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">{testimonial.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {testimonial.role}
                            {testimonial.company && ` at ${testimonial.company}`}
                          </p>
                          <div className="flex mt-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <blockquote className="text-muted-foreground flex-1 italic text-sm sm:text-base leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
              
              {/* Original testimonials */}
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="basis-full sm:basis-1/2 lg:basis-1/3 pl-3 sm:pl-4">
                  <Card className="border bg-card h-full">
                    <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                      <div className="flex items-start mb-3 sm:mb-4">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-3 sm:mr-4 flex-shrink-0">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback className="text-xs sm:text-sm">{testimonial.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">{testimonial.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {testimonial.role}
                            {testimonial.company && ` at ${testimonial.company}`}
                          </p>
                        </div>
                      </div>
                      <blockquote className="text-muted-foreground flex-1 italic text-sm sm:text-base leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
              
              {/* Duplicate testimonials at the end to create seamless loop */}
              {testimonials.map((testimonial) => (
                <CarouselItem key={`end-${testimonial.id}`} className="basis-full sm:basis-1/2 lg:basis-1/3 pl-3 sm:pl-4">
                  <Card className="border bg-card h-full">
                    <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                      <div className="flex items-start mb-3 sm:mb-4">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-3 sm:mr-4 flex-shrink-0">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback className="text-xs sm:text-sm">{testimonial.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">{testimonial.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {testimonial.role}
                            {testimonial.company && ` at ${testimonial.company}`}
                          </p>
                        </div>
                      </div>
                      <blockquote className="text-muted-foreground flex-1 italic text-sm sm:text-base leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
