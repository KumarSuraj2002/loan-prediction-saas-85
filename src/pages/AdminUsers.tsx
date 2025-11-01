import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Trash2, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  employment_status: string | null;
  employer_name: string | null;
  occupation: string | null;
  monthly_income: number | null;
  date_of_birth: string | null;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
  email?: string;
  pan_card_url?: string | null;
  aadhar_card_url?: string | null;
  income_certificate_url?: string | null;
  address_proof_url?: string | null;
  bank_statement_url?: string | null;
  pan_number?: string | null;
  aadhar_number?: string | null;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  const fetchUsers = async () => {
    try {
      console.log("👥 Fetching user profiles from Admin Users page...");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("❌ Error fetching profiles:", error);
        throw error;
      }
      
      console.log(`✅ Found ${data?.length || 0} user profiles:`, data);
      
      setUsers(data || []);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const saveUser = async () => {
    try {
      if (selectedUser) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: editForm.full_name,
            phone: editForm.phone,
            address: editForm.address,
            city: editForm.city,
            state: editForm.state,
            postal_code: editForm.postal_code,
            employment_status: editForm.employment_status,
            employer_name: editForm.employer_name,
            occupation: editForm.occupation,
          })
          .eq('id', selectedUser.id);

        if (error) throw error;
        toast.success('User profile updated');
        setIsEditDialogOpen(false);
      }
      
      fetchUsers();
      setEditForm({});
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user profile?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('User profile deleted');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const viewDocument = async (docUrl: string) => {
    // Extract file path from URL (everything after /user-documents/)
    const filePath = docUrl.split('/user-documents/')[1]?.split('?')[0];
    
    if (!filePath) {
      toast.error("Invalid document URL");
      return;
    }
    
    const { data, error } = await supabase.storage
      .from('user-documents')
      .createSignedUrl(filePath, 60);
    
    if (error) {
      console.error("Error creating signed URL:", error);
      toast.error("Failed to load document");
      return;
    }
    
    if (data?.signedUrl) {
      // Construct full URL if signedUrl is relative
      const fullSignedUrl = data.signedUrl.startsWith('http') 
        ? data.signedUrl 
        : `https://qrivpumpvxkroiwidulq.supabase.co/storage/v1${data.signedUrl}`;
      window.open(fullSignedUrl, '_blank');
    }
  };

  const downloadDocument = async (docUrl: string, label: string) => {
    // Extract file path from URL (everything after /user-documents/)
    const filePath = docUrl.split('/user-documents/')[1]?.split('?')[0];
    
    if (!filePath) {
      toast.error("Invalid document URL");
      return;
    }
    
    const { data, error } = await supabase.storage
      .from('user-documents')
      .createSignedUrl(filePath, 60);
    
    if (error) {
      console.error("Error creating signed URL:", error);
      toast.error("Failed to download document");
      return;
    }
    
    if (data?.signedUrl) {
      // Construct full URL if signedUrl is relative
      const fullSignedUrl = data.signedUrl.startsWith('http') 
        ? data.signedUrl 
        : `https://qrivpumpvxkroiwidulq.supabase.co/storage/v1${data.signedUrl}`;
      const link = document.createElement('a');
      link.href = fullSignedUrl;
      link.download = `${label}.pdf`;
      link.click();
    }
  };

  const getCompletionBadge = (completed: boolean) => {
    return completed ? (
      <Badge className="bg-green-500">Complete</Badge>
    ) : (
      <Badge className="bg-yellow-500">Incomplete</Badge>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Profiles</CardTitle>
          <Button onClick={fetchUsers} variant="outline" size="sm">
            Refresh Data
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>Profile Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || 'User'} />
                      <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>{user.city || 'N/A'}</TableCell>
                  <TableCell>{user.employment_status || 'N/A'}</TableCell>
                  <TableCell>{getCompletionBadge(user.profile_completed)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setEditForm(user);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.avatar_url || undefined} alt={selectedUser.full_name || 'User'} />
                  <AvatarFallback className="text-2xl">{selectedUser.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.full_name || 'N/A'}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  {getCompletionBadge(selectedUser.profile_completed)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <p className="text-sm">{selectedUser.date_of_birth ? new Date(selectedUser.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              <div>
                <Label>Address</Label>
                <p className="text-sm">{selectedUser.address || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>City</Label>
                  <p className="text-sm">{selectedUser.city || 'N/A'}</p>
                </div>
                <div>
                  <Label>State</Label>
                  <p className="text-sm">{selectedUser.state || 'N/A'}</p>
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <p className="text-sm">{selectedUser.postal_code || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Employment Status</Label>
                  <p className="text-sm">{selectedUser.employment_status || 'N/A'}</p>
                </div>
                <div>
                  <Label>Occupation</Label>
                  <p className="text-sm">{selectedUser.occupation || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Employer</Label>
                  <p className="text-sm">{selectedUser.employer_name || 'N/A'}</p>
                </div>
                <div>
                  <Label>Monthly Income</Label>
                  <p className="text-sm">{selectedUser.monthly_income ? `₹${selectedUser.monthly_income.toLocaleString()}` : 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>PAN Number</Label>
                  <p className="text-sm">{selectedUser.pan_number || 'N/A'}</p>
                </div>
                <div>
                  <Label>Aadhar Number</Label>
                  <p className="text-sm">{selectedUser.aadhar_number || 'N/A'}</p>
                </div>
              </div>

              {/* Documents Section */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold">Uploaded Documents</h4>
                {[
                  { key: 'pan_card_url', label: 'PAN Card' },
                  { key: 'aadhar_card_url', label: 'Aadhar Card' },
                  { key: 'income_certificate_url', label: 'Income Certificate' },
                  { key: 'address_proof_url', label: 'Address Proof' },
                  { key: 'bank_statement_url', label: 'Bank Statement' }
                ].map(({ key, label }) => {
                  const docUrl = selectedUser[key as keyof UserProfile];
                  return (
                    <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                      {docUrl ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDocument(docUrl as string)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadDocument(docUrl as string, label)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="outline">Not uploaded</Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label>Registered</Label>
                  <p className="text-sm">{new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p className="text-sm">{new Date(selectedUser.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditForm({});
          setSelectedUser(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={editForm.full_name || ''}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label>Email (Read-only)</Label>
                <Input
                  value={editForm.email || ''}
                  disabled
                />
              </div>
            </div>

            <div>
              <Label>Address</Label>
              <Input
                value={editForm.address || ''}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  value={editForm.city || ''}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={editForm.state || ''}
                  onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                  placeholder="State"
                />
              </div>
              <div>
                <Label>Postal Code</Label>
                <Input
                  value={editForm.postal_code || ''}
                  onChange={(e) => setEditForm({ ...editForm, postal_code: e.target.value })}
                  placeholder="Postal code"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employment Status</Label>
                <Select
                  value={editForm.employment_status || undefined}
                  onValueChange={(value) => setEditForm({ ...editForm, employment_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Occupation</Label>
                <Input
                  value={editForm.occupation || ''}
                  onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                  placeholder="Occupation"
                />
              </div>
            </div>

            <div>
              <Label>Employer Name</Label>
              <Input
                value={editForm.employer_name || ''}
                onChange={(e) => setEditForm({ ...editForm, employer_name: e.target.value })}
                placeholder="Employer name"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={saveUser}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setEditForm({});
                setSelectedUser(null);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
