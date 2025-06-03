import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { getProperties, Property } from "@/lib/firebase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Bed, Bath, Car, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import SearchBar from "@/components/SearchBar";

export default function LouerPage() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les propriétés
  const fetchProperties = async (searchParams: URLSearchParams) => {
    try {
      setIsLoading(true);
      const location = searchParams.get("location");
      const type = searchParams.get("type");
      const maxPrice = searchParams.get("maxPrice");

      const results = await getProperties({
        location: location || undefined,
        type: type || undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      });
      
      setProperties(results);
      if (results.length === 0 && (location || type || maxPrice)) {
        toast.info("Aucune annonce ne correspond à vos critères");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des annonces:", err);
      setError("Une erreur est survenue lors de la recherche");
      toast.error("Erreur lors de la recherche");
    } finally {
      setIsLoading(false);
    }
  };

  // Effet pour surveiller les changements d'URL et mettre à jour les résultats
  useEffect(() => {
    const searchParams = new URLSearchParams(search || "");
    fetchProperties(searchParams);
  }, [search]); // Se déclenche à chaque changement de l'URL

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p className="text-lg">{error}</p>
          <button
            onClick={() => setLocation("/")}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Retour à l'accueil
          </button>
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
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Louez votre bien immobilier
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Découvrez notre sélection de propriétés à louer au Bénin. Trouvez le logement idéal pour votre séjour.
            </p>
          </div>
        </div>
      </section>

      {/* Search form */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {properties.length} annonce{properties.length > 1 ? "s" : ""} trouvée
          {properties.length > 1 ? "s" : ""}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={property.images?.[0] || "/placeholder.jpg"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "XOF",
                    maximumFractionDigits: 0,
                  }).format(property.price)}
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">
                  {property.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {property.description}
                </p>

                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {property.features?.bedrooms && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Bed className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.features.bedrooms} ch.</span>
                    </div>
                  )}
                  {property.features?.bathrooms && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Bath className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.features.bathrooms} sdb</span>
                    </div>
                  )}
                  {property.features?.area && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Car className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.features.area}m²</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {format(property.createdAt, "d MMM yyyy", { locale: fr })}
                    </span>
                  </div>
                  <button
                    onClick={() => setLocation(`/property/${property.id}`)}
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Voir les détails
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Aucune annonce ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={() => setLocation("/")}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Modifier la recherche
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
} 