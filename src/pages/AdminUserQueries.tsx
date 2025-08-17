import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, MessageSquare, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserQuery {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  query_type: string;
  status: string;
  admin_response?: string;
  created_at: string;
  updated_at: string;
}

const AdminUserQueries = () => {
  const [queries, setQueries] = useState<UserQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<UserQuery | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [response, setResponse] = useState('');

  const fetchQueries = async () => {
    try {
      const { data, error } = await supabase
        .from('user_queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQueries(data || []);
    } catch (error) {
      console.error('Error fetching queries:', error);
      toast.error('Failed to fetch queries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const updateQueryStatus = async (id: string, status: string, adminResponse?: string) => {
    try {
      const updateData: any = { status };
      if (adminResponse !== undefined) {
        updateData.admin_response = adminResponse;
      }

      const { error } = await supabase
        .from('user_queries')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Query updated');
      fetchQueries();
    } catch (error) {
      console.error('Error updating query:', error);
      toast.error('Failed to update query');
    }
  };

  const submitResponse = async () => {
    if (!selectedQuery) return;

    await updateQueryStatus(selectedQuery.id, 'resolved', response);
    setIsResponseDialogOpen(false);
    setResponse('');
    setSelectedQuery(null);
  };

  const deleteQuery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this query?')) return;

    try {
      const { error } = await supabase
        .from('user_queries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Query deleted');
      fetchQueries();
    } catch (error) {
      console.error('Error deleting query:', error);
      toast.error('Failed to delete query');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{query.name}</div>
                      <div className="text-sm text-muted-foreground">{query.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{query.subject}</TableCell>
                  <TableCell>{query.query_type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(query.status)}>
                      {query.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(query.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedQuery(query);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedQuery(query);
                          setResponse(query.admin_response || '');
                          setIsResponseDialogOpen(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteQuery(query.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Query Details</DialogTitle>
          </DialogHeader>
          {selectedQuery && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm">{selectedQuery.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedQuery.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">{selectedQuery.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="text-sm">{selectedQuery.query_type}</p>
                </div>
              </div>
              <div>
                <Label>Subject</Label>
                <p className="text-sm">{selectedQuery.subject}</p>
              </div>
              <div>
                <Label>Message</Label>
                <p className="text-sm whitespace-pre-wrap">{selectedQuery.message}</p>
              </div>
              {selectedQuery.admin_response && (
                <div>
                  <Label>Admin Response</Label>
                  <p className="text-sm whitespace-pre-wrap">{selectedQuery.admin_response}</p>
                </div>
              )}
              <div className="flex space-x-2">
                <Button onClick={() => updateQueryStatus(selectedQuery.id, 'in_progress')}>
                  Mark In Progress
                </Button>
                <Button onClick={() => updateQueryStatus(selectedQuery.id, 'resolved')}>
                  Mark Resolved
                </Button>
                <Button variant="outline" onClick={() => updateQueryStatus(selectedQuery.id, 'closed')}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Query</DialogTitle>
          </DialogHeader>
          {selectedQuery && (
            <div className="space-y-4">
              <div>
                <Label>Query from {selectedQuery.name}</Label>
                <p className="text-sm text-muted-foreground">{selectedQuery.subject}</p>
              </div>
              <div>
                <Label>Admin Response</Label>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Enter your response to this query..."
                  rows={5}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={submitResponse}>Send Response</Button>
                <Button variant="outline" onClick={() => {
                  setIsResponseDialogOpen(false);
                  setResponse('');
                  setSelectedQuery(null);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserQueries;