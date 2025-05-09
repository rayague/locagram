import { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import PropertyCard from '@/components/PropertyCard';
import SectionHeading from '@/components/common/SectionHeading';
import { PROPERTY_TYPES, LOCATIONS } from '@/lib/constants';
import { Property, SearchParams } from '@/lib/types';

export default function PropertyListing() {
  const [, location] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  
  // Get initial filter values from URL
  const initialFilters: SearchParams = {
    location: params.get('location') || undefined,
    type: params.get('type') as any || undefined,
    maxPrice: params.get('maxPrice') ? parseInt(params.get('maxPrice')!) : undefined,
    status: params.get('status') as any || undefined,
  };
  
  const [filters, setFilters] = useState<SearchParams>(initialFilters);
  const [priceValue, setPriceValue] = useState<number>(initialFilters.maxPrice || 500000000);
  
  // Convert filters to query params for API
  const filterToQueryParams = () => {
    const queryParams = new URLSearchParams();
    
    if (filters.location) queryParams.set('location', filters.location);
    if (filters.type) queryParams.set('type', filters.type);
    if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice.toString());
    if (filters.status) queryParams.set('status', filters.status);
    
    return queryParams.toString();
  };
  
  // Fetch properties
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: [`/api/properties?${filterToQueryParams()}`],
  });
  
  // Update URL when filters change
  useEffect(() => {
    const queryParams = new URLSearchParams();
    
    if (filters.location) queryParams.set('location', filters.location);
    if (filters.type) queryParams.set('type', filters.type);
    if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice.toString());
    if (filters.status) queryParams.set('status', filters.status);
    
    const queryString = queryParams.toString();
    location(`/properties${queryString ? `?${queryString}` : ''}`, { replace: true });
  }, [filters, location]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      ...filters,
      maxPrice: priceValue
    });
  };
  
  const resetFilters = () => {
    setFilters({});
    setPriceValue(500000000);
  };

  // Get page title based on filters
  const getPageTitle = () => {
    if (filters.status === 'for_sale') return 'Propriétés à vendre';
    if (filters.status === 'for_rent') return 'Propriétés à louer';
    return 'Toutes nos propriétés';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
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
        <SectionHeading 
          title={getPageTitle()} 
          subtitle={filters.location ? `Propriétés à ${filters.location}` : 'Explorez notre catalogue de biens immobiliers au Bénin'}
        />
        
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          {/* Mobile filter button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden mb-4 w-full">
                <Filter className="mr-2 h-4 w-4" /> Filtres
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
                <SheetDescription>
                  Affinez votre recherche de propriétés
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Lieu</h3>
                  <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters({ ...filters, location: value || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les lieux" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les lieux</SelectItem>
                      {LOCATIONS.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Type de bien</h3>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => setFilters({ ...filters, type: value as any || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les types</SelectItem>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Statut</h3>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters({ ...filters, status: value as any || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les statuts</SelectItem>
                      <SelectItem value="for_sale">À vendre</SelectItem>
                      <SelectItem value="for_rent">À louer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">Prix maximum</h3>
                    <span className="text-sm text-gray-500">{formatPrice(priceValue)} FCFA</span>
                  </div>
                  <Slider
                    value={[priceValue]}
                    min={1000000}
                    max={1000000000}
                    step={1000000}
                    onValueChange={(values) => setPriceValue(values[0])}
                  />
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" onClick={resetFilters} className="flex-1">
                    Réinitialiser
                  </Button>
                  <Button onClick={handleSearch} className="flex-1">
                    Appliquer
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Desktop filters */}
          <div className="hidden md:block w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Filtres</h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Lieu</h4>
                <Select
                  value={filters.location}
                  onValueChange={(value) => setFilters({ ...filters, location: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les lieux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les lieux</SelectItem>
                    {LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Type de bien</h4>
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilters({ ...filters, type: value as any || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les types</SelectItem>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Statut</h4>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value as any || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les statuts</SelectItem>
                    <SelectItem value="for_sale">À vendre</SelectItem>
                    <SelectItem value="for_rent">À louer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium">Prix maximum</h4>
                  <span className="text-sm text-gray-500">{formatPrice(priceValue)} FCFA</span>
                </div>
                <Slider
                  value={[priceValue]}
                  min={1000000}
                  max={1000000000}
                  step={1000000}
                  onValueChange={(values) => setPriceValue(values[0])}
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={resetFilters} className="flex-1">
                  Réinitialiser
                </Button>
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="mr-2 h-4 w-4" /> Rechercher
                </Button>
              </div>
            </div>
          </div>
          
          {/* Properties grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Essayez d'ajuster vos filtres ou de rechercher autre chose.
                </p>
                <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
