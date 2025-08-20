import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";

// Get base path from environment for GitHub Pages
const getBasePath = () => {
  // For development, always use root path
  if (import.meta.env.DEV) {
    return '';
  }
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
    NODE_ENV: import.meta.env.NODE_ENV,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'SSR'
  });
  return basePath;
};

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React App Test</h1>
      <p>If you can see this, React is working!</p>
    </div>
  );
};

export default App;
