
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'signin' | 'signup';
}

const AuthModal = ({
  isOpen,
  onClose,
  initialView = 'signin'
}: AuthModalProps) => {
  const [view, setView] = useState<'signin' | 'signup'>(initialView);

  const toggleForm = () => {
    setView(view === 'signin' ? 'signup' : 'signin');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {view === 'signin' ? (
          <SignInForm onToggleForm={toggleForm} />
        ) : (
          <SignUpForm onToggleForm={toggleForm} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
