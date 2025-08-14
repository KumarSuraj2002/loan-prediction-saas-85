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
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      if (data) {
        const newSettings = { ...settings };
        data.forEach(setting => {
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
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, refetch: fetchSettings };
};