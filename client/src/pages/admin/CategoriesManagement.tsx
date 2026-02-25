import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Building2,
  Home,
  Castle,
  Factory,
  Mountain,
  Warehouse,
  Hotel,
  Store,
  Building,
  Truck,
  Wheat,
  PartyPopper,
  MapPin,
  Check,
  RefreshCw,
  Search,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  getDoc,
  where,
  limit,
  runTransaction,
  getDocsFromCache,
} from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FieldValue } from "firebase/firestore";

const DEFAULT_ZONES = [
  { id: "cotonou", name: "Cotonou", department: "Littoral" },
  { id: "porto-novo", name: "Porto-Novo", department: "Ouémé" },
  { id: "parakou", name: "Parakou", department: "Borgou" },
  { id: "abomey-calavi", name: "Abomey-Calavi", department: "Atlantique" },
  { id: "djougou", name: "Djougou", department: "Donga" },
  { id: "bohicon", name: "Bohicon", department: "Zou" },
  { id: "natitingou", name: "Natitingou", department: "Atacora" },
  { id: "lokossa", name: "Lokossa", department: "Mono" },
  { id: "ouidah", name: "Ouidah", department: "Atlantique" },
  { id: "kandi", name: "Kandi", department: "Alibori" },
  { id: "savalou", name: "Savalou", department: "Collines" },
  { id: "save", name: "Savè", department: "Collines" },
];

interface Category {
  id: string; // ID Firestore
  customId: string; // ID personnalisé pour référence
  name: string;
  icon: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | FieldValue;
}

