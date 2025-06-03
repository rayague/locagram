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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData as Category[]);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build query string
    const queryParams = new URLSearchParams();
    if (searchParams.location)
      queryParams.set("location", searchParams.location);
    if (searchParams.type && searchParams.type !== "all")
      queryParams.set("type", searchParams.type);
    if (searchParams.maxPrice)
      queryParams.set("maxPrice", searchParams.maxPrice.toString());

    setLocation(`/properties?${queryParams.toString()}`);
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
            Lieu
          </label>
          <div className="relative">
            <MapPin className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              id="search-location"
              type="text"
              placeholder="Cotonou, Porto-Novo, Parakou..."
              className="w-full pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
              value={searchParams.location || ""}
              onChange={(e) =>
                setSearchParams({ ...searchParams, location: e.target.value })
              }
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
          <label
            htmlFor="search-type"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
          >
            Type de bien
          </label>
          <div className="relative">
            <Select
              value={searchParams.type}
              onValueChange={(value) =>
                setSearchParams({ ...searchParams, type: value as any })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-full pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base">
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
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <label
            htmlFor="search-price"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
          >
            Budget max
          </label>
          <div className="relative">
            <Select
              value={searchParams.maxPrice?.toString()}
              onValueChange={(value) =>
                setSearchParams({
                  ...searchParams,
                  maxPrice:
                    value && value !== "nomax" ? parseInt(value) : undefined,
                })
              }
            >
              <SelectTrigger className="w-full pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base">
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
