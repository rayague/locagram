import { useAuth } from '@/contexts/AuthContext';

export default function DashboardFooter() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} ImmoNexus. Tous droits réservés.
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Connecté en tant que {user?.name}
          </div>
        </div>
      </div>
    </footer>
  );
} 