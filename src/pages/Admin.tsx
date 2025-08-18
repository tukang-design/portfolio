import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, FileText, Users, BarChart } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access the admin panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={signOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-heading font-bold text-primary">Admin Dashboard</h1>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+1 from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">+5 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Management</CardTitle>
              <CardDescription>Manage your portfolio projects and case studies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/admin/portfolio')}
                variant="outline" 
                className="w-full justify-start"
              >
                Portfolio Management
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Create and manage blog articles and content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/admin/blog')}
                variant="outline" 
                className="w-full justify-start"
              >
                Content Management
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
              <CardDescription>Manage contact inquiries and leads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/admin/leads')}
                variant="outline" 
                className="w-full justify-start"
              >
                Lead Management
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;