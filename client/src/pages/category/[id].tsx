import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  getProperties,
  getCategories,
  Property as FirebaseProperty,
} from "../../lib/firebase";
import { Property, PropertyType, PropertyStatus } from "../../lib/types";
import PropertyCard from "../../components/PropertyCard";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Bed, Bath, Square } from "lucide-react";

// Fonction pour adapter les données Firebase au format attendu par le composant
const adaptProperty = (property: FirebaseProperty): Property => {
  console.log("Adapting property (raw):", property);

  try {
    // S'assurer que l'ID est une chaîne de caractères
    if (!property.id) {
      console.error("Propriété sans ID:", property);
      throw new Error("La propriété n'a pas d'ID");
    }

    // Extraire la ville de la location (tout ce qui est après la virgule)
    const city =
      property.location?.split(",").pop()?.trim() || property.location || "";

    // Convertir les chambres en nombre avec des valeurs par défaut
    const bedrooms = property.rooms?.bedrooms
      ? parseInt(property.rooms.bedrooms)
      : 0;
    const bathrooms = property.rooms?.bathrooms
      ? parseInt(property.rooms.bathrooms)
      : 0;

    // Déterminer le type de propriété avec une valeur par défaut
    const propertyType: PropertyType =
      (property.roomType?.toLowerCase() as PropertyType) || "apartment";

    // Déterminer le statut avec une valeur par défaut
    let status: PropertyStatus;
    if (property.status === "active") {
      status = "for_sale";
    } else if (property.status === "inactive") {
      // Ne pas inclure les propriétés inactives
      throw new Error("Propriété inactive");
    } else {
      status = "for_rent";
    }

    // Construire les features avec des valeurs par défaut
    const features = [
      ...(property.equipment?.pool ? ["Piscine"] : []),
      ...(property.equipment?.airConditioning ? ["Climatisation"] : []),
      ...(property.equipment?.wifi ? ["WiFi"] : []),
      ...(property.equipment?.parking ? ["Parking"] : []),
      ...(property.equipment?.balcony ? ["Balcon"] : []),
    ];

    // S'assurer que les images existent
    const images = Array.isArray(property.images) ? property.images : [];

    const adaptedProperty: Property = {
      id: property.id, // Utiliser l'ID tel quel
      title: property.title || "Sans titre",
      description: property.description || "",
      price: typeof property.price === "number" ? property.price : 0,
      priceUnit: "FCFA",
      location: property.location || "",
      city,
      country: "",
      bedrooms,
      bathrooms,
      area: typeof property.capacity === "number" ? property.capacity : 0,
      type: propertyType,
      status,
      images,
      features,
      createdAt: property.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: property.updatedAt?.toISOString() || new Date().toISOString(),
      views: property.views || 0,
      userId: property.userId,
    };

    console.log("Adapted property (final):", adaptedProperty);
    return adaptedProperty;
  } catch (error: any) {
    console.error(
      "Erreur lors de l'adaptation de la propriété:",
      error,
      "Données brutes:",
      property
    );
    throw new Error(
      `Erreur lors de l'adaptation de la propriété: ${
        error?.message || "Erreur inconnue"
      }`
    );
  }
};

// Ajout de la fonction formatPrice
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR").format(price);
};

export default function CategoryPage() {
  const [, params] = useRoute("/category/:id");
  const categoryId = params?.id;
  const [categoryName, setCategoryName] = useState<string>("");
  const [isCategoryValid, setIsCategoryValid] = useState<boolean>(true);

  // Récupérer le nom de la catégorie
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const categories = await getCategories();
        const category = categories.find((cat) => cat.id === categoryId);
        if (category) {
          setCategoryName(category.name);
          setIsCategoryValid(true);
        } else {
          setIsCategoryValid(false);
          toast.error("Catégorie non trouvée");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la catégorie:", error);
        toast.error("Erreur lors de la récupération de la catégorie");
        setIsCategoryValid(false);
      }
    };

    if (categoryId) {
      fetchCategoryName();
    }
  }, [categoryId]);

  // Récupérer les annonces de la catégorie
  const {
    data: properties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["properties", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      console.log("Récupération des propriétés pour la catégorie:", categoryId);
      try {
        const properties = await getProperties({ category: categoryId });
        console.log("Propriétés récupérées (brutes):", properties);

        // Log détaillé de chaque propriété avant adaptation
        properties.forEach((prop, index) => {
          console.log(`Propriété ${index + 1} avant adaptation:`, {
            id: prop.id,
            title: prop.title,
            category: prop.category,
            images: prop.images,
            status: prop.status,
            roomType: prop.roomType,
            rooms: prop.rooms,
            equipment: prop.equipment,
          });
        });

        const adaptedProperties = properties.map(adaptProperty);

        // Log détaillé de chaque propriété après adaptation
        adaptedProperties.forEach((prop, index) => {
          console.log(`Propriété ${index + 1} après adaptation:`, {
            id: prop.id,
            title: prop.title,
            type: prop.type,
            status: prop.status,
            images: prop.images,
            features: prop.features,
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
            views: prop.views,
          });
        });

        console.log("Propriétés adaptées (finales):", adaptedProperties);
        return adaptedProperties;
      } catch (error: any) {
        console.error("Erreur lors de la récupération des propriétés:", error);
        throw new Error(
          error?.message || "Erreur lors de la récupération des propriétés"
        );
      }
    },
    enabled: !!categoryId && isCategoryValid,
  });

  // Log des propriétés quand elles changent
  useEffect(() => {
    if (properties) {
      console.log("Propriétés disponibles pour le rendu:", properties);
      console.log("Nombre de propriétés:", properties.length);
      console.log("Première propriété:", properties[0]);
    }
  }, [properties]);

  if (!categoryId || !isCategoryValid) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
            Page non trouvée
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux catégories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-gray-900"
    >
      {/* Hero section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-green-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Link
              href="/categories"
              className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux catégories
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {categoryName || "Chargement..."}
            </h1>
            <p className="text-xl text-white/90">
              Découvrez notre sélection de biens dans cette catégorie
            </p>
          </div>
        </div>
      </section>

      {/* Properties section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse"
                >
                  <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="text-center py-20">
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Une erreur est survenue
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Désolé, nous n'avons pas pu charger les annonces. Veuillez
                réessayer plus tard.
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour aux catégories
              </Link>
            </div>
          ) : properties && properties.length > 0 ? (
            // Properties grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <PropertyCard
                  key={`${property.id}-${index}`}
                  property={property}
                  index={index}
                />
              ))}
            </div>
          ) : (
            // No properties message
            <div className="text-center py-20">
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Aucune annonce disponible
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Il n'y a pas encore d'annonces dans cette catégorie pour le
                moment.
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour aux catégories
              </Link>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
