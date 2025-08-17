import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Bank {
  id: string;
  name: string;
  logo_text: string;
  rating: number;
  features: string[];
  account_types: string[];
  interest_rates: any;
  locations: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

const AdminBankPartners = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Bank>>({});

  const fetchBanks = async () => {
    try {
      const { data, error } = await supabase
        .from('banks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBanks(data as Bank[] || []);
    } catch (error) {
      console.error('Error fetching banks:', error);
      toast.error('Failed to fetch banks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const saveBank = async () => {
    try {
      if (selectedBank) {
        // Update existing bank
        const { error } = await supabase
          .from('banks')
          .update(editForm)
          .eq('id', selectedBank.id);

        if (error) throw error;
        toast.success('Bank updated');
        setIsEditDialogOpen(false);
      } else {
        // Add new bank
        const { error } = await supabase
          .from('banks')
          .insert([editForm as any]);

        if (error) throw error;
        toast.success('Bank added');
        setIsAddDialogOpen(false);
      }
      
      fetchBanks();
      setEditForm({});
      setSelectedBank(null);
    } catch (error) {
      console.error('Error saving bank:', error);
      toast.error('Failed to save bank');
    }
  };

  const deleteBank = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bank?')) return;

    try {
      const { error } = await supabase
        .from('banks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Bank deleted');
      fetchBanks();
    } catch (error) {
      console.error('Error deleting bank:', error);
      toast.error('Failed to delete bank');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleArrayInputChange = (field: keyof Bank, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setEditForm({ ...editForm, [field]: arrayValue });
  };

  const handleInterestRateChange = (rateType: string, value: string) => {
    const currentRates = editForm.interest_rates || { savings: 0, checking: 0, mortgage: 0, personal: 0 };
    setEditForm({
      ...editForm,
      interest_rates: {
        ...currentRates,
        [rateType]: parseFloat(value) || 0
      }
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bank Partners</CardTitle>
          <Button onClick={() => {
            setEditForm({
              rating: 0,
              features: [],
              account_types: [],
              interest_rates: { savings: 0, checking: 0, mortgage: 0, personal: 0 },
              locations: []
            });
            setSelectedBank(null);
            setIsAddDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bank
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bank Name</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Account Types</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banks.map((bank) => (
                <TableRow key={bank.id}>
                  <TableCell className="font-medium">{bank.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{bank.logo_text}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {renderStars(bank.rating)}
                      <span className="text-sm text-muted-foreground">({bank.rating})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {bank.account_types.slice(0, 2).map((type, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {bank.account_types.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{bank.account_types.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {bank.locations.slice(0, 2).map((location, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {location}
                        </Badge>
                      ))}
                      {bank.locations.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{bank.locations.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBank(bank);
                          setEditForm(bank);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteBank(bank.id)}
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

      {/* Edit/Add Dialog */}
      <Dialog open={isEditDialogOpen || isAddDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        setIsAddDialogOpen(open);
        if (!open) {
          setEditForm({});
          setSelectedBank(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBank ? 'Edit Bank' : 'Add Bank'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bank Name</Label>
                <Input
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Enter bank name"
                />
              </div>
              <div>
                <Label>Logo Text</Label>
                <Input
                  value={editForm.logo_text || ''}
                  onChange={(e) => setEditForm({ ...editForm, logo_text: e.target.value })}
                  placeholder="Enter logo text (e.g., CHASE)"
                />
              </div>
            </div>
            <div>
              <Label>Rating (0-5)</Label>
              <Input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={editForm.rating || ''}
                onChange={(e) => setEditForm({ ...editForm, rating: parseFloat(e.target.value) || 0 })}
                placeholder="Enter rating"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Enter bank description"
                rows={3}
              />
            </div>
            <div>
              <Label>Features (comma-separated)</Label>
              <Textarea
                value={editForm.features?.join(', ') || ''}
                onChange={(e) => handleArrayInputChange('features', e.target.value)}
                placeholder="e.g., Mobile Banking, 24/7 Customer Service, Large ATM Network"
                rows={2}
              />
            </div>
            <div>
              <Label>Account Types (comma-separated)</Label>
              <Input
                value={editForm.account_types?.join(', ') || ''}
                onChange={(e) => handleArrayInputChange('account_types', e.target.value)}
                placeholder="e.g., Checking, Savings, Credit Card, Mortgage"
              />
            </div>
            <div>
              <Label>Locations (comma-separated)</Label>
              <Input
                value={editForm.locations?.join(', ') || ''}
                onChange={(e) => handleArrayInputChange('locations', e.target.value)}
                placeholder="e.g., Urban, Suburban, Rural, Online"
              />
            </div>
            <div>
              <Label>Interest Rates (%)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Savings</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.interest_rates?.savings || ''}
                    onChange={(e) => handleInterestRateChange('savings', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label className="text-sm">Checking</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.interest_rates?.checking || ''}
                    onChange={(e) => handleInterestRateChange('checking', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label className="text-sm">Mortgage</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.interest_rates?.mortgage || ''}
                    onChange={(e) => handleInterestRateChange('mortgage', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label className="text-sm">Personal Loan</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.interest_rates?.personal || ''}
                    onChange={(e) => handleInterestRateChange('personal', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={saveBank}>
                {selectedBank ? 'Update' : 'Add'} Bank
              </Button>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setIsAddDialogOpen(false);
                setEditForm({});
                setSelectedBank(null);
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

export default AdminBankPartners;