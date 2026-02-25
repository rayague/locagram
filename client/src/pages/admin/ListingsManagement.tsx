import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, CheckCircle2, XCircle, AlertCircle, Eye, RefreshCw, Building2, MapPin, Calendar, User, Tag, DollarSign, Phone, Mail } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Image as ImageIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown, Filter, X } from 'lucide-react';
import { Users } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'active' | 'inactive' | 'pending' | 'sold';
  category: string;
  location: string;
  userId: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
  negotiable?: boolean;
  availability?: 'immediate' | 'future';
  neighborhood?: string;
  contactPhone?: string;
  contactEmail?: string;
  equipment?: {
    wifi?: boolean;
    balcony?: boolean;
    pool?: boolean;
    parking?: boolean;
    security?: boolean;
    airConditioning?: boolean;
  };
  roomType?: 'simple' | 'double' | 'suite';
  rooms?: {
    bedrooms?: string;
    bathrooms?: string;
    livingRooms?: string;
    kitchens?: string;
  };
  capacity?: number;
}

const ListingsManagement = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Listing['status'] | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    // Extraire les catégories uniques des annonces
    const uniqueCategories = Array.from(new Set(listings.map(listing => listing.category)));
    setCategories(uniqueCategories);
  }, [listings]);

  useEffect(() => {
    filterListings();
  }, [searchQuery, listings, statusFilter, categoryFilter, priceRange]);

  const loadListings = async () => {
    try {
      const listingsRef = collection(db, 'listings');
      const listingsSnapshot = await getDocs(listingsRef);
      const listingsData = listingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Listing[];

      setListings(listingsData);
      setFilteredListings(listingsData);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les annonces",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterListings = () => {
    const query = searchQuery.toLowerCase();
    let filtered = listings.filter(listing => {
      const matchesSearch = 
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.category.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query) ||
        listing.userName.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || listing.category === categoryFilter;
      const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];

      return matchesSearch && matchesStatus && matchesCategory && matchesPrice;
    });

    setFilteredListings(filtered);
  };

  const updateListingStatus = async (listingId: string, newStatus: Listing['status']) => {
    try {
      const listingRef = doc(db, 'listings', listingId);
      await updateDoc(listingRef, { 
        status: newStatus,
        updatedAt: new Date()
      });
      
      setListings(listings.map(listing => 
        listing.id === listingId ? { ...listing, status: newStatus, updatedAt: new Date() } : listing
      ));

      toast({
        title: "Statut mis à jour",
        description: `Le statut de l'annonce a été modifié avec succès`,
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

  const getStatusBadge = (status: Listing['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      sold: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status === 'sold' ? 'Vendu' : 
         status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriceRange([0, 1000000]);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]] as [number, number]);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold">Gestion des Annonces</CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2">
                      Gérez les annonces de la plateforme, leurs statuts et leurs visibilités
                    </CardDescription>
                  </div>
                  <Button onClick={loadListings} variant="outline" className="bg-white/50 backdrop-blur-sm">
                    <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                    Actualiser
                  </Button>
                </div>

                {/* Barre de recherche et filtres */}
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher par titre, description, catégorie, localisation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full bg-white/50 backdrop-blur-sm h-10"
                      />
                    </div>
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={cn(
                            "bg-white/50 backdrop-blur-sm h-10",
                            (statusFilter !== 'all' || categoryFilter !== 'all' || priceRange[0] > 0 || priceRange[1] < 1000000) && 
                            "border-primary text-primary"
                          )}
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Filtres
                          {(statusFilter !== 'all' || categoryFilter !== 'all' || priceRange[0] > 0 || priceRange[1] < 1000000) && (
                            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                              {[
                                statusFilter !== 'all' && 'Statut',
                                categoryFilter !== 'all' && 'Catégorie',
                                (priceRange[0] > 0 || priceRange[1] < 1000000) && 'Prix'
                              ].filter(Boolean).length}
                            </Badge>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-4" align="end">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-base">Filtres</h4>
                            {(statusFilter !== 'all' || categoryFilter !== 'all' || priceRange[0] > 0 || priceRange[1] < 1000000) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="h-8 px-2 text-xs"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Réinitialiser
                              </Button>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Statut</Label>
                            <Select value={statusFilter} onValueChange={(value: Listing['status'] | 'all') => setStatusFilter(value)}>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Sélectionner un statut" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="active">Actif</SelectItem>
                                <SelectItem value="inactive">Inactif</SelectItem>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="sold">Vendu</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Catégorie</Label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Sélectionner une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Toutes les catégories</SelectItem>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Prix</Label>
                            <div className="px-2">
                              <Slider
                                min={0}
                                max={1000000}
                                step={1000}
                                value={[priceRange[0], priceRange[1]]}
                                onValueChange={handlePriceRangeChange}
                                className="py-4"
                              />
                              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                                <span>{formatPrice(priceRange[0])}</span>
                                <span>{formatPrice(priceRange[1])}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Affichage des filtres actifs */}
                  {(statusFilter !== 'all' || categoryFilter !== 'all' || priceRange[0] > 0 || priceRange[1] < 1000000) && (
                    <div className="flex flex-wrap gap-2">
                      {statusFilter !== 'all' && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary px-2 py-1">
                          Statut: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                          <button
                            onClick={() => setStatusFilter('all')}
                            className="ml-1 hover:text-primary/80"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {categoryFilter !== 'all' && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary px-2 py-1">
                          Catégorie: {categoryFilter}
                          <button
                            onClick={() => setCategoryFilter('all')}
                            className="ml-1 hover:text-primary/80"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary px-2 py-1">
                          Prix: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                          <button
                            onClick={() => setPriceRange([0, 1000000])}
                            className="ml-1 hover:text-primary/80"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchQuery 
                    ? `Aucune annonce trouvée pour "${searchQuery}"`
                    : 'Aucune annonce disponible'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  {filteredListings.map((listing) => (
                    <Card 
                      key={listing.id} 
                      className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50 bg-gradient-to-br from-white to-gray-50/50"
                    >
                      <CardContent className="p-4 sm:p-6 lg:p-8">
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4">
                          {getStatusBadge(listing.status)}
                        </div>

                        <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                          <div className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-4 ring-primary/5 flex-shrink-0">
                            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg lg:text-xl truncate">{listing.title}</h3>
                            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">{formatPrice(listing.price)}</p>
                          </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                          <div className="space-y-2 sm:space-y-3 lg:space-y-4 text-xs sm:text-sm lg:text-base">
                            <div className="flex items-center gap-2 text-muted-foreground bg-gray-50/50 p-2 sm:p-3 lg:p-4 rounded-lg">
                              <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary/60 flex-shrink-0" />
                              <span className="truncate">{listing.category}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground bg-gray-50/50 p-2 sm:p-3 lg:p-4 rounded-lg">
                              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary/60 flex-shrink-0" />
                              <span className="truncate">{listing.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground bg-gray-50/50 p-2 sm:p-3 lg:p-4 rounded-lg">
                              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary/60 flex-shrink-0" />
                              <span className="truncate">{listing.userName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground bg-gray-50/50 p-2 sm:p-3 lg:p-4 rounded-lg">
                              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary/60 flex-shrink-0" />
                              <span className="truncate">Créée le: {formatDate(listing.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center justify-between gap-2 pt-3 sm:pt-4 lg:pt-5 border-t border-border/50">
                          <div className="flex gap-1.5 sm:gap-2 lg:gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm lg:text-base gap-1.5 sm:gap-2 hover:bg-primary/5 hover:text-primary"
                              onClick={() => {
                                setSelectedListing(listing);
                                setIsListingDialogOpen(true);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                              Voir l'annonce
                            </Button>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 hover:bg-primary/5">
                                <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => updateListingStatus(listing.id, 'active')}
                                disabled={listing.status === 'active'}
                                className="gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Activer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateListingStatus(listing.id, 'inactive')}
                                disabled={listing.status === 'inactive'}
                                className="gap-2"
                              >
                                <XCircle className="h-4 w-4" />
                                Désactiver
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateListingStatus(listing.id, 'sold')}
                                disabled={listing.status === 'sold'}
                                className="gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Marquer comme vendu
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
      </div>

      <Dialog open={isListingDialogOpen} onOpenChange={setIsListingDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[1200px] h-[95vh] overflow-hidden p-0 flex flex-col">
          <div className="sticky top-0 z-10 bg-background border-b">
            <DialogHeader className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl sm:text-2xl font-semibold">Détails de l'Annonce</DialogTitle>
                  <DialogDescription className="text-sm sm:text-base mt-1">
                    Informations complètes de l'annonce
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-10 sm:w-10"
                  onClick={() => setIsListingDialogOpen(false)}
                >
                  <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>
            </DialogHeader>
          </div>

          {selectedListing && (
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="divide-y divide-border">
                  <div className="p-4 sm:p-6 bg-gradient-to-r from-primary/5 to-primary/10">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                      <div className="relative">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-4 ring-primary/5">
                          <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0">
                          {getStatusBadge(selectedListing.status)}
                        </div>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-semibold">{selectedListing.title}</h3>
                        <p className="text-base sm:text-lg font-medium text-primary mt-1">
                          {formatPrice(selectedListing.price)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap break-words">{selectedListing.description}</p>
                        </div>
                      </div>

                      {selectedListing.images && selectedListing.images.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">Images</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {selectedListing.images.map((image, index) => (
                              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted/50 group relative">
                                <img
                                  src={image}
                                  alt={`Image ${index + 1} de l'annonce`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                                    onClick={() => window.open(image, '_blank')}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">Informations principales</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                              <Tag className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Catégorie</div>
                                <div className="text-sm mt-0.5 break-words">{selectedListing.category}</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                              <MapPin className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Localisation</div>
                                <div className="text-sm mt-0.5 break-words">{selectedListing.location}</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                              <User className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Propriétaire</div>
                                <div className="text-sm mt-0.5 break-words">{selectedListing.userName}</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                              <DollarSign className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Prix</div>
                                <div className="text-sm mt-0.5">
                                  {formatPrice(selectedListing.price)}
                                  {selectedListing.negotiable !== undefined && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      ({selectedListing.negotiable ? 'Négociable' : 'Non négociable'})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">Caractéristiques</h4>
                          <div className="space-y-3">
                            {selectedListing.availability && (
                              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Calendar className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">Disponibilité</div>
                                  <div className="text-sm mt-0.5">
                                    {selectedListing.availability === 'immediate' ? 'Immédiate' : 'Future'}
                                  </div>
                                </div>
                              </div>
                            )}
                            {selectedListing.neighborhood && (
                              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <MapPin className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">Quartier</div>
                                  <div className="text-sm mt-0.5 break-words">{selectedListing.neighborhood}</div>
                                </div>
                              </div>
                            )}
                            {selectedListing.roomType && (
                              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Building2 className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">Type de chambre</div>
                                  <div className="text-sm mt-0.5">
                                    {selectedListing.roomType === 'simple' ? 'Simple' : 
                                     selectedListing.roomType === 'double' ? 'Double' : 'Suite'}
                                  </div>
                                </div>
                              </div>
                            )}
                            {selectedListing.rooms && (
                              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Building2 className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">Pièces</div>
                                  <div className="text-sm mt-0.5 space-y-1">
                                    {selectedListing.rooms.bedrooms && (
                                      <div>Chambres: {selectedListing.rooms.bedrooms}</div>
                                    )}
                                    {selectedListing.rooms.bathrooms && (
                                      <div>Salles de bain: {selectedListing.rooms.bathrooms}</div>
                                    )}
                                    {selectedListing.rooms.livingRooms && (
                                      <div>Salons: {selectedListing.rooms.livingRooms}</div>
                                    )}
                                    {selectedListing.rooms.kitchens && (
                                      <div>Cuisines: {selectedListing.rooms.kitchens}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            {selectedListing.capacity && (
                              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Users className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">Capacité</div>
                                  <div className="text-sm mt-0.5">{selectedListing.capacity} personnes</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedListing.equipment && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground">Équipements</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {Object.entries(selectedListing.equipment).map(([key, value]) => (
                                value && (
                                  <div key={key} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                                    <Check className="h-4 w-4 text-primary/60" />
                                    <span className="text-sm">
                                      {key === 'wifi' ? 'Wi-Fi' :
                                       key === 'balcony' ? 'Balcon' :
                                       key === 'pool' ? 'Piscine' :
                                       key === 'parking' ? 'Parking' :
                                       key === 'security' ? 'Sécurité' :
                                       key === 'airConditioning' ? 'Climatisation' : key}
                                    </span>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">Contact</h4>
                          <div className="space-y-3">
                            {selectedListing.contactPhone && (
                              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Phone className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">Téléphone</div>
                                  <div className="text-sm mt-0.5 break-words">{selectedListing.contactPhone}</div>
                                </div>
                              </div>
                            )}
                            {selectedListing.contactEmail && (
                              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Mail className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">Email</div>
                                  <div className="text-sm mt-0.5 break-words">{selectedListing.contactEmail}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">Dates</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                              <Calendar className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Date de création</div>
                                <div className="text-sm mt-0.5">{formatDate(selectedListing.createdAt)}</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                              <Calendar className="h-5 w-5 text-primary/60 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Dernière mise à jour</div>
                                <div className="text-sm mt-0.5">{formatDate(selectedListing.updatedAt)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ListingsManagement; 