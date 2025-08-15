-- Enable real-time updates for site_settings table
ALTER TABLE public.site_settings REPLICA IDENTITY FULL;

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;