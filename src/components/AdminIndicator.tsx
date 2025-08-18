import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Settings, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminIndicator = () => {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg p-4 shadow-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Settings className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Admin Mode</span>
      </div>
      <div className="flex space-x-2">
        <Button size="sm" variant="outline" asChild>
          <Link to="/admin">
            <Edit className="h-3 w-3 mr-1" />
            Admin Panel
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link to="/admin/blog">
            Blog CMS
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link to="/admin/portfolio">
            Portfolio CMS
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminIndicator;