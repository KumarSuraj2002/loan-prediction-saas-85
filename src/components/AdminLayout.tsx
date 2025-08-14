import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">FINANCE BUDDY</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            LOG OUT
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;