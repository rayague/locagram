import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  Search, MoreVertical, CheckCircle2, XCircle, AlertCircle,
  User, Phone, Mail, MapPin, Calendar, Eye, MessageCircle,
  Tag, Globe, Clock, ChevronLeft, ChevronRight, RefreshCw,
  Users, UserCheck, UserX, Timer,
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface User {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'demarcheur';
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'rejected';
  phone?: string;
  zone?: string;
  country?: string;
  categories?: string[];
  createdAt?: Date;
  lastLoginAt?: Date;
}

type StatusFilter = 'all' | 'pending' | 'active' | 'suspended' | 'inactive' | 'rejected';

const PAGE_SIZE = 25;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  active:    { label: 'Actif',      color: 'text-green-700',  bg: 'bg-green-100',  icon: CheckCircle2 },
  inactive:  { label: 'Inactif',    color: 'text-gray-600',   bg: 'bg-gray-100',   icon: XCircle },
  pending:   { label: 'En attente', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: AlertCircle },
  suspended: { label: 'Suspendu',   color: 'text-red-700',    bg: 'bg-red-100',    icon: XCircle },
  rejected:  { label: 'Rejeté',     color: 'text-red-600',    bg: 'bg-red-50',     icon: XCircle },
};

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => { loadUsers(); }, []);
  useEffect(() => { setPage(1); }, [searchQuery, statusFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(usersQuery);
      const data = snapshot.docs.map(d => ({
        uid: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate(),
        lastLoginAt: d.data().lastLoginAt?.toDate(),
      })) as User[];
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast({ title: 'Erreur', description: 'Impossible de charger les utilisateurs', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: User['status']) => {
    try {
      await updateDoc(doc(db, 'users', userId), { status: newStatus });
      setUsers(prev => prev.map(u => u.uid === userId ? { ...u, status: newStatus } : u));
      if (selectedUser?.uid === userId) setSelectedUser(prev => prev ? { ...prev, status: newStatus } : prev);
      toast({ title: 'Statut mis à jour', description: 'Le statut a été modifié avec succès' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le statut', variant: 'destructive' });
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status] ?? { label: status ?? 'Inconnu', color: 'text-gray-600', bg: 'bg-gray-100', icon: AlertCircle };
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
        <Icon className="h-3 w-3" />
        {cfg.label}
      </span>
    );
  };

  const filtered = users.filter(u => {
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.zone?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = {
    all:       users.length,
    pending:   users.filter(u => u.status === 'pending').length,
    active:    users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    inactive:  users.filter(u => u.status === 'inactive').length,
    rejected:  users.filter(u => u.status === 'rejected').length,
  };

  const STAT_CARDS = [
    { key: 'all',       label: 'Total',      icon: Users,      color: 'text-blue-600',   bg: 'bg-blue-50' },
    { key: 'pending',   label: 'En attente', icon: Timer,      color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { key: 'active',    label: 'Actifs',      icon: UserCheck,  color: 'text-green-600',  bg: 'bg-green-50' },
    { key: 'suspended', label: 'Suspendus',   icon: UserX,      color: 'text-red-600',    bg: 'bg-red-50' },
  ] as const;

  const FILTER_TABS: { key: StatusFilter; label: string }[] = [
    { key: 'all',       label: 'Tous' },
    { key: 'pending',   label: 'En attente' },
    { key: 'active',    label: 'Actifs' },
    { key: 'suspended', label: 'Suspendus' },
    { key: 'inactive',  label: 'Inactifs' },
    { key: 'rejected',  label: 'Rejetés' },
  ];

  return (
    <AdminLayout>
      <div className="mx-auto py-4 px-3 sm:px-6 max-w-7xl space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Utilisateurs</h1>
            <p className="text-sm text-muted-foreground">{users.length} utilisateur{users.length > 1 ? 's' : ''} enregistrés</p>
          </div>
          <Button onClick={loadUsers} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>

        {/* Stat cards — cliquables */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STAT_CARDS.map(({ key, label, icon: Icon, color, bg }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`rounded-lg border p-3 text-left transition-all hover:shadow-md ${
                statusFilter === key ? 'border-primary ring-1 ring-primary shadow-sm' : 'border-border bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground font-medium">{label}</span>
                <div className={`h-7 w-7 rounded-full ${bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
              </div>
              <div className={`text-2xl font-bold ${color}`}>{counts[key]}</div>
            </button>
          ))}
        </div>

        {/* Barre de recherche + onglets de filtre */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Nom, email, téléphone, zone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {FILTER_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  statusFilter === key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                {label}
                {key !== 'all' && counts[key] > 0 && (
                  <span className={`ml-1 ${statusFilter === key ? 'opacity-75' : 'text-gray-400'}`}>
                    ({counts[key]})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <Card className="border shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Aucun utilisateur ne correspond à votre recherche'
                  : 'Aucun utilisateur disponible'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50/80">
                      <th className="text-left px-4 py-3 font-medium text-gray-500 w-8">#</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Utilisateur</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Téléphone</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Zone</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Inscription</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.map((user, idx) => (
                      <tr key={user.uid} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {(page - 1) * PAGE_SIZE + idx + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate max-w-[150px]">{user.name || '—'}</div>
                              <div className="text-xs text-gray-400 truncate max-w-[150px]">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-gray-500 text-xs">{user.phone || '—'}</td>
                        <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">{user.zone || '—'}</td>
                        <td className="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs">{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-0.5">
                            <Button
                              variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-primary"
                              title="Voir le profil"
                              onClick={() => { setSelectedUser(user); setIsUserDialogOpen(true); }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {user.phone && (
                              <Button
                                variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-green-600"
                                title="WhatsApp"
                                onClick={() => window.open(`https://wa.me/${user.phone!.replace(/[\s\-\(\)]/g, '')}`, '_blank')}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem onClick={() => updateUserStatus(user.uid, 'active')} disabled={user.status === 'active'} className="gap-2 text-green-700">
                                  <CheckCircle2 className="h-4 w-4" /> Approuver / Activer
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateUserStatus(user.uid, 'rejected')} disabled={user.status === 'rejected'} className="gap-2 text-red-600">
                                  <XCircle className="h-4 w-4" /> Rejeter
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateUserStatus(user.uid, 'suspended')} disabled={user.status === 'suspended'} className="gap-2 text-orange-600">
                                  <AlertCircle className="h-4 w-4" /> Suspendre
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateUserStatus(user.uid, 'inactive')} disabled={user.status === 'inactive'} className="gap-2 text-gray-600">
                                  <XCircle className="h-4 w-4" /> Désactiver
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && filtered.length > PAGE_SIZE && (
              <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50/50">
                <span className="text-xs text-gray-500">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | string)[]>((acc, p, i, arr) => {
                      if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) acc.push('…');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '…'
                        ? <span key={`e${i}`} className="px-1 text-gray-400 text-xs">…</span>
                        : <Button key={p} variant={page === p ? 'default' : 'outline'} size="icon" className="h-7 w-7 text-xs" onClick={() => setPage(p as number)}>{p}</Button>
                    )}
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog profil */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profil utilisateur</DialogTitle>
            <DialogDescription>Informations détaillées</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              {/* Avatar + nom */}
              <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-base">{selectedUser.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.role === 'admin' ? 'Administrateur' : 'Démarcheur'}</div>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
              </div>

              {/* Infos */}
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
                  <Mail className="h-4 w-4 text-primary/60 flex-shrink-0" />
                  <span className="break-all">{selectedUser.email}</span>
                </div>
                {selectedUser.phone && (
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
                    <Phone className="h-4 w-4 text-primary/60 flex-shrink-0" />
                    <span className="flex-1">{selectedUser.phone}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-green-600 hover:text-green-700"
                      onClick={() => window.open(`https://wa.me/${selectedUser.phone!.replace(/[\s\-\(\)]/g, '')}`, '_blank')}>
                      <MessageCircle className="h-3 w-3 mr-1" /> WhatsApp
                    </Button>
                  </div>
                )}
                {selectedUser.zone && (
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
                    <MapPin className="h-4 w-4 text-primary/60" />
                    <span>{selectedUser.zone}</span>
                  </div>
                )}
                {selectedUser.country && (
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
                    <Globe className="h-4 w-4 text-primary/60" />
                    <span>{selectedUser.country}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
                  <Calendar className="h-4 w-4 text-primary/60" />
                  <span>Inscrit le {formatDate(selectedUser.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
                  <Clock className="h-4 w-4 text-primary/60" />
                  <span>Dernière connexion : {formatDate(selectedUser.lastLoginAt)}</span>
                </div>
              </div>

              {/* Catégories */}
              {selectedUser.categories && selectedUser.categories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <Tag className="h-4 w-4" /> Catégories
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUser.categories.map((c, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-primary/5 text-primary">{c}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions rapides */}
              <div className="flex gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" className="gap-1 text-green-700 border-green-200 hover:bg-green-50 flex-1"
                  onClick={() => updateUserStatus(selectedUser.uid, 'active')}
                  disabled={selectedUser.status === 'active'}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approuver
                </Button>
                <Button size="sm" variant="outline" className="gap-1 text-red-600 border-red-200 hover:bg-red-50 flex-1"
                  onClick={() => updateUserStatus(selectedUser.uid, 'rejected')}
                  disabled={selectedUser.status === 'rejected'}>
                  <XCircle className="h-3.5 w-3.5" /> Rejeter
                </Button>
                <Button size="sm" variant="outline" className="gap-1 text-orange-600 border-orange-200 hover:bg-orange-50 flex-1"
                  onClick={() => updateUserStatus(selectedUser.uid, 'suspended')}
                  disabled={selectedUser.status === 'suspended'}>
                  <AlertCircle className="h-3.5 w-3.5" /> Suspendre
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersManagement;
