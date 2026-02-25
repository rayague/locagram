import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
  MessageCircle,
  Tag,
  ExternalLink,
  Pencil,
  Globe,
  Clock
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface User {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'demarcheur';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  phone?: string;
  zone?: string;
  country?: string;
  categories?: string[];
  createdAt?: Date;
  lastLoginAt?: Date;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const usersData = usersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        lastLoginAt: doc.data().lastLoginAt?.toDate()
      })) as User[];

      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query) ||
      user.zone?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const updateUserStatus = async (userId: string, newStatus: User['status']) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { status: newStatus });
      
      // Mettre à jour l'état local
      setUsers(users.map(user => 
        user.uid === userId ? { ...user, status: newStatus } : user
      ));

      toast({
        title: "Statut mis à jour",
        description: `Le statut de l'utilisateur a été modifié avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: User['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      suspended: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Jamais';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleWhatsAppClick = (phone: string) => {
    // Nettoyer le numéro de téléphone (enlever les espaces et caractères spéciaux)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Créer le lien WhatsApp
    const whatsappUrl = `https://wa.me/${cleanPhone}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold">Gestion des Utilisateurs</CardTitle>
                  <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2">
                    Gérez les utilisateurs de la plateforme, leurs statuts et leurs permissions
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un utilisateur..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-64 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                  <Button onClick={loadUsers} variant="outline" className="bg-white/50 backdrop-blur-sm">
                    Actualiser
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchQuery 
                    ? `Aucun utilisateur trouvé pour "${searchQuery}"`
                    : 'Aucun utilisateur disponible'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  {filteredUsers.map((user) => (
                    <Card 
                      key={user.uid} 
                      className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50 bg-gradient-to-br from-white to-gray-50/50"
                    >
                      <CardContent className="p-4 sm:p-6 lg:p-8">
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4">
                          {getStatusBadge(user.status)}
                        </div>
                        
                        <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                          <div className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-4 ring-primary/5 flex-shrink-0">
                            <User className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg lg:text-xl truncate">{user.name}</h3>
                            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">{user.role === 'admin' ? 'Administrateur' : 'Démarcheur'}</p>
                          </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                          <div className="space-y-2 sm:space-y-3 lg:space-y-4 text-xs sm:text-sm lg:text-base">
                            <div className="flex items-center gap-2 text-muted-foreground bg-gray-50/50 p-2 sm:p-3 lg:p-4 rounded-lg">
                              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary/60 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground bg-gray-50/50 p-2 sm:p-3 lg:p-4 rounded-lg">
                                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary/60 flex-shrink-0" />
                                <span className="truncate">{user.phone}</span>
                              </div>
                            )}
                            {user.zone && (
                              <div className="flex items-center gap-2 text-muted-foreground bg-gray-50/50 p-2 sm:p-3 lg:p-4 rounded-lg">
                                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary/60 flex-shrink-0" />
                                <span className="truncate">{user.zone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-muted-foreground bg-gray-50/50 p-2 sm:p-3 lg:p-4 rounded-lg">
                              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary/60 flex-shrink-0" />
                              <span className="truncate">Dernière connexion: {formatDate(user.lastLoginAt)}</span>
                            </div>
                          </div>

                          {user.categories && user.categories.length > 0 && (
                            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                              <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base font-medium text-muted-foreground">
                                <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                                <span>Catégories</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3">
                                {user.categories.map((category, index) => (
                                  <Badge 
                                    key={index}
                                    variant="secondary"
                                    className="text-xs sm:text-sm lg:text-base bg-primary/5 text-primary hover:bg-primary/10 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2"
                                  >
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center justify-between gap-2 pt-3 sm:pt-4 lg:pt-5 border-t border-border/50">
                          <div className="flex gap-1.5 sm:gap-2 lg:gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm lg:text-base gap-1.5 sm:gap-2 hover:bg-primary/5 hover:text-primary"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsUserDialogOpen(true);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                              Profil
                            </Button>
                            {user.phone && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm lg:text-base gap-1.5 sm:gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                                onClick={() => handleWhatsAppClick(user.phone!)}
                              >
                                <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                                WhatsApp
                              </Button>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 hover:bg-primary/5">
                                <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => updateUserStatus(user.uid, 'active')}
                                disabled={user.status === 'active'}
                                className="gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Activer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateUserStatus(user.uid, 'inactive')}
                                disabled={user.status === 'inactive'}
                                className="gap-2"
                              >
                                <XCircle className="h-4 w-4" />
                                Désactiver
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateUserStatus(user.uid, 'suspended')}
                                disabled={user.status === 'suspended'}
                                className="gap-2"
                              >
                                <AlertCircle className="h-4 w-4" />
                                Suspendre
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dialog pour afficher les détails de l'utilisateur */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="w-[95vw] max-w-[1000px] max-h-[90vh] overflow-y-auto p-0">
            <div className="sticky top-0 z-10 bg-background border-b">
              <DialogHeader className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between max-w-[900px] mx-auto">
                  <div>
                    <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-semibold">Profil Utilisateur</DialogTitle>
                    <DialogDescription className="text-sm sm:text-base lg:text-lg mt-1">
                      Informations détaillées de l'utilisateur
                    </DialogDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 lg:h-10 lg:w-10"
                    onClick={() => setIsUserDialogOpen(false)}
                  >
                    <XCircle className="h-5 w-5 lg:h-6 lg:w-6" />
                  </Button>
                </div>
              </DialogHeader>
            </div>

            {selectedUser && (
              <div className="divide-y divide-border">
                {/* En-tête du profil */}
                <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-primary/5 to-primary/10">
                  <div className="max-w-[900px] mx-auto">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
                      <div className="relative">
                        <div className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-4 ring-primary/5">
                          <User className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-primary" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0">
                          {getStatusBadge(selectedUser.status)}
                        </div>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold">{selectedUser.name}</h3>
                        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-1">
                          {selectedUser.role === 'admin' ? 'Administrateur' : 'Démarcheur'}
                        </p>
                        <div className="mt-4 lg:mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
                          {selectedUser.phone && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 sm:h-10 px-4 sm:px-5 text-sm sm:text-base gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                              onClick={() => handleWhatsAppClick(selectedUser.phone!)}
                            >
                              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                              Contacter sur WhatsApp
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 sm:h-10 px-4 sm:px-5 text-sm sm:text-base gap-2"
                            onClick={() => {
                              // Logique pour éditer le profil
                              setIsUserDialogOpen(false);
                            }}
                          >
                            <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                            Modifier le profil
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations principales */}
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="max-w-[900px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                      {/* Colonne de gauche */}
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h4 className="text-sm sm:text-base lg:text-lg font-medium text-muted-foreground">Informations de contact</h4>
                          <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary/60 mt-0.5" />
                              <div className="flex-1">
                                <div className="text-sm sm:text-base font-medium">Email</div>
                                <div className="text-sm sm:text-base break-all mt-1">{selectedUser.email}</div>
                              </div>
                            </div>
                            {selectedUser.phone && (
                              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary/60 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-sm sm:text-base font-medium">Téléphone</div>
                                  <div className="text-sm sm:text-base mt-1">{selectedUser.phone}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedUser.categories && selectedUser.categories.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-sm sm:text-base lg:text-lg font-medium text-muted-foreground">Catégories</h4>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                              {selectedUser.categories.map((category, index) => (
                                <Badge 
                                  key={index}
                                  variant="secondary"
                                  className="text-sm sm:text-base bg-primary/5 text-primary hover:bg-primary/10 px-3 py-1.5"
                                >
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Colonne de droite */}
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h4 className="text-sm sm:text-base lg:text-lg font-medium text-muted-foreground">Informations de localisation</h4>
                          <div className="space-y-4">
                            {selectedUser.zone && (
                              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary/60 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-sm sm:text-base font-medium">Zone</div>
                                  <div className="text-sm sm:text-base mt-1">{selectedUser.zone}</div>
                                </div>
                              </div>
                            )}
                            {selectedUser.country && (
                              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary/60 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-sm sm:text-base font-medium">Pays</div>
                                  <div className="text-sm sm:text-base mt-1">{selectedUser.country}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm sm:text-base lg:text-lg font-medium text-muted-foreground">Informations de compte</h4>
                          <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary/60 mt-0.5" />
                              <div className="flex-1">
                                <div className="text-sm sm:text-base font-medium">Date de création</div>
                                <div className="text-sm sm:text-base mt-1">{formatDate(selectedUser.createdAt)}</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary/60 mt-0.5" />
                              <div className="flex-1">
                                <div className="text-sm sm:text-base font-medium">Dernière connexion</div>
                                <div className="text-sm sm:text-base mt-1">{formatDate(selectedUser.lastLoginAt)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default UsersManagement; 