interface Zone {
  id: string;
  name: string;
  department: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneDepartment, setNewZoneDepartment] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fonction pour nettoyer les doublons
  const removeDuplicates = (categories: Category[]) => {
    const uniqueCategories = new Map<string, Category>();
    const seenNames = new Set<string>();

    categories.forEach((category) => {
      const normalizedName = category.name.toLowerCase().trim();

      // Si on n'a pas encore vu ce nom de catégorie, on l'ajoute
      if (!seenNames.has(normalizedName)) {
        uniqueCategories.set(category.id, category);
        seenNames.add(normalizedName);
      }
    });

    return Array.from(uniqueCategories.values());
  };

  useEffect(() => {
    fetchCategories();
    fetchZones();
  }, []);

  // Effet pour filtrer les catégories
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
    } else {
      const query = searchQuery.toLowerCase().trim();
      setFilteredCategories(
        categories.filter((category) =>
          category.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, categories]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const categoriesRef = collection(db, "categories");
      const q = query(categoriesRef, orderBy("createdAt", "desc"));

      let querySnapshot;
      try {
        querySnapshot = await getDocsFromCache(q);
      } catch (error) {
        querySnapshot = await getDocs(q);
      }

      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        customId: doc.data().customId || doc.id,
        name: doc.data().name,
        icon: doc.data().icon,
        isActive: doc.data().isActive,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Category[];

      // Appliquer la déduplication avant de mettre à jour l'état
      const uniqueCategories = removeDuplicates(categoriesData);

      setCategories(uniqueCategories);
      setFilteredCategories(uniqueCategories);
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchZones = async () => {
    try {
      const zonesRef = collection(db, "zones");
      const q = query(zonesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const zonesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Zone[];
      setZones(zonesData);
    } catch (error) {
      console.error("Erreur lors de la récupération des zones:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les zones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const categoriesRef = collection(db, "categories");
      const customId = newCategoryName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Vérifier si la catégorie existe déjà
      const existingCategory = categories.find(
        (c) =>
          c.customId === customId ||
          c.name.toLowerCase() === newCategoryName.toLowerCase().trim()
      );

      if (existingCategory) {
        toast({
          title: "Erreur",
          description: "Cette catégorie existe déjà",
          variant: "destructive",
        });
        return;
      }

      const newCategory = {
        customId,
        name: newCategoryName.trim(),
        icon: Building2,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(categoriesRef, newCategory);

      const newCategoryWithDates = {
        id: docRef.id, // ID Firestore
        customId,
        ...newCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setCategories((prev) => [...prev, newCategoryWithDates]);
      setFilteredCategories((prev) => [...prev, newCategoryWithDates]);

      toast({
        title: "Succès",
        description: "Catégorie ajoutée avec succès",
      });
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      // Utiliser une transaction pour garantir l'atomicité de l'opération
      await runTransaction(db, async (transaction) => {
        // 1. Vérifier si la catégorie existe
        const categoryRef = doc(db, "categories", category.id);
        const categoryDoc = await transaction.get(categoryRef);

        if (!categoryDoc.exists()) {
          throw new Error("La catégorie n'existe plus dans la base de données");
        }

        // 2. Vérifier les doublons de manière simple
        const currentName = categoryDoc.data().name.toLowerCase();
        const newName = category.name.trim().toLowerCase();

        // Si le nom n'a pas changé, pas besoin de vérifier les doublons
        if (currentName !== newName) {
          // Récupérer toutes les catégories dans la transaction
          const categoriesQuery = query(collection(db, "categories"));
          const categoriesSnapshot = await getDocs(categoriesQuery);

          const isNameUsed = categoriesSnapshot.docs.some(
            (doc) =>
              doc.id !== category.id &&
              doc.data().name.toLowerCase() === newName
          );

          if (isNameUsed) {
            throw new Error(
              "Ce nom de catégorie est déjà utilisé par une autre catégorie"
            );
          }
        }

        // 3. Préparer les données de mise à jour en conservant les valeurs existantes
        const currentData = categoryDoc.data();
        const updateData = {
          name: category.name.trim(),
          // Conserver l'icône existante si aucune nouvelle n'est fournie
          icon: category.icon || currentData.icon || "Building2",
          updatedAt: serverTimestamp(),
        };

        // 4. Appliquer la mise à jour
        transaction.update(categoryRef, updateData);
      });

      // Si la transaction réussit, mettre à jour l'état local
      const updatedCategories = categories.map((cat) =>
        cat.id === category.id
          ? {
              ...cat,
              name: category.name.trim(),
              icon: category.icon || cat.icon || "Building2",
              updatedAt: new Date(),
            }
          : cat
      );

      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);

      toast({
        title: "Succès",
        description: "Catégorie mise à jour avec succès",
      });
      setEditingCategory(null);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);

      let errorMessage = "Impossible de mettre à jour la catégorie";

      if (error.message.includes("n'existe plus")) {
        errorMessage = "La catégorie n'existe plus dans la base de données";
      } else if (error.message.includes("déjà utilisé")) {
        errorMessage =
          "Ce nom de catégorie est déjà utilisé par une autre catégorie";
      } else if (error.code === "permission-denied") {
        errorMessage =
          "Vous n'avez pas les permissions nécessaires pour modifier cette catégorie";
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      // Rafraîchir les données
      await fetchCategories();
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?"))
      return;

    try {
      await deleteDoc(doc(db, "categories", categoryId));

      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      setFilteredCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryId)
      );

      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive",
      });
      fetchCategories();
    }
  };

  const handleToggleCategory = async (categoryId: string) => {
    try {
      const categoryRef = doc(db, "categories", categoryId);
      const category = categories.find((c) => c.id === categoryId);

      if (!category) return;

      const newIsActive = !category.isActive;
      await updateDoc(categoryRef, {
        isActive: newIsActive,
        updatedAt: serverTimestamp(),
      });

      const updatedCategories = categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, isActive: newIsActive, updatedAt: new Date() }
          : cat
      );

      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);

      toast({
        title: "Succès",
        description: `Catégorie ${
          newIsActive ? "activée" : "désactivée"
        } avec succès`,
      });
    } catch (error) {
      console.error("Erreur lors de la modification du statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de la catégorie",
        variant: "destructive",
      });
      fetchCategories();
    }
  };

  const handleAddZone = async () => {
    if (!newZoneName.trim() || !newZoneDepartment.trim()) return;

    try {
      const zonesRef = collection(db, "zones");
      const zoneId = newZoneName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const existingZone = zones.find((z) => z.id === zoneId);
      if (existingZone) {
        toast({
          title: "Erreur",
          description: "Cette zone existe déjà",
          variant: "destructive",
        });
        return;
      }

      await addDoc(zonesRef, {
        id: zoneId,
        name: newZoneName.trim(),
        department: newZoneDepartment.trim(),
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Succès",
        description: "Zone ajoutée avec succès",
      });
      setNewZoneName("");
      setNewZoneDepartment("");
      setIsZoneDialogOpen(false);
      fetchZones();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la zone:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la zone",
        variant: "destructive",
      });
    }
  };

  const handleUpdateZone = async (zone: Zone) => {
    try {
      const zoneRef = doc(db, "zones", zone.id);
      await updateDoc(zoneRef, {
        name: zone.name,
        department: zone.department,
        isActive: zone.isActive,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Succès",
        description: "Zone mise à jour avec succès",
      });
      setEditingZone(null);
      fetchZones();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la zone:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la zone",
        variant: "destructive",
      });
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette zone ?")) return;

    try {
      await deleteDoc(doc(db, "zones", zoneId));
      toast({
        title: "Succès",
        description: "Zone supprimée avec succès",
      });
      fetchZones();
    } catch (error) {
      console.error("Erreur lors de la suppression de la zone:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la zone",
        variant: "destructive",
      });
    }
  };

  const handleToggleZoneActive = async (zone: Zone) => {
    try {
      const zoneRef = doc(db, "zones", zone.id);
      await updateDoc(zoneRef, {
        isActive: !zone.isActive,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Succès",
        description: `Zone ${
          !zone.isActive ? "activée" : "désactivée"
        } avec succès`,
      });
      fetchZones();
    } catch (error) {
      console.error("Erreur lors de la modification du statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de la zone",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-4 sm:py-6 px-2 sm:px-4 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Gestion des Catégories
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Gérez les catégories disponibles pour les démarcheurs
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                variant="outline"
                onClick={fetchCategories}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <RefreshCw
                  className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
                />
                Actualiser
              </Button>
              <Button
                onClick={() => setIsCategoryDialogOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle catégorie
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    Catégories disponibles
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Gérez les catégories disponibles pour les démarcheurs
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une catégorie..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery
                    ? `Aucune catégorie trouvée pour "${searchQuery}"`
                    : "Aucune catégorie disponible"}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-50 rounded-lg">
                  {filteredCategories.map((category) => {
                    const Icon = category.icon || Building2;
                    const isSelected = category.isActive;
                    return (
                      <div key={category.id} className="relative group">
                        <button
                          type="button"
                          onClick={() => handleToggleCategory(category.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200",
                            isSelected
                              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              : "border-border hover:border-green-200 hover:bg-green-50/50",
                            "hover-lift ripple-effect"
                          )}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm font-medium truncate">
                            {category.name}
                          </span>
                          {isSelected && (
                            <Check className="h-4 w-4 ml-auto flex-shrink-0 text-green-600" />
                          )}
                        </button>
                        <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategory({ ...category });
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dialog pour ajouter une nouvelle catégorie */}
        <Dialog
          open={isCategoryDialogOpen}
          onOpenChange={setIsCategoryDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
              <DialogDescription>
                Entrez le nom de la nouvelle catégorie
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Entrez le nom de la catégorie"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCategoryDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
              >
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog pour modifier une catégorie */}
        <Dialog
          open={!!editingCategory}
          onOpenChange={() => setEditingCategory(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier la catégorie</DialogTitle>
              <DialogDescription>
                Modifiez les informations de la catégorie
              </DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Nom de la catégorie</Label>
                    <Input
                      id="edit-name"
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setEditingCategory(null)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={() => handleUpdateCategory(editingCategory)}
                    disabled={!editingCategory.name.trim()}
                  >
                    Enregistrer
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default CategoriesManagement;
