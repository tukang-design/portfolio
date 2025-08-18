import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Eye, User, Share2 } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import LazyImage from '@/components/LazyImage';
import EnhancedHeader from '@/components/EnhancedHeader';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import AdminIndicator from '@/components/AdminIndicator';
import SocialShareButtons from '@/components/SocialShareButtons';
import RelatedArticles from '@/components/RelatedArticles';
import { useAnalytics } from '@/hooks/useAnalytics';
import DOMPurify from 'dompurify';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  view_count: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  blog_categories: {
    name: string;
    slug: string;
  } | null;
  article_tags: Array<{ tag: string }>;
}

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { trackView } = useAnalytics();

  useEffect(() => {
    if (slug) {
      fetchArticle();
      incrementViewCount();
      trackView('blog', slug);
    }
  }, [slug, trackView]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select(`
          id,
          title,
          slug,
          content,
          excerpt,
          featured_image,
          published_at,
          view_count,
          meta_title,
          meta_description,
          meta_keywords,
          blog_categories (
            name,
            slug
          ),
          article_tags (
            tag
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116') {
          setNotFound(true);
        }
        throw error;
      }

      setArticle(data);
      
      // Update page meta tags
      if (data) {
        document.title = data.meta_title || data.title;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', data.meta_description || data.excerpt || '');
        }
        
        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && data.meta_keywords) {
          metaKeywords.setAttribute('content', data.meta_keywords);
        }
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      if (!notFound) {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    try {
      await supabase.rpc('increment_view_count', { article_slug: slug });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareArticle = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-4 w-64 mb-8" />
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return <Navigate to="/blog" replace />;
  }

  const currentUrl = `${window.location.origin}/blog/${article.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.featured_image,
    "author": {
      "@type": "Organization",
      "name": "Tukang Design"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Tukang Design",
      "url": window.location.origin
    },
    "datePublished": article.published_at,
    "dateModified": article.published_at,
    "url": currentUrl,
    "keywords": article.article_tags.map(tag => tag.tag).join(", ")
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={article.meta_title || article.title}
        description={article.meta_description || article.excerpt}
        keywords={article.meta_keywords}
        image={article.featured_image}
        url={currentUrl}
        type="article"
        author="Tukang Design"
        publishedTime={article.published_at}
        structuredData={structuredData}
      />
      
      <EnhancedHeader />

      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link 
                to="/blog"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Blog</span>
              </Link>
              <Button variant="outline" onClick={shareArticle} className="flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>

            <div className="space-y-4">
              {article.blog_categories && (
                <Badge variant="secondary" className="text-sm">
                  {article.blog_categories.name}
                </Badge>
              )}
              
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>{article.view_count} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <LazyImage
              src={article.featured_image}
              alt={article.title}
              width={800}
              height={400}
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <main className="container mx-auto px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <div 
              className="content"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(article.content, {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'],
                  ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'class']
                })
              }}
            />
          </article>

          {/* Social Share */}
          <div className="mt-12 pt-8 border-t border-border">
            <SocialShareButtons
              url={currentUrl}
              title={article.title}
              description={article.excerpt}
            />
          </div>

          {/* Tags */}
          {article.article_tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.article_tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag.tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles */}
          <RelatedArticles
            currentArticleId={article.id}
            categorySlug={article.blog_categories?.slug}
            tags={article.article_tags.map(tag => tag.tag)}
          />

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link 
              to="/blog"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to all articles</span>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
      <BackToTop />
      <AdminIndicator />
    </div>
  );
};

export default BlogArticle;