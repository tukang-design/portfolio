import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEOHead 
        title="Page Not Found - Tukang Design"
        description="The page you're looking for doesn't exist. Return to our homepage or explore our portfolio and services."
      />
      
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          {/* Large 404 */}
          <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
          
          {/* Main heading */}
          <h1 className="text-2xl font-bold mb-4 text-foreground">
            Page Not Found
          </h1>
          
          {/* Description */}
          <p className="text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          {/* Action buttons */}
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/blog">
                <Search className="h-4 w-4 mr-2" />
                Browse Blog
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          {/* Help text */}
          <p className="text-sm text-muted-foreground mt-8">
            Need help? <Link to="/#contact" className="text-primary hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFound;
