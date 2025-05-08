import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { ArrowLeft, Building2, Home, Castle, Factory, Mountain, Warehouse, Hotel, Store, Building, Truck, Wheat, PartyPopper } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/lib/types';

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

export default function CategoryDetailPage() {
  const [, setLocation] = useLocation();
  const categoryId = new URLSearchParams(window.location.search).get('id');
  const category = categories.find(c => c.id === categoryId);

  // Fetch properties for selected category
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties', { type: categoryId }],
    enabled: !!categoryId,
  });

  if (!category) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Catégorie non trouvée
            </h1>
            <button
              onClick={() => setLocation('/categories')}
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              Retour aux catégories
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Icon = category.icon;

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
          <button
            onClick={() => setLocation('/categories')}
            className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux catégories
          </button>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/20 mb-6">
              <Icon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {category.name}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Découvrez notre sélection de biens immobiliers dans la catégorie {category.name.toLowerCase()}.
            </p>
          </div>
        </div>
      </section>

      {/* Properties section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title={`Biens disponibles en ${category.name.toLowerCase()}`}
            subtitle="Explorez notre sélection de propriétés dans cette catégorie"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {isLoading ? (
              // Loading state with skeleton cards
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
                  <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))
            ) : properties.length > 0 ? (
              properties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Aucun bien disponible dans cette catégorie pour le moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
} 