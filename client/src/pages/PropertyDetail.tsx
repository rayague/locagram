import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Trees, 
  Calendar, 
  Check, 
  Phone, 
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Heart,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ContactModal from '@/components/ContactModal';
import { Property } from '@/lib/types';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  
  // Fetch property details
  const { data: property, isLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });
  
  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }
  
  if (!property) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Propriété non trouvée</h1>
          <p className="mb-6">La propriété que vous recherchez n'existe pas ou a été supprimée.</p>
          <Button asChild>
            <Link href="/properties">
              <Home className="mr-2 h-4 w-4" /> Retour aux propriétés
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const statusLabel = property.status === 'for_sale' ? 'À vendre' : 'À louer';
  const statusColor = property.status === 'for_sale' ? 'bg-accent-500' : 'bg-primary-500';
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <motion.div
      className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary-500 transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <Link href="/properties" className="text-gray-500 hover:text-primary-500 transition-colors">
            Propriétés
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-primary-500 font-medium truncate">{property.title}</span>
        </div>
        
        {/* Property header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center mb-2">
              <Badge className={`${statusColor} hover:${statusColor} mr-2`}>
                {statusLabel}
              </Badge>
              <Badge variant="outline">
                {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">{property.title}</h1>
            <p className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{property.location}, {property.city}, {property.country}</span>
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-3xl font-bold text-primary-500">
              {formatPrice(property.price)} {property.priceUnit}
              {property.status === 'for_rent' && <span className="text-sm font-normal">/mois</span>}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mise à jour le {formatDate(property.updatedAt)}
            </p>
          </div>
        </div>
        
        {/* Image gallery */}
        <div className="mb-8">
          <Carousel className="w-full">
            <CarouselContent>
              {property.images.map((image, index) => (
                <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div 
                      className="relative h-64 md:h-80 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setFullscreenImage(image)}
                    >
                      <motion.img 
                        src={image} 
                        alt={`${property.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        
        {/* Property details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-serif font-bold mb-4">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {property.description}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-serif font-bold mb-4">Caractéristiques</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 text-primary-500 mr-2" />
                  <span>{property.bedrooms} chambres</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-5 h-5 text-primary-500 mr-2" />
                  <span>{property.bathrooms} salles de bain</span>
                </div>
                <div className="flex items-center">
                  <Square className="w-5 h-5 text-primary-500 mr-2" />
                  <span>{property.area} m²</span>
                </div>
                {property.landArea && (
                  <div className="flex items-center">
                    <Trees className="w-5 h-5 text-primary-500 mr-2" />
                    <span>{property.landArea} m² terrain</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-primary-500 mr-2" />
                  <span>Construit en 2022</span>
                </div>
                {property.isFurnished && (
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-primary-500 mr-2" />
                    <span>Meublé</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-serif font-bold mb-4">Équipements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-primary-500 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Contact sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-serif font-bold mb-4">Contacter l'agent</h2>
              
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Agent immobilier" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Sophie Legrand</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Agent immobilier</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => setContactModalOpen(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Envoyer un message
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  +229 97 12 34 56
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="flex-1">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="flex-1">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact modal */}
      <ContactModal 
        isOpen={contactModalOpen} 
        onClose={() => setContactModalOpen(false)} 
      />
      
      {/* Fullscreen image viewer */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreenImage(null)}
          >
            <Button 
              variant="outline" 
              size="icon"
              className="absolute top-4 right-4 bg-black/50 border-none text-white hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImage(null);
              }}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <motion.img 
              src={fullscreenImage} 
              alt="Aperçu" 
              className="max-w-screen-lg max-h-screen p-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PropertyDetailSkeleton() {
  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="mt-4 md:mt-0">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
        </div>
        
        <Skeleton className="w-full h-80 rounded-lg mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-24" />
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="flex items-center mb-6">
                <Skeleton className="w-16 h-16 rounded-full mr-4" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-full mb-3" />
              <Skeleton className="h-10 w-full mb-6" />
              <div className="flex space-x-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
