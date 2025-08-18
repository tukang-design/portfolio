-- Create portfolios table
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT NOT NULL,
  services JSONB DEFAULT '[]'::jsonb,
  timeline TEXT,
  client TEXT,
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio_images table
CREATE TABLE public.portfolio_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_main BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_articles table
CREATE TABLE public.blog_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category_id UUID REFERENCES public.blog_categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMP WITH TIME ZONE,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create article_tags table
CREATE TABLE public.article_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.blog_articles(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(article_id, tag)
);

-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for checking admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = is_admin.user_id
    AND role = 'admin'
  );
$$;

-- Create RLS policies for portfolios (public read, admin write)
CREATE POLICY "Portfolios are viewable by everyone" 
ON public.portfolios FOR SELECT 
USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can insert portfolios" 
ON public.portfolios FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update portfolios" 
ON public.portfolios FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete portfolios" 
ON public.portfolios FOR DELETE 
USING (public.is_admin());

-- Create RLS policies for portfolio_images
CREATE POLICY "Portfolio images are viewable by everyone" 
ON public.portfolio_images FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage portfolio images" 
ON public.portfolio_images FOR ALL 
USING (public.is_admin());

-- Create RLS policies for blog_categories (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" 
ON public.blog_categories FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage categories" 
ON public.blog_categories FOR ALL 
USING (public.is_admin());

-- Create RLS policies for blog_articles (public read published, admin all)
CREATE POLICY "Published articles are viewable by everyone" 
ON public.blog_articles FOR SELECT 
USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage articles" 
ON public.blog_articles FOR ALL 
USING (public.is_admin());

-- Create RLS policies for article_tags
CREATE POLICY "Article tags are viewable by everyone" 
ON public.article_tags FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage article tags" 
ON public.article_tags FOR ALL 
USING (public.is_admin());

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage user roles" 
ON public.user_roles FOR ALL 
USING (public.is_admin());

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_articles_updated_at
  BEFORE UPDATE ON public.blog_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('portfolio-images', 'portfolio-images', true),
  ('blog-images', 'blog-images', true);

-- Create storage policies for portfolio images
CREATE POLICY "Portfolio images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Admins can upload portfolio images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'portfolio-images' AND public.is_admin());

CREATE POLICY "Admins can update portfolio images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'portfolio-images' AND public.is_admin());

CREATE POLICY "Admins can delete portfolio images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'portfolio-images' AND public.is_admin());

-- Create storage policies for blog images
CREATE POLICY "Blog images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'blog-images' AND public.is_admin());

CREATE POLICY "Admins can update blog images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'blog-images' AND public.is_admin());

CREATE POLICY "Admins can delete blog images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'blog-images' AND public.is_admin());

-- Create indexes for better performance
CREATE INDEX idx_portfolios_status ON public.portfolios(status);
CREATE INDEX idx_portfolios_slug ON public.portfolios(slug);
CREATE INDEX idx_portfolio_images_portfolio_id ON public.portfolio_images(portfolio_id);
CREATE INDEX idx_blog_articles_status ON public.blog_articles(status);
CREATE INDEX idx_blog_articles_slug ON public.blog_articles(slug);
CREATE INDEX idx_blog_articles_category ON public.blog_articles(category_id);
CREATE INDEX idx_article_tags_article_id ON public.article_tags(article_id);
CREATE INDEX idx_article_tags_tag ON public.article_tags(tag);

-- Insert some default categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
  ('Design Tips', 'design-tips', 'Articles about design best practices and tips'),
  ('Case Studies', 'case-studies', 'Detailed case studies of our projects'),
  ('Industry News', 'industry-news', 'Latest news and trends in design industry'),
  ('Tutorials', 'tutorials', 'Step-by-step tutorials and guides');