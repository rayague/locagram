import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  ImagePlus,
  MapPin,
  Upload,
  Loader2,
  Save,
  Image as ImageIcon,
  Building,
  DollarSign,
  Tag,
  X,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Liste des 77 communes du Bénin
const beninCommunes = [
  "Abomey",
  "Abomey-Calavi",
  "Adjarra",
  "Adjohoun",
  "Agbangnizoun",
  "Aguégués",
  "Akpro-Missérété",
  "Allada",
  "Aplahoué",
  "Avrankou",
  "Banikoara",
  "Bassila",
  "Bembèrèkè",
  "Bohicon",
  "Boukoumbé",
  "Cobly",
  "Comè",
  "Cotonou",
  "Covè",
  "Dangbo",
  "Dassa-Zoumè",
  "Djougou",
  "Dogbo",
  "Djakotomey",
  "Djidja",
  "Glazoué",
  "Grand-Popo",
  "Houéyogbé",
  "Ifangni",
  "Kandi",
  "Karimama",
  "Kérou",
  "Kétou",
  "Kouandé",
  "Kpomassè",
  "Lalo",
  "Lokossa",
  "Malanville",
  "Matéri",
  "Natitingou",
  "Ndali",
  "N'Dali",
  "Nikki",
  "Ouidah",
  "Ouèssè",
  "Ouinhi",
  "Parakou",
  "Pèrèrè",
  "Pobè",
  "Porto-Novo",
  "Sakété",
  "Savalou",
  "Savè",
  "Ségbana",
  "Sèmè-Podji",
  "Sinendé",
  "Sô-Ava",
  "Tchaourou",
  "Toffo",
  "Toviklin",
  "Tanguiéta",
  "Tori-Bossito",
  "Toucountouna",
  "Zagnanado",
  "Za-Kpota",
  "Zè",
  "Zogbodomey",
];

