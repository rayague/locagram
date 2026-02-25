import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Listing } from "@/types/listing";
import {
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
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

const categories = [
  { id: "house", name: "Maison", icon: Home },
  { id: "apartment", name: "Appartement", icon: Building2 },
  { id: "villa", name: "Villa", icon: Castle },
  { id: "land", name: "Terrain", icon: Mountain },
  { id: "commercial", name: "Local commercial", icon: Store },
  { id: "office", name: "Bureau", icon: Building },
  { id: "warehouse", name: "Entrepôt", icon: Warehouse },
  { id: "hotel", name: "Hôtel", icon: Hotel },
  { id: "factory", name: "Usine", icon: Factory },
  { id: "other", name: "Autre", icon: PartyPopper },
];

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  price: z.number().min(0, "Le prix doit être positif"),
  location: z.string().min(1, "La localisation est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  images: z.array(z.string()),
  equipment: z.object({
    wifi: z.boolean(),
    balcony: z.boolean(),
    pool: z.boolean(),
    parking: z.boolean(),
    security: z.boolean(),
    airConditioning: z.boolean(),
  }),
  rooms: z.object({
    bedrooms: z.number().min(0),
    bathrooms: z.number().min(0),
    kitchens: z.number().min(0),
  }),
});

type FormData = z.infer<typeof formSchema>;

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      location: "",
      category: "",
      images: [],
      equipment: {
        wifi: false,
        balcony: false,
        pool: false,
        parking: false,
        security: false,
        airConditioning: false,
      },
      rooms: {
        bedrooms: 0,
        bathrooms: 0,
        kitchens: 0,
      },
    },
  });

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

        // Vérifier si l'utilisateur est autorisé à modifier cette annonce
        if (listingData.userId !== user.uid && user.role !== "admin") {
          console.error("Accès non autorisé à l'annonce");
          setError("Vous n'êtes pas autorisé à modifier cette annonce");
          return;
        }

        form.reset({
          ...listingData,
          rooms: listingData.rooms || {
            bedrooms: 0,
            bathrooms: 0,
            kitchens: 0,
          },
          equipment: listingData.equipment || {
            wifi: false,
            balcony: false,
            pool: false,
            parking: false,
            security: false,
            airConditioning: false,
          },
          images: listingData.images || [],
        });
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    form.reset({
      ...form.getValues(),
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    form.reset({
      ...form.getValues(),
      [name]: value,
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    form.reset({
      ...form.getValues(),
      [name]: checked,
    });
  };

  const handleEquipmentChange = (
    name: keyof Listing["equipment"],
    checked: boolean
  ) => {
    form.reset({
      ...form.getValues(),
      equipment: {
        ...(form.getValues().equipment || {
          wifi: false,
          balcony: false,
          pool: false,
          parking: false,
          security: false,
          airConditioning: false,
        }),
        [name]: checked,
      },
    });
  };

  const handleRoomsChange = (name: keyof Listing["rooms"], value: string) => {
    form.reset({
      ...form.getValues(),
      rooms: {
        ...(form.getValues().rooms || {
          bedrooms: 0,
          bathrooms: 0,
          kitchens: 0,
        }),
        [name]: value,
      },
    });
  };

  const handleSubmit = async (data: FormData) => {
    if (!id || !user?.uid) return;

    try {
      setIsLoading(true);
      const listingRef = doc(db, "listings", id);

      await updateDoc(listingRef, {
        ...data,
        userId: user.uid,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Succès",
        description: "L'annonce a été mise à jour avec succès",
      });
      setLocation("/dashboard/listings");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'annonce:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'annonce",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              {error}
            </h2>
            <Button onClick={() => setLocation("/dashboard/listings")}>
              Retour aux annonces
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">
              Chargement de l'annonce...
            </h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Modifier l'annonce</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            Retour
          </Button>
        </div>

        {error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-500">{error}</div>
            </CardContent>
          </Card>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                  <CardDescription>
                    Modifiez les informations principales de votre annonce
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catégorie</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une catégorie" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  <div className="flex items-center gap-2">
                                    <category.icon className="h-4 w-4" />
                                    {category.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix (FCFA)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localisation</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une localisation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {beninCommunes.map((commune) => (
                                <SelectItem key={commune} value={commune}>
                                  {commune}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Équipements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Équipements</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="equipment.wifi"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-y-0">
                            <FormLabel>WiFi</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="equipment.balcony"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-y-0">
                            <FormLabel>Balcon</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="equipment.pool"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-y-0">
                            <FormLabel>Piscine</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="equipment.parking"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-y-0">
                            <FormLabel>Parking</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="equipment.security"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-y-0">
                            <FormLabel>Sécurité</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="equipment.airConditioning"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-y-0">
                            <FormLabel>Climatisation</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Pièces */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pièces</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="rooms.bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chambres</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || 0}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="rooms.bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Salles de bain</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || 0}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="rooms.kitchens"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cuisines</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || 0}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Images</h3>
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Images</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {field.value?.map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden"
                              >
                                <img
                                  src={image}
                                  alt={`Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={() => {
                                    const newImages = [...field.value];
                                    newImages.splice(index, 1);
                                    field.onChange(newImages);
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <div className="aspect-[16/9] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="image-upload"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      field.onChange([
                                        ...field.value,
                                        reader.result,
                                      ]);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <label
                                htmlFor="image-upload"
                                className="cursor-pointer text-center p-4"
                              >
                                <Plus className="h-8 w-8 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">
                                  Ajouter une image
                                </p>
                              </label>
                            </div>
                          </div>
                          <FormDescription>
                            Ajoutez jusqu'à 5 images de votre bien
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading
                      ? "Enregistrement..."
                      : "Enregistrer les modifications"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditListing;
