import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Listing } from '@/types/listing';
import { Building2, Home, Castle, Factory, Mountain, Warehouse, Hotel, Store, Building, Truck, Wheat, PartyPopper, Wifi, Coffee, Waves, MapPin, Phone, Mail, Calendar, Users, BedDouble, Sofa, CheckCircle2, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const categories = [
  { id: 'auberge', name: 'Auberge', icon: Building2 },
  { id: 'maison', name: 'Maison à louer', icon: Home },
  { id: 'manoir', name: 'Manoir', icon: Castle },
  { id: 'atelier', name: 'Atelier', icon: Factory },
  { id: 'villa', name: 'Villa', icon: Building2 },
  { id: 'chalet', name: 'Chalet', icon: Mountain },
  { id: 'loft', name: 'Loft', icon: Warehouse },
  { id: 'studio', name: 'Studio', icon: Home },
  { id: 'pavillon', name: 'Pavillon', icon: Home },
  { id: 'mobilhome', name: 'Mobil-home', icon: Home },
  { id: 'appartement-meuble', name: 'Appartement meublé', icon: Home },
  { id: 'duplex', name: 'Duplex', icon: Home },
  { id: 'penthouse', name: 'Penthouse', icon: Home },
  { id: 'chambre-hotel', name: 'Chambre d\'hôtel', icon: Hotel },
  { id: 'loft-industriel', name: 'Loft industriel', icon: Factory },
  { id: 'caravane', name: 'Caravane', icon: Home },
  { id: 'hotel-ville', name: 'Hôtel de ville', icon: Building2 },
  { id: 'parcelle-vendre', name: 'Parcelle à vendre', icon: Home },
  { id: 'residence-etudiante', name: 'Résidence étudiante', icon: Building2 },
  { id: 'famille-accueil', name: 'Famille d\'accueil', icon: Home },
  { id: 'colocation', name: 'Colocation', icon: Home },
  { id: 'internat-universitaire', name: 'Internat universitaire', icon: Building2 },
  { id: 'boutique', name: 'Boutique', icon: Store },
  { id: 'bureau', name: 'Bureau', icon: Building },
  { id: 'hangar', name: 'Hangar', icon: Warehouse },
  { id: 'entrepot', name: 'Entrepôt', icon: Truck },
  { id: 'terrain-agricole', name: 'Terrain agricole', icon: Wheat },
  { id: 'salle-reception', name: 'Salle de réception', icon: PartyPopper },
];

const roomTypes = {
  simple: 'Simple',
  double: 'Double',
  suite: 'Suite',
  studio: 'Studio'
};

const availabilityTypes = {
  immediate: 'Immédiate',
  future: 'À partir d\'une date',
  negotiable: 'À négocier',
  indisponible: 'Indisponible'
};

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id || !user?.uid) {
      console.error("ID de l'annonce ou utilisateur manquant");
      setError("Données manquantes pour charger l'annonce");
      setIsLoading(false);
      return;
    }

    const fetchListing = async () => {
      try {
        console.log("Chargement de l'annonce:", id);
        const listingRef = doc(db, "listings", id);
        const listingDoc = await getDoc(listingRef);

        if (!listingDoc.exists()) {
          console.error("Annonce non trouvée");
          setError("Annonce non trouvée");
          return;
        }

        const listingData = listingDoc.data() as Listing;
        console.log("Données de l'annonce:", listingData);

        // Vérifier si l'utilisateur est autorisé à voir cette annonce
        if (listingData.userId !== user.uid && user.role !== 'admin') {
          console.error("Accès non autorisé à l'annonce");
          setError("Vous n'êtes pas autorisé à voir cette annonce");
          return;
        }

        setListing(listingData);
        setError(null);
      } catch (error) {
        console.error("Erreur lors du chargement de l'annonce:", error);
        setError("Impossible de charger l'annonce");
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'annonce",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id, user]);

  const handleDelete = async () => {
    if (!id || !user?.uid) return;

    setIsDeleting(true);
    try {
      console.log("Suppression de l'annonce:", id);
      const listingRef = doc(db, "listings", id);
      await deleteDoc(listingRef);
      
      toast({
        title: "Annonce supprimée",
        description: "Votre annonce a été supprimée avec succès",
      });
      
      setLocation('/dashboard/listings');
    } catch (error) {
      console.error("Erreur lors de la suppression de l'annonce:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'annonce",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-destructive mb-4">{error}</h2>
            <Button onClick={() => setLocation('/dashboard/listings')}>
              Retour aux annonces
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading || !listing) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Chargement de l'annonce...</h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const category = categories.find(cat => cat.id === listing.category);
  const CategoryIcon = category?.icon || Building2;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Détails de l'annonce</h2>
            <p className="text-muted-foreground">
              Consultez et gérez les détails de votre annonce
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setLocation(`/dashboard/listings/${id}/edit`)}
            >
              Modifier
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. L'annonce sera définitivement supprimée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-6">
          {/* En-tête de l'annonce */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <CategoryIcon className="h-5 w-5" />
                <Badge variant="outline">{category?.name || 'Non catégorisé'}</Badge>
                <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                  {listing.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardTitle className="text-2xl">{listing.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center space-x-2 text-lg font-semibold text-primary mt-2">
                  {listing.price} €
                  {listing.negotiable && (
                    <span className="text-sm font-normal text-muted-foreground">(Prix négociable)</span>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{listing.description}</p>
              </CardContent>
            </Card>

            {/* Localisation */}
            <Card>
              <CardHeader>
                <CardTitle>Localisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{listing.location}</p>
                      {listing.neighborhood && (
                        <p className="text-sm text-muted-foreground">{listing.neighborhood}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <a href={`tel:${listing.contactPhone}`} className="hover:underline">
                      {listing.contactPhone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <a href={`mailto:${listing.contactEmail}`} className="hover:underline">
                      {listing.contactEmail}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disponibilité */}
            <Card>
              <CardHeader>
                <CardTitle>Disponibilité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>{availabilityTypes[listing.availability as keyof typeof availabilityTypes]}</span>
                  </div>
                  {listing.roomType && (
                    <div className="flex items-center space-x-2">
                      <BedDouble className="h-5 w-5 text-muted-foreground" />
                      <span>{roomTypes[listing.roomType as keyof typeof roomTypes]}</span>
                    </div>
                  )}
                  {listing.capacity && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>Capacité : {listing.capacity} personnes</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Caractéristiques */}
            {(listing.rooms?.bedrooms || listing.rooms?.livingRooms) && (
              <Card>
                <CardHeader>
                  <CardTitle>Caractéristiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {listing.rooms?.bedrooms && (
                      <div className="flex items-center space-x-2">
                        <BedDouble className="h-5 w-5 text-muted-foreground" />
                        <span>{listing.rooms.bedrooms} chambre(s)</span>
                      </div>
                    )}
                    {listing.rooms?.livingRooms && (
                      <div className="flex items-center space-x-2">
                        <Sofa className="h-5 w-5 text-muted-foreground" />
                        <span>{listing.rooms.livingRooms} salon(s)</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Équipements */}
            {listing.equipment && (
              <Card>
                <CardHeader>
                  <CardTitle>Équipements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      {listing.equipment.wifi ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span>WiFi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {listing.equipment.balcony ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span>Balcon</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {listing.equipment.pool ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span>Piscine</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Vues</p>
                  <p className="text-2xl font-bold">{listing.views || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Contacts</p>
                  <p className="text-2xl font-bold">{listing.contacts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Informations temporelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Créée le</p>
                  <p className="font-medium">
                    {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'Non spécifié'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                  <p className="font-medium">
                    {listing.updatedAt ? new Date(listing.updatedAt).toLocaleDateString() : 'Non spécifié'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ListingDetails; 