const CreateListing = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userCategories, setUserCategories] = useState<string[]>([]);
  const [customLocation, setCustomLocation] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    negotiable: true,
    location: "",
    images: [] as File[],
    availability: "immediate",
    neighborhood: "",
    contactPhone: "",
    contactEmail: "",
    equipment: {
      wifi: false,
      balcony: false,
      pool: false,
      parking: false,
      security: false,
      airConditioning: false,
    },
    roomType: "simple",
    rooms: {
      bedrooms: "",
      bathrooms: "",
      livingRooms: "",
      kitchens: "",
    },
    capacity: "",
    status: "active" as const,
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Fetch user's selected categories
  useEffect(() => {
    if (!user?.uid) return;

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        // S'assurer que les catégories sont bien un tableau
        const categories = Array.isArray(userData.categories)
          ? userData.categories
          : [];
        setUserCategories(categories);
        console.log("Catégories de l'utilisateur:", categories); // Pour le débogage
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch user's listings in real-time
  useEffect(() => {
    if (!user?.uid) return;

    const listingsRef = collection(db, "listings");
    const q = query(
      listingsRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const listings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Annonces de l'utilisateur:", listings);
      },
      (error) => {
        console.error("Erreur lors de la récupération des annonces:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "location" && value === "custom") {
      setCustomLocation("");
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCustomLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomLocation(e.target.value);
    setFormData({
      ...formData,
      location: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
      ];

      // Validate total number of images
      if (formData.images.length + newFiles.length > 5) {
        toast({
          title: "Limite d'images atteinte",
          description: "Vous pouvez ajouter jusqu'à 5 images maximum",
          variant: "destructive",
        });
        return;
      }

      // Validate each file
      for (const file of newFiles) {
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: "Format non supporté",
            description: `Le format ${file.type} n'est pas supporté. Formats acceptés: JPG, PNG, GIF, WEBP, BMP, TIFF`,
            variant: "destructive",
          });
          return;
        }
        if (file.size > maxFileSize) {
          toast({
            title: "Fichier trop volumineux",
            description: `L'image ${file.name} est trop volumineuse. Taille maximale: 5MB`,
            variant: "destructive",
          });
          return;
        }
      }

      // Create preview URLs
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));

      setFormData({
        ...formData,
        images: [...formData.images, ...newFiles],
      });

      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    // Create new arrays without the removed image
    const newImages = formData.images.filter((_, i) => i !== index);

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      images: newImages,
    });

    setImagePreviewUrls(newPreviewUrls);
  };

  // Ajout des fonctions de gestion des changements
  const handleRoomsChange = (
    name: keyof typeof formData.rooms,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [name]: value,
      },
    }));
  };

  const handleEquipmentChange = (
    name: keyof typeof formData.equipment,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [name]: checked,
      },
    }));
  };

  // Fonction centralisée pour vérifier les permissions
  const checkUserPermissions = async (): Promise<{
    canCreate: boolean;
    canUpload: boolean;
    message?: string;
  }> => {
    if (!user) {
      return {
        canCreate: false,
        canUpload: false,
        message: "Vous devez être connecté",
      };
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        return {
          canCreate: false,
          canUpload: false,
          message: "Impossible de récupérer vos informations",
        };
      }

      const userData = userDoc.data();

      // Exception pour l'utilisateur demo
      if (user.email === "demo02@example.com") {
        return { canCreate: true, canUpload: true };
      }

      // Vérifier le statut de l'utilisateur
      if (userData.status !== "active") {
        return {
          canCreate: false,
          canUpload: false,
          message:
            "Votre compte n'est pas actif. Veuillez renouveler votre abonnement.",
        };
      }

      // Vérifier si l'utilisateur a des catégories sélectionnées
      const categories = Array.isArray(userData.categories)
        ? userData.categories
        : [];
      if (categories.length === 0) {
        return {
          canCreate: false,
          canUpload: true,
          message:
            "Vous devez sélectionner au moins une catégorie dans vos préférences",
        };
      }

      // Vérifier le nombre d'annonces en fonction du forfait
      const subscriptionType = userData.subscriptionType || "trial";
      const listingsCount = userData.listingsCount || 0;

      // Récupérer le nombre d'annonces actives
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userId", "==", user.uid),
        where("status", "==", "active")
      );
      const snapshot = await getDocs(q);
      const activeListingsCount = snapshot.size;

      // Vérifier les limites selon le forfait
      const limits = {
        trial: 5,
        basic: 10,
        premium: Infinity,
      };

      if (
        activeListingsCount >= limits[subscriptionType as keyof typeof limits]
      ) {
        return {
          canCreate: false,
          canUpload: true,
          message: `Vous avez atteint la limite d'annonces pour votre forfait ${subscriptionType}. Veuillez mettre à niveau votre abonnement pour créer plus d'annonces.`,
        };
      }

      return { canCreate: true, canUpload: true };
    } catch (error: any) {
      console.error("Erreur lors de la vérification des permissions:", error);
      return {
        canCreate: false,
        canUpload: false,
        message: "Erreur lors de la vérification des permissions",
      };
    }
  };

  // Upload images to Firebase Storage
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!user) {
      throw new Error("Vous devez être connecté pour télécharger des images");
    }

    // Vérifier les permissions
    const { canUpload, message } = await checkUserPermissions();
    if (!canUpload) {
      throw new Error(
        message || "Vous n'avez pas la permission de télécharger des images"
      );
    }

    const uploadPromises = files.map(async (file) => {
      try {
        // Vérification du type de fichier
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/bmp",
          "image/tiff",
        ];

        if (!allowedTypes.includes(file.type)) {
          throw new Error(
            "Format de fichier non supporté. Formats acceptés: JPG, PNG, GIF, WEBP, BMP, TIFF"
          );
        }

        // Vérification de la taille
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("L'image ne doit pas dépasser 5MB");
        }

        // Créer un nom de fichier unique
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.name.split(".").pop();
        const fileName = `${timestamp}_${randomString}.${fileExtension}`;

        // Créer une référence au fichier dans Firebase Storage
        const storageRef = ref(
          getStorage(),
          `listings/${user.uid}/${fileName}`
        );

        // Définir les métadonnées
        const metadata = {
          contentType: file.type,
          customMetadata: {
            uploadedBy: user.uid,
            uploadedAt: new Date().toISOString(),
            originalName: file.name,
          },
        };

        // Télécharger le fichier
        const snapshot = await uploadBytes(storageRef, file, metadata);

        // Obtenir l'URL de téléchargement
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
      } catch (error: any) {
        console.error("Erreur lors du téléchargement:", error);
        throw new Error(
          error.message || "Erreur lors du téléchargement de l'image"
        );
      }
    });

    try {
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error: any) {
      console.error("Erreur lors du téléchargement des images:", error);
      throw new Error(
        error.message || "Erreur lors du téléchargement des images"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Vérifier les permissions globales
      const { canCreate, message } = await checkUserPermissions();
      if (!canCreate) {
        throw new Error(
          message || "Vous n'avez pas la permission de créer une annonce"
        );
      }

      // Vérifier si la catégorie est autorisée (sauf pour demo)
      if (user?.email !== "demo02@example.com") {
        const userDoc = await getDoc(doc(db, "users", user!.uid));
        const userData = userDoc.data();
        const categories = Array.isArray(userData?.categories)
          ? userData.categories
          : [];

        if (!categories.includes(formData.category)) {
          throw new Error(
            "Vous n'avez pas sélectionné cette catégorie dans vos préférences"
          );
        }
      }

      let imageUrls: string[] = [];
      if (formData.images.length > 0) {
        try {
          imageUrls = await uploadImages(formData.images);
          if (imageUrls.length === 0) {
            throw new Error("Aucune image n'a pu être téléchargée");
          }
        } catch (error: any) {
          throw new Error(
            error.message || "Impossible de télécharger les images"
          );
        }
      }

      // Créer l'annonce
      const listingData = {
        userId: user!.uid,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price ? Number(formData.price) : null,
        negotiable: formData.negotiable,
        location: formData.location,
        images: imageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        contacts: 0,
        status: "active",
        availability: formData.availability,
        neighborhood: formData.neighborhood,
        equipment: formData.equipment,
        roomType: formData.roomType,
        rooms: formData.rooms,
        capacity: formData.capacity ? Number(formData.capacity) : null,
      };

      // Ajouter l'annonce à Firestore
      const docRef = await addDoc(collection(db, "listings"), listingData);

      // Mettre à jour le compteur d'annonces de l'utilisateur
      const userDoc = await getDoc(doc(db, "users", user!.uid));
      const userData = userDoc.data();
      await updateDoc(doc(db, "users", user!.uid), {
        listingsCount: (userData?.listingsCount || 0) + 1,
        lastListingAt: serverTimestamp(),
      });

      toast({
        title: "Annonce créée",
        description: "Votre annonce a été publiée avec succès",
      });

      setLocation("/dashboard/listings");
    } catch (error: any) {
      console.error("Erreur lors de la création de l'annonce:", error);
      toast({
        title: "Erreur",
        description:
          error.message || "Impossible de créer l'annonce. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Créer une annonce
          </h2>
          <p className="text-muted-foreground">
            Remplissez les informations pour créer une nouvelle annonce
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <Card className="glass-effect hover-lift transition-all-smooth">
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
              <CardDescription>
                Informations essentielles de votre annonce
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                  placeholder="Titre attractif pour votre annonce"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="hover-glow focus:ring-2 focus:ring-green-500 transition-all-smooth"
                  placeholder="Description détaillée de votre annonce"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                  >
                    <SelectTrigger className="hover-glow focus:ring-2 focus:ring-green-500">
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {userCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Prix *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      className="pl-9 hover-glow focus:ring-2 focus:ring-green-500"
                      placeholder="Prix en FCFA"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      id="negotiable"
                      checked={formData.negotiable}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          negotiable: checked,
                        }))
                      }
                    />
                    <Label htmlFor="negotiable">Prix négociable</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localisation */}
          <Card className="glass-effect hover-lift transition-all-smooth">
            <CardHeader>
              <CardTitle>Localisation</CardTitle>
              <CardDescription>Informations sur l'emplacement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Ville *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) =>
                      handleSelectChange("location", value)
                    }
                  >
                    <SelectTrigger className="hover-glow focus:ring-2 focus:ring-green-500">
                      <SelectValue placeholder="Sélectionnez une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      {beninCommunes.map((commune) => (
                        <SelectItem key={commune} value={commune}>
                          {commune}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Quartier</Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    className="hover-glow focus:ring-2 focus:ring-green-500"
                    placeholder="Nom du quartier"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Caractéristiques */}
          <Card className="glass-effect hover-lift transition-all-smooth">
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
              <CardDescription>
                Détails sur le type de logement et ses équipements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomType">Type de logement *</Label>
                  <Select
                    value={formData.roomType}
                    onValueChange={(value) =>
                      handleSelectChange("roomType", value)
                    }
                  >
                    <SelectTrigger className="hover-glow focus:ring-2 focus:ring-green-500">
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Chambre simple</SelectItem>
                      <SelectItem value="double">Chambre double</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="maison">Maison</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Disponibilité *</Label>
                  <Select
                    value={formData.availability}
                    onValueChange={(value) =>
                      handleSelectChange("availability", value)
                    }
                  >
                    <SelectTrigger className="hover-glow focus:ring-2 focus:ring-green-500">
                      <SelectValue placeholder="Sélectionnez une disponibilité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immédiate</SelectItem>
                      <SelectItem value="next_month">
                        Dès le mois prochain
                      </SelectItem>
                      <SelectItem value="custom">Date spécifique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre de pièces</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bedrooms" className="text-sm">
                        Chambres
                      </Label>
                      <Input
                        id="bedrooms"
                        name="rooms.bedrooms"
                        type="number"
                        value={formData.rooms.bedrooms}
                        onChange={(e) =>
                          handleRoomsChange("bedrooms", e.target.value)
                        }
                        className="hover-glow focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms" className="text-sm">
                        Salles de bain
                      </Label>
                      <Input
                        id="bathrooms"
                        name="rooms.bathrooms"
                        type="number"
                        value={formData.rooms.bathrooms}
                        onChange={(e) =>
                          handleRoomsChange("bathrooms", e.target.value)
                        }
                        className="hover-glow focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Capacité</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="hover-glow focus:ring-2 focus:ring-green-500"
                    placeholder="Nombre de personnes"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Équipements</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="wifi"
                      checked={formData.equipment.wifi}
                      onCheckedChange={(checked) =>
                        handleEquipmentChange("wifi", checked)
                      }
                    />
                    <Label htmlFor="wifi">Wi-Fi</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="balcony"
                      checked={formData.equipment.balcony}
                      onCheckedChange={(checked) =>
                        handleEquipmentChange("balcony", checked)
                      }
                    />
                    <Label htmlFor="balcony">Balcon</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pool"
                      checked={formData.equipment.pool}
                      onCheckedChange={(checked) =>
                        handleEquipmentChange("pool", checked)
                      }
                    />
                    <Label htmlFor="pool">Piscine</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="parking"
                      checked={formData.equipment.parking}
                      onCheckedChange={(checked) =>
                        handleEquipmentChange("parking", checked)
                      }
                    />
                    <Label htmlFor="parking">Parking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="security"
                      checked={formData.equipment.security}
                      onCheckedChange={(checked) =>
                        handleEquipmentChange("security", checked)
                      }
                    />
                    <Label htmlFor="security">Sécurité</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="airConditioning"
                      checked={formData.equipment.airConditioning}
                      onCheckedChange={(checked) =>
                        handleEquipmentChange("airConditioning", checked)
                      }
                    />
                    <Label htmlFor="airConditioning">Climatisation</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="glass-effect hover-lift transition-all-smooth">
            <CardHeader>
              <CardTitle>Contact</CardTitle>
              <CardDescription>
                Informations de contact pour les intéressés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Téléphone *</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="hover-glow focus:ring-2 focus:ring-green-500"
                    placeholder="Numéro de téléphone"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="hover-glow focus:ring-2 focus:ring-green-500"
                    placeholder="Adresse email"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="glass-effect hover-lift transition-all-smooth">
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                Ajoutez des photos de votre logement (max 5 images)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="images">Sélectionner des images</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="pl-9 hover-glow focus:ring-2 focus:ring-green-500 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Formats acceptés : JPG, PNG, GIF, WEBP, BMP, TIFF. Taille max
                  : 5MB par image
                </p>
              </div>

              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/dashboard/listings")}
              className="hover-glow transition-all-smooth"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white ripple-effect hover-glow transition-all-smooth"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Créer l'annonce
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateListing;
