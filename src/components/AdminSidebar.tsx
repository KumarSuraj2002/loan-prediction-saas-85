import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Star, 
  CreditCard, 
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  const [isLoanApplicationsExpanded, setIsLoanApplicationsExpanded] = useState(true);

  const mainNavItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: BarChart3,
    },
  ];

  const loanApplicationSubItems = [
    { title: 'New Applications', href: '/admin/loan-applications/new' },
    { title: 'Approved Applications', href: '/admin/loan-applications/approved' },
    { title: 'Rejected Applications', href: '/admin/loan-applications/rejected' },
    { title: 'Application Records', href: '/admin/loan-applications/records' },
  ];

  const otherNavItems = [
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'User Queries',
      href: '/admin/user-queries',
      icon: MessageSquare,
    },
    {
      title: 'Ratings & Reviews',
      href: '/admin/ratings-reviews',
      icon: Star,
    },
    {
      title: 'Loan Products',
      href: '/admin/loan-products',
      icon: CreditCard,
    },
    {
      title: 'Bank Partners',
      href: '/admin/bank-partners',
      icon: FileText,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">ADMIN PANEL</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Main Navigation */}
        {mainNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.title}
          </NavLink>
        ))}

        {/* Loan Applications Expandable Section */}
        <div className="space-y-1">
          <button
            onClick={() => setIsLoanApplicationsExpanded(!isLoanApplicationsExpanded)}
            className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3" />
              Loan Applications
            </div>
            {isLoanApplicationsExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {isLoanApplicationsExpanded && (
            <div className="ml-6 space-y-1">
              {loanApplicationSubItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  {item.title}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Other Navigation Items */}
        {otherNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
