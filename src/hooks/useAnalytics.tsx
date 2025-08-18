import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalLeads: number;
  totalBlogs: number;
  totalPortfolios: number;
  recentLeads: Array<{
    id: string;
    name: string;
    service_interest: string;
    created_at: string;
    status: string;
  }>;
  leadsByStatus: Array<{
    status: string;
    count: number;
  }>;
  blogViews: Array<{
    title: string;
    view_count: number;
    slug: string;
  }>;
  monthlyLeads: Array<{
    month: string;
    count: number;
  }>;
}

export const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalLeads: 0,
    totalBlogs: 0,
    totalPortfolios: 0,
    recentLeads: [],
    leadsByStatus: [],
    blogViews: [],
    monthlyLeads: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch total counts
      const [leadsCount, blogsCount, portfoliosCount] = await Promise.all([
        supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('blog_articles').select('*', { count: 'exact', head: true }),
        supabase.from('portfolios').select('*', { count: 'exact', head: true })
      ]);

      // Fetch recent leads
      const { data: recentLeads } = await supabase
        .from('contact_inquiries')
        .select('id, name, service_interest, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch leads by status
      const { data: leadsByStatus } = await supabase
        .from('contact_inquiries')
        .select('status')
        .then(({ data }) => {
          if (!data) return { data: [] };
          const statusCounts = data.reduce((acc: Record<string, number>, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
          }, {});
          return {
            data: Object.entries(statusCounts).map(([status, count]) => ({
              status,
              count: count as number
            }))
          };
        });

      // Fetch blog views
      const { data: blogViews } = await supabase
        .from('blog_articles')
        .select('title, view_count, slug')
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(5);

      // Calculate monthly leads for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: monthlyLeadsData } = await supabase
        .from('contact_inquiries')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString());

      const monthlyLeads = monthlyLeadsData?.reduce((acc: Record<string, number>, lead) => {
        const month = new Date(lead.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {}) || {};

      setData({
        totalLeads: leadsCount.count || 0,
        totalBlogs: blogsCount.count || 0,
        totalPortfolios: portfoliosCount.count || 0,
        recentLeads: recentLeads || [],
        leadsByStatus: leadsByStatus || [],
        blogViews: blogViews || [],
        monthlyLeads: Object.entries(monthlyLeads).map(([month, count]) => ({
          month,
          count: count as number
        })).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      });

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const trackView = async (type: 'blog' | 'portfolio', identifier: string) => {
    try {
      if (type === 'blog') {
        await supabase.rpc('increment_view_count', { article_slug: identifier });
      }
      // Add portfolio view tracking if needed
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  const trackConversion = async (type: string, metadata?: Record<string, any>) => {
    try {
      // This could be expanded to track different types of conversions
      console.log('Conversion tracked:', type, metadata);
    } catch (err) {
      console.error('Error tracking conversion:', err);
    }
  };

  return {
    data,
    loading,
    error,
    refresh: fetchAnalytics,
    trackView,
    trackConversion
  };
};