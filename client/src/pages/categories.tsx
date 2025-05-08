import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Building2, Home, Castle, Factory, Mountain, Warehouse, Hotel, Store, Building, Truck, Wheat, PartyPopper } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

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

export default function CategoriesPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch properties for selected category
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties', { type: selectedCategory }],
    enabled: !!selectedCategory,
  });

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/category?id=${categoryId}`);
  };

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
              Explorez nos catégories
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Découvrez notre sélection de biens immobiliers par catégorie
            </p>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="Toutes nos catégories"
            subtitle="Choisissez une catégorie pour voir les biens disponibles"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handleCategoryClick(category.id)}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:bg-green-500 dark:group-hover:bg-green-400 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-green-600 dark:text-green-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {category.name}
                    </h3>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Properties for selected category */}
      {selectedCategory && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <SectionHeading 
                title={`Biens en ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase()}`}
                subtitle="Découvrez notre sélection de biens dans cette catégorie"
              />
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Voir toutes les catégories
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      )}
    </motion.div>
  );
} 