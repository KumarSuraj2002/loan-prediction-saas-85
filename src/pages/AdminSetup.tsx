import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateAdminUser from '@/components/CreateAdminUser';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle } from 'lucide-react';

const AdminSetup = () => {
  const [hasAdmins, setHasAdmins] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkForExistingAdmins();
  }, []);

  const checkForExistingAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (error) {
        console.error('Error checking for admins:', error);
      } else {
        setHasAdmins(data && data.length > 0);
      }
    } catch (error) {
      console.error('Error checking for admins:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Checking setup status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Admin Panel Setup</h1>
          <p className="text-muted-foreground mt-2">
            {hasAdmins 
              ? "Admin users exist. You can now login to the admin panel." 
              : "Create your first admin user to access the admin panel."
            }
          </p>
        </div>

        {hasAdmins ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Setup Complete
              </CardTitle>
              <CardDescription>
                Admin users have been configured for this system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button 
                onClick={() => navigate('/admin')}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Go to Admin Login
              </button>
            </CardContent>
          </Card>
        ) : (
          <CreateAdminUser />
        )}

        {!hasAdmins && (
          <div className="text-center text-sm text-muted-foreground">
            <p>
              After creating an admin user, you'll be able to login at{' '}
              <button 
                onClick={() => navigate('/admin')}
                className="text-primary hover:underline"
              >
                /admin
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSetup;