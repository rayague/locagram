import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const Settings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Security settings state
  const [securityState, setSecurityState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification settings state
  const [notificationState, setNotificationState] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newMessages: true,
    reservationUpdates: true,
    marketingEmails: false,
  });

  // User data state
  const [userData, setUserData] = useState<any>(null);

  // Fetch user data
  useEffect(() => {
    if (!user?.uid) {
      console.log("Pas d'utilisateur connecté");
      return;
    }

    console.log("UID de l'utilisateur:", user.uid);
    const userRef = doc(db, "users", user.uid);
    
    const unsubscribe = onSnapshot(userRef, 
      (doc) => {
        if (doc.exists()) {
          console.log("Données utilisateur reçues:", doc.data());
          const data = doc.data();
          setUserData(data);
          // Update notification settings from user data
          if (data.notificationSettings) {
            setNotificationState(data.notificationSettings);
          }
        } else {
          console.log("Document utilisateur non trouvé");
        }
      }, 
      (error) => {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les données utilisateur",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Handle security form changes
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityState(prev => ({ ...prev, [name]: value }));
  };

  // Handle notification toggle changes
  const handleNotificationChange = async (name: string, checked: boolean) => {
    try {
      const newState = { ...notificationState, [name]: checked };
      setNotificationState(newState);
      
      // Update in Firebase
      if (user?.uid) {
        await updateDoc(doc(db, "users", user.uid), {
          notificationSettings: newState,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences de notification",
        variant: "destructive",
      });
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!user?.email) throw new Error("Utilisateur non connecté");
      
      if (securityState.newPassword !== securityState.confirmPassword) {
        toast({
          title: "Erreur de validation",
          description: "Les mots de passe ne correspondent pas",
          variant: "destructive",
        });
        return;
      }

      // Reauthenticate user before password change
      const credential = EmailAuthProvider.credential(
        user.email,
        securityState.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, securityState.newPassword);

      // Update last password change in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        lastPasswordChange: serverTimestamp()
      });

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès",
      });

      setSecurityState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      
      if (error.code === 'auth/wrong-password') {
        toast({
          title: "Erreur",
          description: "Le mot de passe actuel est incorrect",
          variant: "destructive",
        });
      } else if (error.code === 'auth/weak-password') {
        toast({
          title: "Erreur",
          description: "Le nouveau mot de passe est trop faible",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le mot de passe",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle notification settings update
  const handleNotificationUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!user?.uid) throw new Error("Utilisateur non connecté");
      
      await updateDoc(doc(db, "users", user.uid), {
        notificationSettings: notificationState,
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences de notification ont été enregistrées",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Informations du compte</CardTitle>
                <CardDescription>
                  Consultez les informations de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="bg-gray-100 p-2 rounded-md text-gray-700">
                      {userData?.email || user?.email}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <div className="bg-gray-100 p-2 rounded-md text-gray-700">
                      {userData?.name || "Non défini"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Numéro de téléphone</Label>
                    <div className="bg-gray-100 p-2 rounded-md text-gray-700">
                      {userData?.phone || "Non défini"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Zone d'activité</Label>
                    <div className="bg-gray-100 p-2 rounded-md text-gray-700">
                      {userData?.zone || "Non défini"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Pays</Label>
                    <div className="bg-gray-100 p-2 rounded-md text-gray-700">
                      {userData?.country || "Non défini"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Numéro CIP</Label>
                    <div className="bg-gray-100 p-2 rounded-md text-gray-700">
                      {userData?.cipNumber || "Non défini"}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Pour modifier ces informations, veuillez vous rendre sur la page Profil.
                  </p>
                  <div className="mt-2">
                    <Button variant="outline" onClick={() => window.location.href = '/dashboard/profile'}>
                      Modifier mon profil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>
                  Modifiez votre mot de passe et les paramètres de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={securityState.currentPassword}
                      onChange={handleSecurityChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={securityState.newPassword}
                      onChange={handleSecurityChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={securityState.confirmPassword}
                      onChange={handleSecurityChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Gérez vos préférences de notification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications" className="font-medium">Notifications par email</Label>
                        <p className="text-sm text-muted-foreground">Recevoir des notifications par email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationState.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsNotifications" className="font-medium">Notifications par SMS</Label>
                        <p className="text-sm text-muted-foreground">Recevoir des notifications par SMS</p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={notificationState.smsNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="newMessages" className="font-medium">Nouveaux messages</Label>
                        <p className="text-sm text-muted-foreground">Notifications pour les nouveaux messages</p>
                      </div>
                      <Switch
                        id="newMessages"
                        checked={notificationState.newMessages}
                        onCheckedChange={(checked) => handleNotificationChange('newMessages', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="reservationUpdates" className="font-medium">Mises à jour des réservations</Label>
                        <p className="text-sm text-muted-foreground">Notifications pour les mises à jour des réservations</p>
                      </div>
                      <Switch
                        id="reservationUpdates"
                        checked={notificationState.reservationUpdates}
                        onCheckedChange={(checked) => handleNotificationChange('reservationUpdates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketingEmails" className="font-medium">Emails marketing</Label>
                        <p className="text-sm text-muted-foreground">Recevoir des emails marketing et promotionnels</p>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={notificationState.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Enregistrement..." : "Enregistrer les préférences"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
