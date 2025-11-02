import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Newspaper } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PressRelease {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  location: string;
  featured_image: string;
  press_contact_name: string;
  press_contact_email: string;
  press_contact_phone: string;
  is_published: boolean;
  publish_date: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

const AdminPress = () => {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPress, setEditingPress] = useState<PressRelease | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    location: '',
    featured_image: '',
    press_contact_name: '',
    press_contact_email: '',
    press_contact_phone: '',
    is_published: false,
    publish_date: '',
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchPressReleases();

    // Set up real-time subscription
    const channel = supabase
      .channel('admin-press-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'press_releases'
        },
        () => {
          fetchPressReleases();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPressReleases = async () => {
    try {
      const { data, error } = await supabase
        .from('press_releases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPressReleases(data || []);
    } catch (error) {
      toast.error('Failed to fetch press releases');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const pressData = {
      ...formData,
      publish_date: formData.publish_date || null,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    try {
      if (editingPress) {
        const { error } = await supabase
          .from('press_releases')
          .update(pressData)
          .eq('id', editingPress.id);
        
        if (error) throw error;
        toast.success('Press release updated successfully');
      } else {
        const { error } = await supabase
          .from('press_releases')
          .insert([pressData]);
        
        if (error) throw error;
        toast.success('Press release created successfully');
      }
      
      fetchPressReleases();
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save press release');
    }
  };

  const handleEdit = (press: PressRelease) => {
    setEditingPress(press);
    setFormData({
      title: press.title,
      slug: press.slug,
      excerpt: press.excerpt || '',
      content: press.content,
      location: press.location || '',
      featured_image: press.featured_image || '',
      press_contact_name: press.press_contact_name || '',
      press_contact_email: press.press_contact_email || '',
      press_contact_phone: press.press_contact_phone || '',
      is_published: press.is_published,
      publish_date: press.publish_date ? new Date(press.publish_date).toISOString().slice(0, 16) : '',
      meta_title: press.meta_title || '',
      meta_description: press.meta_description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('press_releases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Press release deleted successfully');
      fetchPressReleases();
    } catch (error) {
      toast.error('Failed to delete press release');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      location: '',
      featured_image: '',
      press_contact_name: '',
      press_contact_email: '',
      press_contact_phone: '',
      is_published: false,
      publish_date: '',
      meta_title: '',
      meta_description: ''
    });
    setEditingPress(null);
  };

  const openDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Press Releases Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Press Release
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPress ? 'Edit Press Release' : 'Create New Press Release'}</DialogTitle>
              <DialogDescription>
                {editingPress ? 'Update the press release details below.' : 'Fill in the details to create a new press release.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Auto-generated from title if empty"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., New York, NY"
                  />
                </div>
                <div>
                  <Label htmlFor="featured_image">Featured Image URL</Label>
                  <Input
                    id="featured_image"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Press Contact Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="press_contact_name">Contact Name</Label>
                    <Input
                      id="press_contact_name"
                      value={formData.press_contact_name}
                      onChange={(e) => setFormData({ ...formData, press_contact_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="press_contact_email">Contact Email</Label>
                    <Input
                      id="press_contact_email"
                      type="email"
                      value={formData.press_contact_email}
                      onChange={(e) => setFormData({ ...formData, press_contact_email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="press_contact_phone">Contact Phone</Label>
                    <Input
                      id="press_contact_phone"
                      value={formData.press_contact_phone}
                      onChange={(e) => setFormData({ ...formData, press_contact_phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Input
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is_published">Published</Label>
                </div>
                <div>
                  <Label htmlFor="publish_date">Publish Date</Label>
                  <Input
                    id="publish_date"
                    type="datetime-local"
                    value={formData.publish_date}
                    onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPress ? 'Update' : 'Create'} Press Release
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Press Releases</CardTitle>
          <CardDescription>Manage your press releases here</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pressReleases.map((press) => (
                <TableRow key={press.id}>
                  <TableCell className="font-medium">{press.title}</TableCell>
                  <TableCell>{press.location || '-'}</TableCell>
                  <TableCell>{press.press_contact_name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={press.is_published ? 'default' : 'secondary'}>
                      {press.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {press.publish_date ? new Date(press.publish_date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>{new Date(press.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(press)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the press release.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(press.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPress;