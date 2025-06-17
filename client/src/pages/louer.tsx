import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { getProperties, Property, saveContactMessage } from "@/lib/firebase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Bed,
  Bath,
  Car,
  MapPin,
  Calendar,
  Send,
  Mail,
  Phone,
  User,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import SearchBar from "@/components/SearchBar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/common/SectionHeading";

// Fonction pour adapter les données de la propriété
const adaptProperty = (property: Property) => {
  return {
    ...property,
    rooms: {
      bedrooms: property.rooms?.bedrooms || "0",
      bathrooms: property.rooms?.bathrooms || "0",
      livingRooms: property.rooms?.livingRooms || "0",
      kitchens: property.rooms?.kitchens || "0",
    },
  };
};

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

      // Adapter chaque propriété avant de les stocker
      const adaptedProperties = results.map(adaptProperty);
      setProperties(adaptedProperties);

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
              Découvrez notre sélection de propriétés à louer au Bénin. Trouvez
              le logement idéal pour votre séjour.
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
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Bed className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {property.rooms.bedrooms} ch.
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Bath className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {property.rooms.bathrooms} sdb
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Car className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.capacity}m²</span>
                  </div>
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

      {/* Contact section */}
      {/* <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SectionHeading
              title="Besoin d'aide pour votre recherche ?"
              subtitle="Contactez-nous et nous vous aiderons à trouver le bien idéal"
            />

            <ContactForm />
          </div>
        </div>
      </section> */}
    </motion.div>
  );
}

// Composant du formulaire de contact
function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("📝 Tentative d'envoi du message:", formData);

      // Valider les données
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim() ||
        !formData.subject.trim() ||
        !formData.message.trim()
      ) {
        throw new Error("Tous les champs sont obligatoires");
      }

      // Sauvegarder le message
      const messageId = await saveContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      console.log("✅ Message envoyé avec succès, ID:", messageId);

      // Notification de succès
      toast.success(
        "Message envoyé ! Nous vous répondrons dans les plus brefs délais."
      );

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("❌ Erreur:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'envoi du message"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-12 space-y-6 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-sm font-medium mb-2">Nom complet</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="pl-10"
              placeholder="Votre nom complet"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="pl-10"
              placeholder="exemple@email.com"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-2">Téléphone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              className="pl-10"
              placeholder="+229 00 00 00 00"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-2">Sujet</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              required
              className="pl-10"
              placeholder="Sujet de votre message"
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium mb-2">Message</label>
        <Textarea
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          required
          className="min-h-[120px] resize-none"
          placeholder="Votre message..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        <Send className="mr-2 h-4 w-4" />
        {isLoading ? "Envoi en cours..." : "Envoyer le message"}
      </Button>
    </form>
  );
}
