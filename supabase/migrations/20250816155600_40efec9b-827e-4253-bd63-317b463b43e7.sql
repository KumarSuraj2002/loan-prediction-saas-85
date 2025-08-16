-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Team members are publicly readable" 
ON public.team_members 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify team members" 
ON public.team_members 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial team members data
INSERT INTO public.team_members (name, position, bio, avatar, display_order) VALUES
('Sarah Johnson', 'CEO & Founder', 'With over 15 years in fintech, Sarah founded FinanceBuddy with a vision to make financial services accessible to everyone.', 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=faces', 1),
('Michael Chen', 'CTO', 'Michael leads our technology team, bringing expertise in AI and machine learning from his previous roles at major tech companies.', 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=faces', 2),
('Priya Patel', 'Head of Data Science', 'Priya oversees our prediction algorithms and ensures our recommendations are accurate and personalized for each user.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=faces', 3),
('David Rodriguez', 'Finance Director', 'David brings his banking industry experience to ensure our financial advice is sound and complies with regulations.', 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=150&h=150&fit=crop&crop=faces', 4),
('Amara Wilson', 'Customer Success Lead', 'Amara ensures our customers have the best experience and get the most value from our platform.', 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=faces', 5),
('James Lee', 'Marketing Director', 'James crafts our brand message and leads initiatives to help more people discover our financial tools.', 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=faces', 6);