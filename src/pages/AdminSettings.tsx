import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const AdminSettings = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    site_title: '',
    about_us: ''
  });
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
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
  });
  const [maintenanceSettings, setMaintenanceSettings] = useState<MaintenanceSettings>({
    is_maintenance: false,
    maintenance_message: ''
  });

  const [editingGeneral, setEditingGeneral] = useState(false);
  const [editingContacts, setEditingContacts] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      data?.forEach(setting => {
        switch (setting.setting_key) {
          case 'general':
            setGeneralSettings(setting.setting_value as unknown as GeneralSettings);
            break;
          case 'contacts':
            setContactSettings(setting.setting_value as unknown as ContactSettings);
            break;
          case 'maintenance':
            setMaintenanceSettings(setting.setting_value as unknown as MaintenanceSettings);
            break;
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ setting_value: value })
        .eq('setting_key', key);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings updated successfully"
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    }
  };

  const handleGeneralSave = () => {
    updateSetting('general', generalSettings);
    setEditingGeneral(false);
  };

  const handleContactsSave = () => {
    updateSetting('contacts', contactSettings);
    setEditingContacts(false);
  };

  const handleMaintenanceToggle = (checked: boolean) => {
    const newSettings = { ...maintenanceSettings, is_maintenance: checked };
    setMaintenanceSettings(newSettings);
    updateSetting('maintenance', newSettings);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">SETTINGS</h1>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">General Settings</CardTitle>
          {!editingGeneral ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingGeneral(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleGeneralSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingGeneral(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="site-title" className="text-sm font-medium">Site Title</Label>
            <Input
              id="site-title"
              value={generalSettings.site_title}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, site_title: e.target.value }))}
              disabled={!editingGeneral}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="about-us" className="text-sm font-medium">About us</Label>
            <Textarea
              id="about-us"
              value={generalSettings.about_us}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, about_us: e.target.value }))}
              disabled={!editingGeneral}
              className="mt-1 min-h-20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Maintenance Mode</h3>
              <p className="text-sm text-muted-foreground">
                No customers will be able to access loan services when maintenance mode is turned on.
              </p>
            </div>
            <Switch
              checked={maintenanceSettings.is_maintenance}
              onCheckedChange={handleMaintenanceToggle}
            />
          </div>
          {maintenanceSettings.is_maintenance && (
            <div className="mt-4">
              <Label htmlFor="maintenance-message" className="text-sm font-medium">Maintenance Message</Label>
              <Textarea
                id="maintenance-message"
                value={maintenanceSettings.maintenance_message}
                onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, maintenance_message: e.target.value }))}
                onBlur={() => updateSetting('maintenance', maintenanceSettings)}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Contacts Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Contact Settings</CardTitle>
          {!editingContacts ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingContacts(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleContactsSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingContacts(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <Textarea
                  id="address"
                  value={contactSettings.address}
                  onChange={(e) => setContactSettings(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!editingContacts}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="google-map" className="text-sm font-medium">Google Map</Label>
                <Input
                  id="google-map"
                  value={contactSettings.google_map}
                  onChange={(e) => setContactSettings(prev => ({ ...prev, google_map: e.target.value }))}
                  disabled={!editingContacts}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone1" className="text-sm font-medium">Phone Numbers</Label>
                <Input
                  id="phone1"
                  value={contactSettings.phone_numbers[0] || ''}
                  onChange={(e) => {
                    const newPhones = [...contactSettings.phone_numbers];
                    newPhones[0] = e.target.value;
                    setContactSettings(prev => ({ ...prev, phone_numbers: newPhones }));
                  }}
                  disabled={!editingContacts}
                  className="mt-1"
                  placeholder="Primary phone number"
                />
                <Input
                  value={contactSettings.phone_numbers[1] || ''}
                  onChange={(e) => {
                    const newPhones = [...contactSettings.phone_numbers];
                    newPhones[1] = e.target.value;
                    setContactSettings(prev => ({ ...prev, phone_numbers: newPhones }));
                  }}
                  disabled={!editingContacts}
                  className="mt-2"
                  placeholder="Secondary phone number"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactSettings.email}
                  onChange={(e) => setContactSettings(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!editingContacts}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Social Links</Label>
                <div className="space-y-2 mt-1">
                  <Input
                    value={contactSettings.social_links.facebook}
                    onChange={(e) => setContactSettings(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, facebook: e.target.value }
                    }))}
                    disabled={!editingContacts}
                    placeholder="Facebook URL"
                  />
                  <Input
                    value={contactSettings.social_links.twitter}
                    onChange={(e) => setContactSettings(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, twitter: e.target.value }
                    }))}
                    disabled={!editingContacts}
                    placeholder="Twitter URL"
                  />
                  <Input
                    value={contactSettings.social_links.instagram}
                    onChange={(e) => setContactSettings(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, instagram: e.target.value }
                    }))}
                    disabled={!editingContacts}
                    placeholder="Instagram URL"
                  />
                  <Input
                    value={contactSettings.social_links.linkedin}
                    onChange={(e) => setContactSettings(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, linkedin: e.target.value }
                    }))}
                    disabled={!editingContacts}
                    placeholder="LinkedIn URL"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;