import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface LoanApplication {
  id: string;
  applicant_name: string;
  email: string;
  phone?: string;
  loan_type: string;
  loan_amount: number;
  monthly_income: number;
  credit_score?: number;
  employment_status?: string;
  application_status: string;
  application_data?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface AdminLoanApplicationsProps {
  status?: string;
}

const AdminLoanApplications = ({ status }: AdminLoanApplicationsProps) => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<LoanApplication>>({});
  const [statusUpdateReason, setStatusUpdateReason] = useState('');

  const fetchApplications = async () => {
    try {
      let query = supabase
        .from('loan_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('application_status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [status]);

  const updateApplicationStatus = async (id: string, newStatus: string, reason?: string) => {
    try {
      const application = applications.find(app => app.id === id);
      if (!application) return;

      const { error } = await supabase
        .from('loan_applications')
        .update({ application_status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Create notification for the user if they have a user_id
      if ((application as any).user_id) {
        const statusMessages: Record<string, { title: string; type: string }> = {
          approved: { title: 'Application Approved', type: 'success' },
          rejected: { title: 'Application Rejected', type: 'error' },
          under_review: { title: 'Application Under Review', type: 'info' },
        };

        const notification = statusMessages[newStatus];
        if (notification) {
          await supabase.from('notifications').insert({
            user_id: (application as any).user_id,
            title: notification.title,
            message: reason || `Your ${application.loan_type} application status has been updated to ${newStatus}.`,
            type: notification.type,
            related_entity_type: 'loan_application',
            related_entity_id: application.id,
          });
        }
      }
      
      toast.success('Application status updated');
      setIsViewDialogOpen(false);
      setStatusUpdateReason('');
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const updateApplication = async () => {
    if (!selectedApplication) return;

    try {
      const { error } = await supabase
        .from('loan_applications')
        .update(editForm)
        .eq('id', selectedApplication.id);

      if (error) throw error;
      
      toast.success('Application updated');
      setIsEditDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const { error } = await supabase
        .from('loan_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Application deleted');
      fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'under_review': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'pending': return 'New Applications';
      case 'approved': return 'Approved Applications';
      case 'rejected': return 'Rejected Applications';
      case 'under_review': return 'Under Review Applications';
      default: return 'All Application Records';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Applicant</TableHead>
                <TableHead className="min-w-[120px]">Loan Type</TableHead>
                <TableHead className="min-w-[100px]">Amount</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead className="min-w-[100px]">Applied</TableHead>
                <TableHead className="min-w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{app.applicant_name}</div>
                      <div className="text-sm text-muted-foreground">{app.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{app.loan_type}</TableCell>
                  <TableCell>₹{app.loan_amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(app.application_status)}>
                      {app.application_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-nowrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(app);
                          setIsViewDialogOpen(true);
                        }}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(app);
                          setEditForm(app);
                          setIsEditDialogOpen(true);
                        }}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteApplication(app.id)}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4 p-4 sm:p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Applicant Name</Label>
                  <p className="text-sm">{selectedApplication.applicant_name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedApplication.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">{selectedApplication.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label>Loan Type</Label>
                  <p className="text-sm">{selectedApplication.loan_type}</p>
                </div>
                <div>
                  <Label>Loan Amount</Label>
                  <p className="text-sm">₹{selectedApplication.loan_amount.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Monthly Income</Label>
                  <p className="text-sm">₹{selectedApplication.monthly_income.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Credit Score</Label>
                  <p className="text-sm">{selectedApplication.credit_score || 'N/A'}</p>
                </div>
                <div>
                  <Label>Employment Status</Label>
                  <p className="text-sm">{selectedApplication.employment_status || 'N/A'}</p>
                </div>
              </div>
              {selectedApplication.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm">{selectedApplication.notes}</p>
                </div>
              )}
              <div>
                <Label>Reason for Status Update (Optional)</Label>
                <Textarea
                  value={statusUpdateReason}
                  onChange={(e) => setStatusUpdateReason(e.target.value)}
                  placeholder="Provide a reason for the status update that will be sent to the applicant..."
                  className="mt-2"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => updateApplicationStatus(selectedApplication.id, 'approved', statusUpdateReason)} className="w-full sm:w-auto">
                  Approve
                </Button>
                <Button variant="destructive" onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', statusUpdateReason)} className="w-full sm:w-auto">
                  Reject
                </Button>
                <Button variant="outline" onClick={() => updateApplicationStatus(selectedApplication.id, 'under_review', statusUpdateReason)} className="w-full sm:w-auto">
                  Under Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4 sm:p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Application Status</Label>
                <Select
                  value={editForm.application_status}
                  onValueChange={(value) => setEditForm({ ...editForm, application_status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={editForm.notes || ''}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Add notes about this application..."
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={updateApplication} className="w-full sm:w-auto">Update</Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLoanApplications;