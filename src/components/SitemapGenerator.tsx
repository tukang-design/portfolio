import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// This component generates and updates the sitemap dynamically
const SitemapGenerator = () => {
  useEffect(() => {
    generateSitemap();
  }, []);

  const generateSitemap = async () => {
    try {
      const baseUrl = window.location.origin;
      const currentDate = new Date().toISOString().split('T')[0];

      // Static pages
      const staticPages = [
        { url: '', priority: '1.0', changefreq: 'weekly' },
        { url: '/blog', priority: '0.9', changefreq: 'daily' },
        { url: '/admin', priority: '0.3', changefreq: 'monthly' },
      ];

      // Fetch blog articles
      const { data: articles } = await supabase
        .from('blog_articles')
        .select('slug, updated_at')
        .eq('status', 'published');

      // Fetch portfolios
      const { data: portfolios } = await supabase
        .from('portfolios')
        .select('slug, updated_at')
        .eq('status', 'published');

      // Build sitemap XML
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Add static pages
      staticPages.forEach(page => {
        sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
      });

      // Add blog articles
      articles?.forEach(article => {
        const lastmod = new Date(article.updated_at).toISOString().split('T')[0];
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });

      sitemap += `
</urlset>`;

      // In a real application, you would save this to a file or serve it dynamically
      // For now, we'll store it in sessionStorage for demo purposes
      sessionStorage.setItem('sitemap', sitemap);
      
      console.log('Sitemap generated successfully');
    } catch (error) {
      console.error('Error generating sitemap:', error);
    }
  };

  // This component doesn't render anything
  return null;
};

export default SitemapGenerator;