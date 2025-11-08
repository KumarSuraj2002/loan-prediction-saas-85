import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { toast } from 'sonner';

interface LoanProductQuestion {
  id: string;
  loan_product_id: string;
  question_text: string;
  question_type: string;
  field_name: string;
  options: string[];
  is_required: boolean;
  sequence_order: number;
  placeholder?: string | null;
  help_text?: string | null;
}

interface LoanProductQuestionsManagerProps {
  loanProductId: string;
  loanProductName: string;
  isOpen: boolean;
  onClose: () => void;
}

const LoanProductQuestionsManager = ({
  loanProductId,
  loanProductName,
  isOpen,
  onClose
}: LoanProductQuestionsManagerProps) => {
  const [questions, setQuestions] = useState<LoanProductQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<LoanProductQuestion | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<LoanProductQuestion>>({});

  useEffect(() => {
    if (isOpen && loanProductId) {
      fetchQuestions();
    }
  }, [isOpen, loanProductId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('loan_product_questions')
        .select('*')
        .eq('loan_product_id', loanProductId)
        .order('sequence_order', { ascending: true });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : [],
        placeholder: q.placeholder || null,
        help_text: q.help_text || null
      })) as LoanProductQuestion[];
      
      setQuestions(transformedData);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const saveQuestion = async () => {
    try {
      if (!editForm.question_text || !editForm.field_name) {
        toast.error('Question text and field name are required');
        return;
      }

      if (selectedQuestion) {
        // Update existing question
        const { error } = await supabase
          .from('loan_product_questions')
          .update(editForm)
          .eq('id', selectedQuestion.id);

        if (error) throw error;
        toast.success('Question updated');
      } else {
        // Add new question - set sequence_order to last + 1
        const maxSequence = questions.length > 0 
          ? Math.max(...questions.map(q => q.sequence_order)) 
          : 0;
        
        const { error } = await supabase
          .from('loan_product_questions')
          .insert([{
            question_text: editForm.question_text!,
            field_name: editForm.field_name!,
            question_type: editForm.question_type || 'text',
            is_required: editForm.is_required ?? true,
            options: editForm.options || [],
            placeholder: editForm.placeholder || null,
            help_text: editForm.help_text || null,
            loan_product_id: loanProductId,
            sequence_order: maxSequence + 1
          }]);

        if (error) throw error;
        toast.success('Question added');
      }
      
      fetchQuestions();
      setIsEditDialogOpen(false);
      setEditForm({});
      setSelectedQuestion(null);
    } catch (error: any) {
      console.error('Error saving question:', error);
      toast.error(error.message || 'Failed to save question');
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase
        .from('loan_product_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Question deleted');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const moveQuestion = async (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    const currentQuestion = questions[currentIndex];
    const targetQuestion = questions[targetIndex];

    try {
      // Swap sequence orders
      const { error: error1 } = await supabase
        .from('loan_product_questions')
        .update({ sequence_order: targetQuestion.sequence_order })
        .eq('id', currentQuestion.id);

      const { error: error2 } = await supabase
        .from('loan_product_questions')
        .update({ sequence_order: currentQuestion.sequence_order })
        .eq('id', targetQuestion.id);

      if (error1 || error2) throw error1 || error2;
      
      toast.success('Question order updated');
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question order:', error);
      toast.error('Failed to update question order');
    }
  };

  const openAddDialog = () => {
    setEditForm({
      question_type: 'text',
      is_required: true,
      options: []
    });
    setSelectedQuestion(null);
    setIsEditDialogOpen(true);
  };

  const openEditDialog = (question: LoanProductQuestion) => {
    setSelectedQuestion(question);
    setEditForm(question);
    setIsEditDialogOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Questions - {loanProductName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {questions.length} question{questions.length !== 1 ? 's' : ''} configured
            </p>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No questions configured yet. Click "Add Question" to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Field Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question, index) => (
                  <TableRow key={question.id}>
                    <TableCell>{question.sequence_order}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="space-y-1">
                        <div className="font-medium">{question.question_text}</div>
                        {question.help_text && (
                          <div className="text-xs text-muted-foreground">{question.help_text}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{question.field_name}</TableCell>
                    <TableCell className="capitalize">{question.question_type}</TableCell>
                    <TableCell>{question.is_required ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveQuestion(question.id, 'up')}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveQuestion(question.id, 'down')}
                          disabled={index === questions.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Edit/Add Question Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedQuestion ? 'Edit Question' : 'Add Question'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Question Text *</Label>
                <Textarea
                  value={editForm.question_text || ''}
                  onChange={(e) => setEditForm({ ...editForm, question_text: e.target.value })}
                  placeholder="What is your annual income?"
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Field Name * (unique identifier, no spaces)</Label>
                <Input
                  value={editForm.field_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, field_name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="annual_income"
                />
              </div>

              <div>
                <Label>Question Type</Label>
                <Select
                  value={editForm.question_type || 'text'}
                  onValueChange={(value) => setEditForm({ ...editForm, question_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="tel">Phone</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                    <SelectItem value="textarea">Long Text</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editForm.question_type === 'select' && (
                <div>
                  <Label>Options (comma-separated)</Label>
                  <Textarea
                    value={Array.isArray(editForm.options) ? editForm.options.join(', ') : ''}
                    onChange={(e) => {
                      const options = e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt);
                      setEditForm({ ...editForm, options });
                    }}
                    placeholder="Option 1, Option 2, Option 3"
                    rows={2}
                  />
                </div>
              )}

              <div>
                <Label>Placeholder Text</Label>
                <Input
                  value={editForm.placeholder || ''}
                  onChange={(e) => setEditForm({ ...editForm, placeholder: e.target.value })}
                  placeholder="Enter your answer..."
                />
              </div>

              <div>
                <Label>Help Text</Label>
                <Input
                  value={editForm.help_text || ''}
                  onChange={(e) => setEditForm({ ...editForm, help_text: e.target.value })}
                  placeholder="Additional information to help users"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editForm.is_required || false}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, is_required: checked })}
                />
                <Label>Required Field</Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={saveQuestion}>
                  {selectedQuestion ? 'Update' : 'Add'} Question
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditForm({});
                  setSelectedQuestion(null);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default LoanProductQuestionsManager;