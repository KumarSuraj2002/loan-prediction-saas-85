
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'signin' | 'signup'>('signin');

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

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'loan-prediction', label: 'Loan Prediction', path: '/' },
    { id: 'bank-recommendation', label: 'Bank Finder', path: '/' },
    { id: 'features', label: 'Features', path: '/' },
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
          <Button variant="outline" size="sm" className="hidden md:flex" onClick={openSignIn}>
            Sign In
          </Button>
          <Button size="sm" className="hidden md:flex" onClick={openSignUp}>
            Get Started
          </Button>
          
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
