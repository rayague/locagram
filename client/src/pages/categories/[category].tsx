import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PropertyCard from '@/components/PropertyCard';
import SectionHeading from '@/components/common/SectionHeading';
import { Property } from '@/lib/types';

// Mapping des catégories pour les titres et descriptions
const CATEGORY_INFO = {
  'auberge': {
    title: 'Auberges',
    description: 'Découvrez notre sélection d\'auberges au Bénin, parfaites pour un séjour authentique et chaleureux.'
  },
  'maison': {
    title: 'Maisons à louer',
    description: 'Explorez notre collection de maisons à louer, du studio au pavillon familial.'
  },
  'manoir': {
    title: 'Manoirs',
    description: 'Des manoirs d\'exception pour une expérience de luxe unique au Bénin.'
  },
  'atelier': {
    title: 'Ateliers',
    description: 'Des espaces créatifs et fonctionnels pour les artistes et artisans.'
  },
  'villa': {
    title: 'Villas',
    description: 'Des villas de prestige pour un cadre de vie idyllique.'
  },
  'chalet': {
    title: 'Chalets',
    description: 'Des chalets confortables pour un séjour nature et détente.'
  },
  'loft': {
    title: 'Lofts',
    description: 'Des lofts modernes et spacieux pour un style de vie contemporain.'
  },
  'studio': {
    title: 'Studios',
    description: 'Des studios optimisés pour un confort optimal dans un espace compact.'
  },
  'pavillon': {
    title: 'Pavillons',
    description: 'Des pavillons familiaux dans des quartiers résidentiels recherchés.'
  },
  'mobilhome': {
    title: 'Mobil-homes',
    description: 'Des mobil-homes confortables pour un mode de vie nomade.'
  },
  'appartement-meuble': {
    title: 'Appartements meublés',
    description: 'Des appartements entièrement meublés pour un emménagement immédiat.'
  },
  'duplex': {
    title: 'Duplex',
    description: 'Des duplex spacieux offrant une séparation optimale des espaces.'
  },
  'penthouse': {
    title: 'Penthouses',
    description: 'Des penthouses de luxe avec vue panoramique.'
  },
  'chambre-hotel': {
    title: 'Chambres d\'hôtel',
    description: 'Des chambres d\'hôtel confortables pour vos déplacements professionnels ou loisirs.'
  },
  'loft-industriel': {
    title: 'Lofts industriels',
    description: 'Des lofts industriels transformés en espaces de vie modernes.'
  },
  'caravane': {
    title: 'Caravanes',
    description: 'Des caravanes pour un mode de vie mobile et aventureux.'
  },
  'hotel-ville': {
    title: 'Hôtels de ville',
    description: 'Des hôtels de ville historiques et prestigieux.'
  },
  'parcelle-vendre': {
    title: 'Parcelles à vendre',
    description: 'Des terrains constructibles dans des zones stratégiques.'
  }
};

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category || '';
  const categoryInfo = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO] || {
    title: 'Catégorie non trouvée',
    description: 'Cette catégorie n\'existe pas.'
  };

  // Fetch properties for this category
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: [`/api/properties/category/${category}`],
  });

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
              {categoryInfo.title}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {categoryInfo.description}
            </p>
          </div>
        </div>
      </section>

      {/* Properties grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title={`Nos ${categoryInfo.title}`}
            subtitle="Découvrez notre sélection de biens immobiliers dans cette catégorie"
          />
          
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
                  Aucune propriété disponible dans cette catégorie pour le moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
} 