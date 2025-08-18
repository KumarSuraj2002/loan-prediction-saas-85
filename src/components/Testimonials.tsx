
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
    <section className="py-16 bg-background overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-[800px]">
            Discover how our platform has helped people make smarter financial decisions.
          </p>
        </div>
        
        <div ref={carouselRef} className="w-full overflow-hidden">
          <Carousel className="w-full" opts={{ loop: true, align: "start", dragFree: true }}>
            <CarouselContent className="py-4">
              {/* Duplicate testimonials at the beginning to create seamless loop */}
              {testimonials.map((testimonial) => (
                <CarouselItem key={`start-${testimonial.id}`} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <Card className="border bg-card h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start mb-4">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
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
                      <blockquote className="text-muted-foreground flex-1 italic">
                        "{testimonial.content}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
              
              {/* Original testimonials */}
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <Card className="border bg-card h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start mb-4">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                            {testimonial.company && ` at ${testimonial.company}`}
                          </p>
                        </div>
                      </div>
                      <blockquote className="text-muted-foreground flex-1 italic">
                        "{testimonial.content}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
              
              {/* Duplicate testimonials at the end to create seamless loop */}
              {testimonials.map((testimonial) => (
                <CarouselItem key={`end-${testimonial.id}`} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <Card className="border bg-card h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start mb-4">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                            {testimonial.company && ` at ${testimonial.company}`}
                          </p>
                        </div>
                      </div>
                      <blockquote className="text-muted-foreground flex-1 italic">
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
