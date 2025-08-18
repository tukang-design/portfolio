import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Search, Mail, Phone, Calendar, DollarSign, Clock, User, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service_interest?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  status: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

const LeadManagement = () => {
  const { user, isAdmin, loading } = useAuth();
  const [leads, setLeads] = useState<ContactInquiry[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<ContactInquiry[]>([]);
  const [selectedLead, setSelectedLead] = useState<ContactInquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (isAdmin) {
      fetchLeads();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(
        lead =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.service_interest?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev =>
        prev.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );

      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new':
        return 'default';
      case 'contacted':
        return 'secondary';
      case 'qualified':
        return 'outline';
      case 'closed':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'text-blue-600';
      case 'contacted':
        return 'text-yellow-600';
      case 'qualified':
        return 'text-green-600';
      case 'closed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
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
            <CardTitle className="text-center text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-muted-foreground">Manage contact inquiries and leads</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Leads</p>
                <p className="text-2xl font-bold">
                  {leads.filter(lead => lead.status === 'new').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">
                  {leads.filter(lead => ['contacted', 'qualified'].includes(lead.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold">
                  {leads.filter(lead => lead.status === 'closed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads by name, email, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Inquiries ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No leads found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          {lead.budget && (
                            <p className="text-sm text-muted-foreground">Budget: {lead.budget}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3" />
                            <span className="text-sm">{lead.email}</span>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-3 h-3" />
                              <span className="text-sm">{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{lead.service_interest}</p>
                          {lead.timeline && (
                            <p className="text-xs text-muted-foreground">Timeline: {lead.timeline}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(lead.status)}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span className="text-sm">
                            {format(new Date(lead.created_at), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedLead(lead)}
                              >
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Lead Details</DialogTitle>
                              </DialogHeader>
                              {selectedLead && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Contact Information</h4>
                                      <div className="space-y-2">
                                        <p><strong>Name:</strong> {selectedLead.name}</p>
                                        <p><strong>Email:</strong> {selectedLead.email}</p>
                                        {selectedLead.phone && (
                                          <p><strong>Phone:</strong> {selectedLead.phone}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Project Details</h4>
                                      <div className="space-y-2">
                                        <p><strong>Service:</strong> {selectedLead.service_interest}</p>
                                        {selectedLead.budget && (
                                          <p><strong>Budget:</strong> {selectedLead.budget}</p>
                                        )}
                                        {selectedLead.timeline && (
                                          <p><strong>Timeline:</strong> {selectedLead.timeline}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {selectedLead.message && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Message</h4>
                                      <p className="text-sm bg-muted p-3 rounded-lg">
                                        {selectedLead.message}
                                      </p>
                                    </div>
                                  )}

                                  <div>
                                    <h4 className="font-semibold mb-2">Status Management</h4>
                                    <div className="flex items-center space-x-4">
                                      <span className="text-sm">Current Status:</span>
                                      <Badge variant={getStatusBadgeVariant(selectedLead.status)}>
                                        {selectedLead.status}
                                      </Badge>
                                      <Select
                                        value={selectedLead.status}
                                        onValueChange={(newStatus) => updateLeadStatus(selectedLead.id, newStatus)}
                                      >
                                        <SelectTrigger className="w-[150px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="new">New</SelectItem>
                                          <SelectItem value="contacted">Contacted</SelectItem>
                                          <SelectItem value="qualified">Qualified</SelectItem>
                                          <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div className="text-xs text-muted-foreground pt-4 border-t">
                                    <p>Created: {format(new Date(selectedLead.created_at), 'PPpp')}</p>
                                    <p>Updated: {format(new Date(selectedLead.updated_at), 'PPpp')}</p>
                                    <p>Source: {selectedLead.source}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadManagement;