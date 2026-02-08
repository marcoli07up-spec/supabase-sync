-- Add instagram handle column to reviews table
ALTER TABLE public.reviews ADD COLUMN instagram_handle text;

-- Add video_url column for video support
ALTER TABLE public.reviews ADD COLUMN video_url text;