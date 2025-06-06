import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Building2, Home, Castle, Factory, Mountain, Warehouse, Hotel, Store, Building, Truck, Wheat, PartyPopper } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import PropertyCard from '@/components/PropertyCard';
import { getProperties, getCategories, Property as FirebaseProperty } from '@/lib/firebase';
import { Property as PropertyType } from '@/lib/types';
import { toast } from 'sonner';

// Mapping des icônes pour les catégories
const categoryIcons: { [key: string]: any } = {
  'auberge': Building2,
  'maison': Home,
  'manoir': Castle,
  'atelier': Factory,
  'villa': Building2,
  'chalet': Mountain,
  'loft': Warehouse,
  'studio': Home,
  'pavillon': Home,
  'mobilhome': Home,
  'appartement-meuble': Home,
  'duplex': Home,
  'penthouse': Home,
  'chambre-hotel': Hotel,
  'loft-industriel': Factory,
  'caravane': Home,
  'hotel-ville': Building2,
  'parcelle-vendre': Home,
  'residence-etudiante': Building2,
  'famille-accueil': Home,
  'colocation': Home,
  'internat-universitaire': Building2,
  'boutique': Store,
  'bureau': Building,
  'hangar': Warehouse,
  'entrepot': Truck,
  'terrain-agricole': Wheat,
  'salle-reception': PartyPopper,
  // Icône par défaut si la catégorie n'a pas d'icône spécifique
  'default': Home
};

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategoriesPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        toast.error("Impossible de charger les catégories");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fonction pour adapter une propriété Firebase au format attendu par PropertyCard
  const adaptProperty = (property: FirebaseProperty): PropertyType => {
    return {
      id: parseInt(property.id),
      title: property.title,
      description: property.description,
      price: property.price,
      priceUnit: '€',
      location: property.location,
      city: property.location.split(',')[0]?.trim() || '',
      country: 'France',
      bedrooms: property.features.bedrooms || 0,
      bathrooms: property.features.bathrooms || 0,
      area: property.features.area || 0,
      type: property.type as any,
      status: property.category === 'location' ? 'for_rent' : 'for_sale',
      images: property.images,
      features: [],
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString()
    };
  };

  // Fetch properties for selected category
  const { data: properties = [], isLoading: isLoadingProperties } = useQuery({
    queryKey: ['properties', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      try {
        const results = await getProperties({ type: selectedCategory });
        return results.map(adaptProperty);
      } catch (error) {
        console.error("Erreur lors de la récupération des propriétés:", error);
        toast.error("Impossible de charger les propriétés");
        return [];
      }
    },
    enabled: !!selectedCategory,
  });

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/category/${categoryId}`);
  };

  // Fonction pour obtenir l'icône d'une catégorie
  const getCategoryIcon = (categoryId: string) => {
    return categoryIcons[categoryId] || categoryIcons.default;
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
          
          {isLoadingCategories ? (
            // Loading state for categories
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
              {categories.map((category, index) => {
                const Icon = getCategoryIcon(category.id);
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
                      {category.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
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
              {isLoadingProperties ? (
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