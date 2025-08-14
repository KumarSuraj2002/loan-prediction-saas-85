import { ReactNode } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface MaintenanceWrapperProps {
  children: ReactNode;
}

const MaintenanceWrapper = ({ children }: MaintenanceWrapperProps) => {
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (settings.maintenance.is_maintenance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Under Maintenance
          </h1>
          <p className="text-muted-foreground mb-6">
            {settings.maintenance.maintenance_message}
          </p>
          <div className="text-sm text-muted-foreground">
            Please check back soon. Thank you for your patience.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MaintenanceWrapper;