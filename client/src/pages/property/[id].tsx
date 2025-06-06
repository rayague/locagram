import { useState, useEffect } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  getProperties,
  Property as FirebaseProperty,
  getUserById,
} from "../../lib/firebase";
import { Property, PropertyType, PropertyStatus } from "../../lib/types";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Trees,
  CheckCircle,
  Phone,
  Mail,
  Eye,
} from "lucide-react";
import ContactModal from "../../components/ContactModal";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

// Fonction pour adapter les données Firebase au format attendu par le composant
const adaptProperty = (property: FirebaseProperty): Property => {
  try {
    const city =
      property.location?.split(",").pop()?.trim() || property.location || "";
    const bedrooms = property.rooms?.bedrooms
      ? parseInt(property.rooms.bedrooms)
      : 0;
    const bathrooms = property.rooms?.bathrooms
      ? parseInt(property.rooms.bathrooms)
      : 0;
    const propertyType: PropertyType =
      (property.roomType?.toLowerCase() as PropertyType) || "apartment";
    const status: PropertyStatus =
      property.status === "active" ? "for_sale" : "for_rent";
    const features = [
      ...(property.equipment?.pool ? ["Piscine"] : []),
      ...(property.equipment?.airConditioning ? ["Climatisation"] : []),
      ...(property.equipment?.wifi ? ["WiFi"] : []),
      ...(property.equipment?.parking ? ["Parking"] : []),
      ...(property.equipment?.balcony ? ["Balcon"] : []),
    ];
    const images = Array.isArray(property.images) ? property.images : [];

    // Vérifie la présence de l'ID de l'utilisateur
    if (!property.userId) {
      console.warn("Attention: userId manquant pour la propriété", property.id);
    }

    return {
      id: property.id, // L'ID est une chaîne
      title: property.title || "Sans titre",
      description: property.description || "",
      price: typeof property.price === "number" ? property.price : 0,
      priceUnit: "FCFA",
      location: property.location || "",
      city,
      country: "Bénin",
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
      userId: property.userId, // S'assurer que l'ID de l'utilisateur est inclus
    };
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

export default function PropertyDetailsPage() {
  const [, params] = useRoute("/property/:id");
  const [location, setLocation] = useLocation();
  const propertyId = params?.id;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [author, setAuthor] = useState<{
    name: string;
    email?: string;
    phone?: string;
  } | null>(null);

  // Fonction pour incrémenter les vues
  const incrementViews = async (id: string) => {
    try {
      // Vérifier si ce navigateur a déjà vu cette propriété
      const viewedProperties = JSON.parse(
        localStorage.getItem("viewedProperties") || "{}"
      );
      const browserToken =
        localStorage.getItem("browserToken") ||
        Math.random().toString(36).substring(2, 15);

      // Sauvegarder le browserToken s'il n'existe pas
      if (!localStorage.getItem("browserToken")) {
        localStorage.setItem("browserToken", browserToken);
      }

      // Si cette propriété a déjà été vue par ce navigateur, ne pas incrémenter
      if (viewedProperties[id] === browserToken) {
        console.log("Cette propriété a déjà été vue par ce navigateur");
        return;
      }

      const propertyRef = doc(db, "listings", id);
      const propertyDoc = await getDoc(propertyRef);

      if (!propertyDoc.exists()) {
        console.error("Propriété non trouvée:", id);
        return;
      }

      // Incrémenter le compteur de vues
      await setDoc(propertyRef, {
        ...propertyDoc.data(),
        views: (propertyDoc.data().views || 0) + 1,
        updatedAt: serverTimestamp(),
      });

      // Marquer cette propriété comme vue par ce navigateur
      viewedProperties[id] = browserToken;
      localStorage.setItem(
        "viewedProperties",
        JSON.stringify(viewedProperties)
      );

      console.log("Vues incrémentées pour la propriété:", id);
    } catch (error) {
      console.error("Erreur lors de l'incrémentation des vues:", error);
    }
  };

  // Incrémenter les vues lors du chargement de la page
  useEffect(() => {
    if (propertyId) {
      incrementViews(propertyId);
    }
  }, [propertyId]);

  // Récupérer les détails de l'annonce
  const {
    data: property,
    isLoading,
    error,
  } = useQuery<Property, Error>({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      // Vérifier si nous avons les données dans le state
      const locationState = (
        window.history.state as { propertyData?: Property }
      )?.propertyData;
      if (locationState) {
        console.log("Utilisation des données du state:", locationState);
        return locationState;
      }

      if (!propertyId) {
        console.error("ID de propriété manquant");
        throw new Error("ID de propriété manquant");
      }

      try {
        console.log(
          "ID de propriété recherché:",
          propertyId,
          "Type:",
          typeof propertyId
        );
        const allProperties = await getProperties({});
        console.log(
          "Toutes les propriétés:",
          allProperties.map((p) => ({ id: p.id, type: typeof p.id }))
        );

        // Debug des IDs avant la comparaison
        allProperties.forEach((p) => {
          console.log(
            `Comparaison - ID Firebase: ${
              p.id
            } (${typeof p.id}) vs propertyId: ${propertyId} (${typeof propertyId})`
          );
        });

        // Recherche de la propriété avec l'ID exact
        const foundProperty = allProperties.find((p) => {
          const propId = p.id?.toString() || "";
          const searchId = propertyId?.toString() || "";
          console.log(
            `Comparaison détaillée - Firebase ID: ${propId} vs Recherché: ${searchId}`
          );
          return propId === searchId;
        });

        if (!foundProperty) {
          console.error("Propriété non trouvée pour ID:", propertyId);
          throw new Error("Propriété non trouvée");
        }

        console.log("Propriété trouvée (avant adaptation):", foundProperty);
        const adaptedProperty = adaptProperty(foundProperty);
        console.log("Propriété adaptée:", adaptedProperty);

        return adaptedProperty;
      } catch (error) {
        console.error("Erreur détaillée:", error);
        if (error instanceof Error) {
          console.error("Stack trace:", error.stack);
          throw error;
        }
        throw new Error("Erreur lors du chargement de la propriété");
      }
    },
    enabled: !!propertyId,
    retry: 1,
    staleTime: 30000,
  });

  // Charger l'auteur dès que la propriété est chargée
  useEffect(() => {
    if (property && (property as any).userId) {
      getUserById((property as any).userId).then((user) => {
        if (user)
          setAuthor({ name: user.name, email: user.email, phone: user.phone });
      });
    }
  }, [property]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price);
  };

  if (!propertyId) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
            Page non trouvée
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Désolé, la page que vous recherchez n'existe pas.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
            Une erreur est survenue
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Désolé, nous n'avons pas pu charger les détails de l'annonce.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à l'accueil
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
      {/* Hero section avec image principale */}
      <section className="relative h-[60vh] bg-gray-900">
        <div className="absolute inset-0">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {property.title}
            </h1>
            <div className="flex items-center text-white/90">
              <MapPin className="w-5 h-5 mr-2" />
              <span>
                {property.location}, {property.city}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Colonne principale */}
            <div className="lg:col-span-2">
              {/* Prix et statut */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold text-primary-500">
                      {formatPrice(property.price)} {property.priceUnit}
                    </span>
                    {property.status === "for_rent" && (
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        /mois
                      </span>
                    )}
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      property.status === "for_sale"
                        ? "bg-accent-500"
                        : "bg-primary-500"
                    } text-white`}
                  >
                    {property.status === "for_sale" ? "À vendre" : "À louer"}
                  </span>
                </div>
              </div>

              {/* Caractéristiques */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                  Caractéristiques
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex items-center">
                    <Bed className="w-6 h-6 text-primary-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Chambres
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {property.bedrooms}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-6 h-6 text-primary-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Salles de bain
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {property.bathrooms}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-6 h-6 text-primary-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Surface
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {property.area} m²
                      </div>
                    </div>
                  </div>
                  {property.landArea && (
                    <div className="flex items-center">
                      <Trees className="w-6 h-6 text-primary-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Terrain
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {property.landArea} m²
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Eye className="w-6 h-6 text-primary-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Vues
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {property.views || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Équipements */}
              {property.features.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                    Équipements
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Colonne latérale */}
            <div className="lg:col-span-1">
              {/* Carte de contact */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                  Contacter l'annonceur
                </h2>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Phone className="w-6 h-6" />
                  <span>Contacter l'annonceur</span>
                </button>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    Réponse sous 24h
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Service gratuit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de contact */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        propertyTitle={property.title}
        propertyId={property.id}
        author={{
          name: author?.name || "",
          email: author?.email,
          phone: author?.phone,
          id: property.userId || "",
        }}
      />
    </motion.div>
  );
}
