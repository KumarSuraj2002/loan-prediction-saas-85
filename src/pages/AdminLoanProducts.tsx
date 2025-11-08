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
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Plus, Settings } from 'lucide-react';
import { toast } from 'sonner';
import LoanProductQuestionsManager from '@/components/LoanProductQuestionsManager';

interface LoanProduct {
  id: string;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number;
  interest_rate_min: number;
  interest_rate_max: number;
  min_term_months: number;
  max_term_months: number;
  eligibility_criteria?: any;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminLoanProducts = () => {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<LoanProduct>>({});
  const [isQuestionsDialogOpen, setIsQuestionsDialogOpen] = useState(false);
  const [selectedProductForQuestions, setSelectedProductForQuestions] = useState<LoanProduct | null>(null);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching loan products:', error);
      toast.error('Failed to fetch loan products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const saveProduct = async () => {
    try {
      if (selectedProduct) {
        // Update existing product
        const { error } = await supabase
          .from('loan_products')
          .update(editForm)
          .eq('id', selectedProduct.id);

        if (error) throw error;
        toast.success('Loan product updated');
        setIsEditDialogOpen(false);
      } else {
        // Add new product
        const { error } = await supabase
          .from('loan_products')
          .insert([editForm as any]);

        if (error) throw error;
        toast.success('Loan product added');
        setIsAddDialogOpen(false);
      }
      
      fetchProducts();
      setEditForm({});
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving loan product:', error);
      toast.error('Failed to save loan product');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this loan product?')) return;

    try {
      const { error } = await supabase
        .from('loan_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Loan product deleted');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting loan product:', error);
      toast.error('Failed to delete loan product');
    }
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('loan_products')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Loan product ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchProducts();
    } catch (error) {
      console.error('Error updating loan product:', error);
      toast.error('Failed to update loan product');
    }
  };

  const handleArrayInputChange = (field: keyof LoanProduct, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setEditForm({ ...editForm, [field]: arrayValue });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Loan Products</CardTitle>
          <Button onClick={() => {
            setEditForm({
              is_active: true,
              features: [],
              min_amount: 0,
              max_amount: 0,
              interest_rate_min: 0,
              interest_rate_max: 0,
              min_term_months: 12,
              max_term_months: 360
            });
            setSelectedProduct(null);
            setIsAddDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Loan Product
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Amount Range</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Term (Months)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {formatCurrency(product.min_amount)} - {formatCurrency(product.max_amount)}
                  </TableCell>
                  <TableCell>
                    {product.interest_rate_min}% - {product.interest_rate_max}%
                  </TableCell>
                  <TableCell>
                    {product.min_term_months} - {product.max_term_months}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActiveStatus(product.id, product.is_active)}
                      >
                        {product.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProductForQuestions(product);
                          setIsQuestionsDialogOpen(true);
                        }}
                        title="Manage Questions"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setEditForm(product);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProduct(product.id)}
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
          setSelectedProduct(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Edit Loan Product' : 'Add Loan Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Amount ($)</Label>
                <Input
                  type="number"
                  value={editForm.min_amount || ''}
                  onChange={(e) => setEditForm({ ...editForm, min_amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Maximum Amount ($)</Label>
                <Input
                  type="number"
                  value={editForm.max_amount || ''}
                  onChange={(e) => setEditForm({ ...editForm, max_amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Interest Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.interest_rate_min || ''}
                  onChange={(e) => setEditForm({ ...editForm, interest_rate_min: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Maximum Interest Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.interest_rate_max || ''}
                  onChange={(e) => setEditForm({ ...editForm, interest_rate_max: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Term (Months)</Label>
                <Input
                  type="number"
                  value={editForm.min_term_months || ''}
                  onChange={(e) => setEditForm({ ...editForm, min_term_months: parseInt(e.target.value) || 0 })}
                  placeholder="12"
                />
              </div>
              <div>
                <Label>Maximum Term (Months)</Label>
                <Input
                  type="number"
                  value={editForm.max_term_months || ''}
                  onChange={(e) => setEditForm({ ...editForm, max_term_months: parseInt(e.target.value) || 0 })}
                  placeholder="360"
                />
              </div>
            </div>
            <div>
              <Label>Features (comma-separated)</Label>
              <Textarea
                value={editForm.features?.join(', ') || ''}
                onChange={(e) => handleArrayInputChange('features', e.target.value)}
                placeholder="e.g., Quick approval, No collateral required, Fixed interest rates"
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={editForm.is_active || false}
                onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
              />
              <Label>Active Product</Label>
            </div>
            <div className="flex space-x-2">
              <Button onClick={saveProduct}>
                {selectedProduct ? 'Update' : 'Add'} Product
              </Button>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setIsAddDialogOpen(false);
                setEditForm({});
                setSelectedProduct(null);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Questions Manager Dialog */}
      {selectedProductForQuestions && (
        <LoanProductQuestionsManager
          loanProductId={selectedProductForQuestions.id}
          loanProductName={selectedProductForQuestions.name}
          isOpen={isQuestionsDialogOpen}
          onClose={() => {
            setIsQuestionsDialogOpen(false);
            setSelectedProductForQuestions(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminLoanProducts;