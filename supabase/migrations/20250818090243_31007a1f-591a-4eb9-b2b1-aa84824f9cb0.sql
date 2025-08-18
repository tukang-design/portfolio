-- Create function to increment article view count
CREATE OR REPLACE FUNCTION public.increment_view_count(article_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_articles 
  SET view_count = view_count + 1 
  WHERE slug = article_slug AND status = 'published';
END;
$$;