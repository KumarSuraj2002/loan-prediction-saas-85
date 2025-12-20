
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from "sonner";
import AuthModal from "./AuthModal";
import { NotificationBell } from "./NotificationBell";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openSignIn = () => {
    setAuthModalView('signin');
    setAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthModalView('signup');
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'loan-prediction', label: 'Loan Prediction', path: '/' },
    { id: 'bank-recommendation', label: 'Bank Finder', path: '/' },
    { id: 'features', label: 'Features', path: '/' },
    { id: 'presentation', label: 'Presentation', path: '/presentation' },
  ];

  const isHomePage = window.location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/90 border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">FB</div>
          <span>FinanceBuddy</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            isHomePage && item.path === '/' ? (
              <button 
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeTab === item.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ) : (
              <Link 
                key={item.id}
                to={item.path}
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden md:block">
                <NotificationBell />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-2 text-sm">
                  <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
                  <p className="text-muted-foreground text-xs">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="hidden md:flex" onClick={openSignIn}>
                Sign In
              </Button>
              <Button size="sm" className="hidden md:flex" onClick={openSignUp}>
                Get Started
              </Button>
            </>
          )}
          
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map(item => (
                  isHomePage && item.path === '/' ? (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleTabClick(item.id);
                        document.querySelector('[data-state="open"]')?.setAttribute('data-state', 'closed');
                      }}
                      className="text-left px-2 py-1 text-lg hover:text-primary"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="text-left px-2 py-1 text-lg hover:text-primary"
                      onClick={() => {
                        document.querySelector('[data-state="open"]')?.setAttribute('data-state', 'closed');
                      }}
                    >
                      {item.label}
                    </Link>
                  )
                ))}
                {user ? (
                  <>
                    <div className="mt-4 flex items-center gap-2 px-2">
                      <span className="text-sm font-medium">Notifications</span>
                      <NotificationBell />
                    </div>
                    <div className="mt-2 px-2 py-2 border rounded-lg">
                      <p className="font-medium text-sm">{user.user_metadata?.full_name || 'User'}</p>
                      <p className="text-muted-foreground text-xs">{user.email}</p>
                    </div>
                    <Button variant="outline" className="w-full justify-center" onClick={() => {
                      document.querySelector('[data-state="open"]')?.setAttribute('data-state', 'closed');
                      handleSignOut();
                    }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="mt-4 w-full justify-center" onClick={() => {
                      document.querySelector('[data-state="open"]')?.setAttribute('data-state', 'closed');
                      openSignIn();
                    }}>
                      Sign In
                    </Button>
                    <Button className="w-full justify-center" onClick={() => {
                      document.querySelector('[data-state="open"]')?.setAttribute('data-state', 'closed');
                      openSignUp();
                    }}>
                      Get Started
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialView={authModalView}
      />
    </header>
  );
};

export default Navbar;
