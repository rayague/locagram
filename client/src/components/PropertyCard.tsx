import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { MapPin, Bed, Bath, Square, Trees, CheckCircle } from 'lucide-react';
import { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const statusLabel = property.status === 'for_sale' ? 'À vendre' : 'À louer';
  const statusColor = property.status === 'for_sale' ? 'bg-accent-500' : 'bg-primary-500';
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <motion.div 
      className="card-hover bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative overflow-hidden h-64">
        <img 
          src={property.images[0]} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className={`inline-block px-3 py-1 text-xs font-medium ${statusColor} text-white rounded-full`}>
            {statusLabel}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-1/3"></div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold font-serif text-gray-900 dark:text-white">
            {property.title}
          </h3>
          <div className="text-xl font-bold text-primary-500">
            {formatPrice(property.price)} {property.priceUnit}
            {property.status === 'for_rent' && <span className="text-sm font-normal">/mois</span>}
          </div>
        </div>
        
        <p className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{property.location}, {property.country}</span>
        </p>
        
        <div className="flex items-center justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1 text-gray-400" />
            <span>{property.bedrooms} ch.</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1 text-gray-400" />
            <span>{property.bathrooms} sdb</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1 text-gray-400" />
            <span>{property.area} m²</span>
          </div>
          {property.landArea ? (
            <div className="flex items-center">
              <Trees className="w-4 h-4 mr-1 text-gray-400" />
              <span>{property.landArea} m² terrain</span>
            </div>
          ) : property.isFurnished ? (
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-gray-400" />
              <span>Meublé</span>
            </div>
          ) : null}
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <Link href={`/property/${property.id}`} className="block text-center py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-lg transition-colors duration-300">
          Voir les détails
        </Link>
      </div>
    </motion.div>
  );
}
