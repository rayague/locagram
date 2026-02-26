import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import { Users, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalListings: number;
  activeListings: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalListings: 0,
    activeListings: 0,
  });
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
      loadAdminInfo();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      // Statistiques utilisateurs
      const totalUsersQuery = query(collection(db, 'users'));
      const activeUsersQuery = query(collection(db, 'users'), where('status', '==', 'active'));

      // Statistiques annonces
      const totalListingsQuery = query(collection(db, 'listings'));
      const activeListingsQuery = query(collection(db, 'listings'), where('status', '==', 'active'));

      // Exécution parallèle des requêtes de comptage (beaucoup plus léger que de charger les documents)
      const [
        totalUsersSnap,
        activeUsersSnap,
        totalListingsSnap,
        activeListingsSnap
      ] = await Promise.all([
        getCountFromServer(totalUsersQuery),
        getCountFromServer(activeUsersQuery),
        getCountFromServer(totalListingsQuery),
        getCountFromServer(activeListingsQuery)
      ]);

      setStats({
        totalUsers: totalUsersSnap.data().count,
        activeUsers: activeUsersSnap.data().count,
        totalListings: totalListingsSnap.data().count,
        activeListings: activeListingsSnap.data().count,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    }
  };

  const loadAdminInfo = async () => {
    if (!user) return;
    
    try {
      const adminRef = doc(db, 'users', user.uid);
      const adminDoc = await getDoc(adminRef);
      
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        const adminInfoData = {
          ...adminData,
          uid: adminDoc.id,
          createdAt: adminData.createdAt?.toDate(),
          lastLoginAt: adminData.lastLoginAt?.toDate()
        };
        setAdminInfo(adminInfoData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des informations de l\'admin:', error);
    } finally {
      setIsLoading(false);
    }
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
        {/* Informations de l'admin */}
        {adminInfo && (
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-800">
                Bienvenue, {adminInfo.name || 'Administrateur'}
              </CardTitle>
              <CardDescription className="text-green-700">
                Voici un aperçu de votre tableau de bord administratif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Email:</span> {adminInfo.email}
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Rôle:</span> Administrateur
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Statut:</span> {adminInfo.status || 'Actif'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Zone:</span> {adminInfo.zone || 'Toutes'}
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Pays:</span> {adminInfo.country || 'Bénin'}
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Dernière connexion:</span>{' '}
                    {adminInfo.lastLoginAt ? new Date(adminInfo.lastLoginAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} utilisateurs actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}% du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Annonces</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalListings}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeListings} annonces actives
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Annonces Actives</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.activeListings}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalListings > 0 ? ((stats.activeListings / stats.totalListings) * 100).toFixed(1) : 0}% du total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statut du Système */}
        <Card>
          <CardHeader>
            <CardTitle>Statut du Système</CardTitle>
            <CardDescription>État actuel de la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Serveur</h3>
                  <p className="text-sm text-green-600">Opérationnel</p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Base de données</h3>
                  <p className="text-sm text-green-600">Connectée</p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
