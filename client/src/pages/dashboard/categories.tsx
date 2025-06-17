import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreVertical, Edit, Trash } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getCategories } from "@/lib/firebase";

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function CategoriesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await getCategories();

        // Utiliser un Map pour garder uniquement la première occurrence de chaque catégorie
        const uniqueMap = new Map();
        fetchedCategories.forEach((category) => {
          const normalizedName = category.name.toLowerCase().trim();
          if (!uniqueMap.has(normalizedName)) {
            uniqueMap.set(normalizedName, category);
          }
        });

        // Convertir le Map en tableau et trier par nom
        const uniqueCategories = Array.from(uniqueMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
        );

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories:", err);
        setError("Une erreur est survenue lors du chargement des catégories");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-500">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Catégories
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Gérez les catégories disponibles pour les démarcheurs
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle catégorie
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Filter className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-2xl">📁</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-red-500">
                      <Trash className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {category.description || "Aucune description"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
