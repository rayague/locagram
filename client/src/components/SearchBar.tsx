import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Home, DollarSign, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRICE_RANGES, LOCATIONS } from "@/lib/constants";
import { SearchParams } from "@/lib/types";
import { getCategories } from "@/lib/firebase";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function SearchBar() {
  const [location, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<{
    location?: string;
    type?: string;
    maxPrice?: string;
  }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        // Dédupliquer les catégories en utilisant un Set
        const uniqueCategories = Array.from(
          new Map(fetchedCategories.map(cat => [cat.id, cat])).values()
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        toast.error("Impossible de charger les catégories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!searchParams.location?.trim()) {
      newErrors.location = "Veuillez sélectionner une ville";
    }
    
    if (!searchParams.type || searchParams.type === "all") {
      newErrors.type = "Veuillez sélectionner un type de bien";
    }
    
    if (!searchParams.maxPrice) {
      newErrors.maxPrice = "Veuillez sélectionner un budget maximum";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("location", searchParams.location!);
    queryParams.set("type", searchParams.type!);
    queryParams.set("maxPrice", searchParams.maxPrice!.toString());

    setLocation(`/louer?${queryParams.toString()}`);
  };

  return (
    <motion.div
      className="relative z-[100] bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-2xl border border-gray-200 dark:border-gray-700 mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row md:items-end gap-2 sm:gap-3"
      >
        <div className="flex-1 min-w-0">
          <label
            htmlFor="search-location"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
          >
            Lieu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              id="search-location"
              type="text"
              placeholder="Votre ville..."
              className={`w-full pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base ${
                errors.location ? "border-red-500 focus:ring-red-500" : ""
              }`}
              value={searchParams.location || ""}
              onChange={(e) => {
                setSearchParams({ ...searchParams, location: e.target.value });
                if (errors.location) {
                  setErrors({ ...errors, location: undefined });
                }
              }}
              list="locations-list"
            />
            <datalist id="locations-list">
              {LOCATIONS.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <label
            htmlFor="search-type"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
          >
            Type de bien <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Select
              value={searchParams.type}
              onValueChange={(value) => {
                setSearchParams({ ...searchParams, type: value as any });
                if (errors.type) {
                  setErrors({ ...errors, type: undefined });
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger 
                className={`w-full pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base ${
                  errors.type ? "border-red-500 focus:ring-red-500" : ""
                }`}
              >
                <Home className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <SelectValue placeholder={isLoading ? "Chargement..." : "Tous les types"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type}</p>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <label
            htmlFor="search-price"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
          >
            Budget max <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Select
              value={searchParams.maxPrice?.toString()}
              onValueChange={(value) => {
                setSearchParams({
                  ...searchParams,
                  maxPrice: value && value !== "nomax" ? parseInt(value) : undefined,
                });
                if (errors.maxPrice) {
                  setErrors({ ...errors, maxPrice: undefined });
                }
              }}
            >
              <SelectTrigger 
                className={`w-full pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base ${
                  errors.maxPrice ? "border-red-500 focus:ring-red-500" : ""
                }`}
              >
                <DollarSign className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <SelectValue placeholder="Budget max" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.maxPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.maxPrice}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto h-9 sm:h-10 text-sm sm:text-base font-medium text-white bg-green-500 hover:bg-primary-600 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mt-1 sm:mt-0"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
          Rechercher
        </Button>
      </form>
    </motion.div>
  );
}
