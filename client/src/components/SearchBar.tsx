import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { MapPin, Home, DollarSign, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PRICE_RANGES, PROPERTY_TYPES, LOCATIONS } from '@/lib/constants';
import { SearchParams } from '@/lib/types';

export default function SearchBar() {
  const [location, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (searchParams.location) queryParams.set('location', searchParams.location);
    if (searchParams.type && searchParams.type !== 'all') queryParams.set('type', searchParams.type);
    if (searchParams.maxPrice) queryParams.set('maxPrice', searchParams.maxPrice.toString());
    
    setLocation(`/properties?${queryParams.toString()}`);
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-2xl border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 min-w-0">
          <label htmlFor="search-location" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Lieu</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="search-location"
              type="text"
              placeholder="Cotonou, Porto-Novo, Parakou..."
              className="w-full pl-10"
              value={searchParams.location || ''}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
              list="locations-list"
            />
            <datalist id="locations-list">
              {LOCATIONS.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <label htmlFor="search-type" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type de bien</label>
          <div className="relative">
            <Select
              value={searchParams.type}
              onValueChange={(value) => setSearchParams({ ...searchParams, type: value as any })}
            >
              <SelectTrigger className="w-full pl-10">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <label htmlFor="search-price" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Budget max</label>
          <div className="relative">
            <Select
              value={searchParams.maxPrice?.toString()}
              onValueChange={(value) => setSearchParams({ ...searchParams, maxPrice: value && value !== 'nomax' ? parseInt(value) : undefined })}
            >
              <SelectTrigger className="w-full pl-10">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <SelectValue placeholder="Budget max" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          type="submit"
          size="lg"
          className="inline-flex items-center justify-center px-5 py-3 font-display font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 md:self-end"
        >
          <Search className="w-5 h-5 mr-1.5" />
          Rechercher
        </Button>
      </form>
    </motion.div>
  );
}
