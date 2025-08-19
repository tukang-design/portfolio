import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";

// Get base path from environment for GitHub Pages
const getBasePath = () => {
  // Runtime detection for GitHub Pages
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    console.log('[App] GitHub Pages detected, using /portfolio base path');
    return '/portfolio';
  }
  // Build time detection - matches vite.config.ts logic exactly
  const basePath = import.meta.env.PROD && !import.meta.env.VITE_CUSTOM_DOMAIN ? '/portfolio' : '';
  console.log('[App] Base path resolved to:', basePath);
  console.log('[App] Environment:', {
    PROD: import.meta.env.PROD,
    VITE_CUSTOM_DOMAIN: import.meta.env.VITE_CUSTOM_DOMAIN,
    NODE_ENV: import.meta.env.NODE_ENV
  });
  return basePath;
};
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogManagement from "./pages/BlogManagement";
import BlogNew from "./pages/BlogNew";
import BlogEdit from "./pages/BlogEdit";
import BlogArticle from "./pages/BlogArticle";
import PortfolioManagement from "./pages/PortfolioManagement";
import LeadManagement from "./pages/LeadManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  console.log('[App] Component rendering started');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename={getBasePath()}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/portfolio" element={<PortfolioManagement />} />
                <Route path="/admin/blog" element={<BlogManagement />} />
                <Route path="/admin/blog/new" element={<BlogNew />} />
                <Route path="/admin/blog/:id/edit" element={<BlogEdit />} />
                <Route path="/admin/leads" element={<LeadManagement />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
