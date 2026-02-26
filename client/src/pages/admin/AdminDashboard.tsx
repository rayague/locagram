import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import { Users, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  zone: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  role: 'demarcheur' | 'admin';
  createdAt: Date;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalListings: number;
  activeListings: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalListings: 0,
    activeListings: 0,
  });
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("User from useAuth:", user); // Debug log
    if (user) {
      loadUsers();
      loadStats();
      loadAdminInfo();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      console.log("Loading users..."); // Debug log
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(usersQuery);
      console.log("Users query snapshot:", querySnapshot.docs.length); // Debug log
      
      const usersData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log("User data:", { id: doc.id, ...data }); // Debug log
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        } as User;
      });
      
      console.log("Processed users data:", usersData); // Debug log
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log("Loading stats..."); // Debug log
      // Charger les statistiques des utilisateurs
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      console.log("Users for stats:", usersSnapshot.docs.length); // Debug log
      
      const totalUsers = usersSnapshot.size;
      const activeUsers = usersSnapshot.docs.filter(doc => doc.data().status === 'active').length;

      // Charger les statistiques des annonces
      const listingsQuery = query(collection(db, 'listings'));
      const listingsSnapshot = await getDocs(listingsQuery);
      console.log("Listings for stats:", listingsSnapshot.docs.length); // Debug log
      
      const totalListings = listingsSnapshot.size;
      const activeListings = listingsSnapshot.docs.filter(doc => doc.data().status === 'active').length;

      const statsData = {
        totalUsers,
        activeUsers,
        totalListings,
        activeListings,
      };
      console.log("Stats data:", statsData); // Debug log
      setStats(statsData);
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
    if (!user) {
      console.log("No user found in loadAdminInfo"); // Debug log
      return;
    }
    
    try {
      console.log("Loading admin info for user:", user.uid); // Debug log
      const adminRef = doc(db, 'users', user.uid);
      const adminDoc = await getDoc(adminRef);
      
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        console.log("Admin data from Firestore:", adminData); // Debug log
        
        const adminInfoData = {
          ...adminData,
          uid: adminDoc.id,
          createdAt: adminData.createdAt?.toDate(),
          lastLoginAt: adminData.lastLoginAt?.toDate()
        };
        console.log("Processed admin info:", adminInfoData); // Debug log
        setAdminInfo(adminInfoData);
      } else {
        console.log("No admin document found for user:", user.uid); // Debug log
      }
    } catch (error) {
      console.error('Erreur lors du chargement des informations de l\'admin:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations de l'administrateur",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: User['status']) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { status: newStatus });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));

      toast({
        title: "Succès",
        description: "Statut de l'utilisateur mis à jour",
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  const getStatusBadge = (status: User['status']) => {
    const statusConfig: Record<string, { label: string; variant: string }> = {
      active: { label: 'Actif', variant: 'success' },
      inactive: { label: 'Inactif', variant: 'secondary' },
      pending: { label: 'En attente', variant: 'warning' },
      suspended: { label: 'Suspendu', variant: 'destructive' },
      rejected: { label: 'Rejeté', variant: 'destructive' },
    };

    const config = statusConfig[status as string] ?? { label: status ?? 'Inconnu', variant: 'secondary' };
    return (
      <Badge variant={config.variant as any}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    console.log("Dashboard is loading..."); // Debug log
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log("Rendering dashboard with:", { // Debug log
    adminInfo,
    users: users.length,
    stats,
    isLoading,
    loading
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Informations de l'admin */}
        {adminInfo ? (
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
        ) : null}

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
                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% du total
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
                {((stats.activeListings / stats.totalListings) * 100).toFixed(1)}% du total
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