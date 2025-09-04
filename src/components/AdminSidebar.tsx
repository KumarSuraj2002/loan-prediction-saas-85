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
  ChevronRight,
  BookOpen,
  Briefcase,
  Newspaper,
  PenTool
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const AdminSidebar = () => {
  const location = useLocation();
  const [isLoanApplicationsExpanded, setIsLoanApplicationsExpanded] = useState(true);
  const [isContentExpanded, setIsContentExpanded] = useState(true);

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

  const contentManagementSubItems = [
    { title: 'Blog Posts', href: '/admin/blog', icon: PenTool },
    { title: 'Financial Guides', href: '/admin/financial-guides', icon: BookOpen },
    { title: 'Careers', href: '/admin/careers', icon: Briefcase },
    { title: 'Press Releases', href: '/admin/press', icon: Newspaper },
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
    <Sidebar className="border-r">
      <SidebarContent>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-sidebar-border">
          <h1 className="text-lg sm:text-xl font-bold text-sidebar-foreground">ADMIN PANEL</h1>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Loan Applications Expandable Section */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <button
              onClick={() => setIsLoanApplicationsExpanded(!isLoanApplicationsExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors rounded-lg"
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span className="text-sm sm:text-base">Loan Applications</span>
              </div>
              {isLoanApplicationsExpanded ? (
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </button>
          </SidebarGroupLabel>

          {isLoanApplicationsExpanded && (
            <SidebarGroupContent>
              <SidebarMenu>
                {loanApplicationSubItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.href}
                        className={cn(
                          "block px-3 py-2 ml-4 sm:ml-6 rounded-lg text-xs sm:text-sm transition-colors",
                          isActive(item.href)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        {item.title}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* Content Management Expandable Section */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <button
              onClick={() => setIsContentExpanded(!isContentExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors rounded-lg"
            >
              <div className="flex items-center">
                <PenTool className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span className="text-sm sm:text-base">Content Management</span>
              </div>
              {isContentExpanded ? (
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </button>
          </SidebarGroupLabel>

          {isContentExpanded && (
            <SidebarGroupContent>
              <SidebarMenu>
                {contentManagementSubItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 ml-4 sm:ml-6 rounded-lg text-xs sm:text-sm transition-colors",
                          isActive(item.href)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        {item.title}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* Other Navigation Items */}
        <SidebarGroup>
          <SidebarMenu>
            {otherNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
