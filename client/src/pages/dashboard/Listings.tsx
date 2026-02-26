import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Edit,
  Eye,
  Trash,
  Plus,
  Filter,
  MoreHorizontal,
  Pencil,
  Archive,
  ArchiveRestore,
  MapPin,
} from "lucide-react";
import { Listing } from "@/types/listing";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  getDocs,
} from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";

const formatDate = (date: any) => {
  if (!date) return "Non spécifié";
  try {
    const timestamp = date instanceof Date ? date : date.toDate();
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp);
  } catch (error) {
    console.error("Erreur de formatage de date:", error);
    return "Date invalide";
  }
};

const formatPrice = (price: string | number) => {
  if (!price) return "Non spécifié";
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("fr-FR").format(numericPrice) + " FCFA";
};

const Listings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    type: string;
    activeListings: number;
    remainingListings: number;
  } | null>(null);
  const [, setLocation] = useLocation();

  // Chargement des données avec persistance et logs de débogage
  useEffect(() => {
    if (!user?.uid) return;

    console.log(
      "Début du chargement des annonces pour l'utilisateur:",
      user.uid
    );

    const listingsRef = collection(db, "listings");
    const q = query(
      listingsRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    // Configurer l'écoute en temps réel avec persistance
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log("Nombre d'annonces reçues:", snapshot.docs.length);

        const listingsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Annonce récupérée:", {
            id: doc.id,
            title: data.title,
            userId: data.userId,
            createdAt: data.createdAt?.toDate(),
          });

          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          } as Listing;
        });

        console.log("Liste complète des annonces:", listingsData);
        setListings(listingsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Erreur détaillée de synchronisation:", {
          code: error.code,
          message: error.message,
          stack: error.stack,
        });
        setIsLoading(false);
      }
    );

    // Log lors du démontage du composant
    return () => {
      console.log("Nettoyage de l'écoute des annonces");
      unsubscribe();
    };
  }, [user]);

  // Mettre à jour les annonces filtrées quand les critères changent
  useEffect(() => {
    let filtered = [...listings];

    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(
        (listing) => listing.category === filterCategory
      );
    }

    setFilteredListings(filtered);
  }, [listings, searchTerm, filterCategory]);

  // Ajouter cet useEffect pour récupérer les informations de souscription
  useEffect(() => {
    if (!user?.uid) return;

    const fetchSubscriptionInfo = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) return;

        const userData = userDoc.data();
        const subscriptionType = userData.subscriptionType || "trial";

        // Récupérer le nombre d'annonces actives
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("userId", "==", user.uid),
          where("status", "==", "active")
        );
        const snapshot = await getDocs(q);
        const activeListings = snapshot.size;

        // Définir les limites selon le forfait
        const limits = {
          trial: 5,
          basic: 10,
          premium: Infinity,
        };

        const limit = limits[subscriptionType as keyof typeof limits];
        const remainingListings =
          limit === Infinity ? "∞" : Math.max(0, limit - activeListings);

        setSubscriptionInfo({
          type: subscriptionType,
          activeListings,
          remainingListings:
            remainingListings === "∞" ? Infinity : remainingListings,
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations de souscription:",
          error
        );
      }
    };

    fetchSubscriptionInfo();
  }, [user]);

  // Fonction de suppression avec logs
  const handleDeleteListing = async () => {
    if (!listingToDelete) return;

    try {
      setIsLoading(true);
      const listingRef = doc(db, "listings", listingToDelete);
      await deleteDoc(listingRef);

      toast({
        title: "Succès",
        description: "L'annonce a été supprimée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'annonce:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'annonce",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setListingToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const handleArchiveListing = async (id: string) => {
    try {
      setIsLoading(true);
      const listingRef = doc(db, "listings", id);
      const listingDoc = await getDoc(listingRef);
      const listingData = listingDoc.data() as Listing;
      const currentStatus = listingData.status;

      await updateDoc(listingRef, {
        status: currentStatus === "archived" ? "active" : "archived",
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Succès",
        description: `L'annonce a été ${
          currentStatus === "archived" ? "désarchivée" : "archivée"
        } avec succès`,
      });
    } catch (error) {
      console.error("Erreur lors de l'archivage de l'annonce:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'annonce",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnarchiveListing = async (listingId: string) => {
    try {
      const listingRef = doc(db, "listings", listingId);
      await updateDoc(listingRef, {
        status: "active",
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Annonce réactivée",
        description: "L'annonce a été réactivée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la réactivation de l'annonce:", error);
      toast({
        title: "Erreur",
        description: "Impossible de réactiver l'annonce",
        variant: "destructive",
      });
    }
  };

  // Get unique categories for the filter
  const categories = Array.from(
    new Set(listings.map((listing) => listing.category))
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Mes annonces</h2>
            <p className="text-muted-foreground">Gérez vos annonces publiées</p>
            {subscriptionInfo && (
              <div className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium">
                  Forfait {subscriptionInfo.type}:
                </span>{" "}
                {subscriptionInfo.remainingListings === Infinity ? (
                  "Annonces illimitées"
                ) : (
                  <>
                    {subscriptionInfo.activeListings} annonce
                    {subscriptionInfo.activeListings > 1 ? "s" : ""} active
                    {subscriptionInfo.activeListings > 1 ? "s" : ""} sur{" "}
                    {subscriptionInfo.remainingListings +
                      subscriptionInfo.activeListings}{" "}
                    ({subscriptionInfo.remainingListings} restante
                    {subscriptionInfo.remainingListings > 1 ? "s" : ""})
                  </>
                )}
              </div>
            )}
          </div>
          <Button asChild>
            <Link href="/dashboard/create-listing" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle annonce
            </Link>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher une annonce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="dropdown">
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
              {filterCategory && (
                <span className="ml-2 text-xs bg-primary/20 py-0.5 px-2 rounded-full">
                  {filterCategory}
                </span>
              )}
            </Button>
            <div className="dropdown-menu absolute right-0 bg-white shadow-lg rounded-md border p-2 z-10 hidden">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                  onClick={() => setFilterCategory(null)}
                >
                  Toutes les catégories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                    onClick={() => setFilterCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filterCategory && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFilterCategory(null)}
              title="Effacer le filtre"
            >
              ×
            </Button>
          )}
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl font-medium text-muted-foreground">
              Chargement de vos annonces...
            </p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl font-medium text-muted-foreground">
              {searchTerm || filterCategory
                ? "Aucune annonce ne correspond à votre recherche"
                : "Vous n'avez pas encore créé d'annonce"}
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/create-listing">Créer une annonce</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card
                key={listing.id}
                className="hover-lift transition-all-smooth"
              >
                <div className="aspect-[16/9] bg-gray-100 relative">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Pas d'image
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {listing.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {listing.category} • {listing.location}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(listing.price)}
                      </div>
                      <Badge
                        variant={
                          listing.status === "active" ? "default" : "secondary"
                        }
                      >
                        {listing.status === "active" ? "Active" : "Archivée"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <div>{listing.location}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Créée le {formatDate(listing.createdAt)}</p>
                      <p>
                        Dernière mise à jour {formatDate(listing.updatedAt)}
                      </p>
                    </div>
                    {listing.equipment && (
                      <div className="flex flex-wrap gap-2">
                        {listing.equipment.wifi && (
                          <Badge variant="outline">WiFi</Badge>
                        )}
                        {listing.equipment.balcony && (
                          <Badge variant="outline">Balcon</Badge>
                        )}
                        {listing.equipment.pool && (
                          <Badge variant="outline">Piscine</Badge>
                        )}
                        {listing.equipment.parking && (
                          <Badge variant="outline">Parking</Badge>
                        )}
                        {listing.equipment.security && (
                          <Badge variant="outline">Sécurité</Badge>
                        )}
                        {listing.equipment.airConditioning && (
                          <Badge variant="outline">Climatisation</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/dashboard/listings/${listing.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    {listing.status === "active" ? (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleArchiveListing(listing.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleArchiveListing(listing.id)}
                      >
                        <ArchiveRestore className="h-4 w-4" />
                      </Button>
                    )}
                    <Dialog
                      open={showDeleteDialog}
                      onOpenChange={setShowDeleteDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setListingToDelete(listing.id);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Supprimer l'annonce</DialogTitle>
                          <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette annonce ?
                            Cette action est irréversible.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setListingToDelete(null);
                              setShowDeleteDialog(false);
                            }}
                          >
                            Annuler
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteListing}
                            disabled={isLoading}
                          >
                            {isLoading ? "Suppression..." : "Supprimer"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Listings;
