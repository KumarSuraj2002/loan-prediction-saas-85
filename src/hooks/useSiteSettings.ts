import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GeneralSettings {
  site_title: string;
  about_us: string;
}

interface ContactSettings {
  address: string;
  phone_numbers: string[];
  email: string;
  google_map: string;
  social_links: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}

interface MaintenanceSettings {
  is_maintenance: boolean;
  maintenance_message: string;
}

export interface SiteSettings {
  general: GeneralSettings;
  contacts: ContactSettings;
  maintenance: MaintenanceSettings;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    general: {
      site_title: 'Finance Buddy',
      about_us: 'Finance Buddy is your trusted partner for loan applications and financial guidance.'
    },
    contacts: {
      address: '',
      phone_numbers: [],
      email: '',
      google_map: '',
      social_links: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      }
    },
    maintenance: {
      is_maintenance: false,
      maintenance_message: ''
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      console.log('Fetching settings...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;
      console.log('Settings data from DB:', data);

      if (data) {
        const newSettings: SiteSettings = {
          general: {
            site_title: 'Finance Buddy',
            about_us: 'Finance Buddy is your trusted partner for loan applications and financial guidance.'
          },
          contacts: {
            address: '',
            phone_numbers: [],
            email: '',
            google_map: '',
            social_links: {
              facebook: '',
              twitter: '',
              instagram: '',
              linkedin: ''
            }
          },
          maintenance: {
            is_maintenance: false,
            maintenance_message: ''
          }
        };

        data.forEach(setting => {
          console.log('Processing setting:', setting.setting_key, setting.setting_value);
          switch (setting.setting_key) {
            case 'general':
              newSettings.general = setting.setting_value as unknown as GeneralSettings;
              break;
            case 'contacts':
              newSettings.contacts = setting.setting_value as unknown as ContactSettings;
              break;
            case 'maintenance':
              newSettings.maintenance = setting.setting_value as unknown as MaintenanceSettings;
              break;
          }
        });
        console.log('New settings state:', newSettings);
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAndSubscribe = async () => {
      await fetchSettings();

      // Set up real-time subscription for settings changes
      console.log('Setting up real-time subscription...');
      const channel = supabase
        .channel('site_settings_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'site_settings'
          },
          (payload) => {
            console.log('Real-time change detected:', payload);
            // Refetch settings when any change occurs
            fetchSettings();
          }
        )
        .subscribe((status) => {
          console.log('Real-time subscription status:', status);
        });

      return () => {
        console.log('Cleaning up real-time subscription');
        supabase.removeChannel(channel);
      };
    };

    let cleanup: (() => void) | undefined;
    fetchAndSubscribe().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return { settings, loading, refetch: fetchSettings };
};