import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PropertyCard from '@/components/PropertyCard';
import SectionHeading from '@/components/common/SectionHeading';
import { Property } from '@/lib/types';

export default function AcheterPage() {
  // Fetch properties for sale
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties/sale'],
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
              Achetez votre bien immobilier
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Découvrez notre sélection de propriétés à vendre au Bénin. Trouvez la maison de vos rêves parmi nos biens d'exception.
            </p>
          </div>
        </div>
      </section>

      {/* Search section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  placeholder="Localisation"
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Budget max"
                  className="w-full"
                />
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="Nos propriétés à vendre"
            subtitle="Découvrez notre sélection de biens immobiliers à vendre"
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
                  Aucune propriété disponible pour le moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Contactez-nous pour nous faire part de vos critères spécifiques. Notre équipe se fera un plaisir de vous aider à trouver le bien idéal.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg px-6 py-3">
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </motion.div>
  );
} 