import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';

interface AdminSettings {
  notifications: {
    email: boolean;
    push: boolean;
    newUser: boolean;
    newListing: boolean;
    statusChange: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    loginAttempts: number;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    language: 'fr' | 'en';
  };
}

const AdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AdminSettings>({
    notifications: {
      email: true,
      push: true,
      newUser: true,
      newListing: true,
      statusChange: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginAttempts: 3,
    },
    appearance: {
      theme: 'system',
      language: 'fr',
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const settingsRef = doc(db, 'adminSettings', user.uid);
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as AdminSettings);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const settingsRef = doc(db, 'adminSettings', user.uid);
      await updateDoc(settingsRef, settings);

      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres ont été mis à jour avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = (key: keyof AdminSettings['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleSecurityChange = (key: keyof AdminSettings['security'], value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value,
      },
    }));
  };

  const handleAppearanceChange = (key: keyof AdminSettings['appearance'], value: string) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres Administrateur</CardTitle>
            <CardDescription>
              Gérez vos préférences et paramètres de l'interface d'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="notifications" className="space-y-4">
              <TabsList>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="appearance">Apparence</TabsTrigger>
              </TabsList>

              <TabsContent value="notifications" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Notifications par email</Label>
                    <Switch
                      id="email-notifications"
                      checked={settings.notifications.email}
                      onCheckedChange={() => handleNotificationChange('email')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Notifications push</Label>
                    <Switch
                      id="push-notifications"
                      checked={settings.notifications.push}
                      onCheckedChange={() => handleNotificationChange('push')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-user-notifications">Nouveaux utilisateurs</Label>
                    <Switch
                      id="new-user-notifications"
                      checked={settings.notifications.newUser}
                      onCheckedChange={() => handleNotificationChange('newUser')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-listing-notifications">Nouvelles annonces</Label>
                    <Switch
                      id="new-listing-notifications"
                      checked={settings.notifications.newListing}
                      onCheckedChange={() => handleNotificationChange('newListing')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status-change-notifications">Changements de statut</Label>
                    <Switch
                      id="status-change-notifications"
                      checked={settings.notifications.statusChange}
                      onCheckedChange={() => handleNotificationChange('statusChange')}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor-auth">Authentification à deux facteurs</Label>
                    <Switch
                      id="two-factor-auth"
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Délai d'inactivité (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      min="5"
                      max="120"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-attempts">Nombre de tentatives de connexion</Label>
                    <Input
                      id="login-attempts"
                      type="number"
                      min="3"
                      max="10"
                      value={settings.security.loginAttempts}
                      onChange={(e) => handleSecurityChange('loginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Thème</Label>
                    <select
                      id="theme"
                      className="w-full p-2 border rounded-md"
                      value={settings.appearance.theme}
                      onChange={(e) => handleAppearanceChange('theme', e.target.value as 'light' | 'dark' | 'system')}
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="system">Système</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <select
                      id="language"
                      className="w-full p-2 border rounded-md"
                      value={settings.appearance.language}
                      onChange={(e) => handleAppearanceChange('language', e.target.value as 'fr' | 'en')}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={saveSettings}
                disabled={isSaving}
              >
                {isSaving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings; 