import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Home,
  Users,
  MessageSquare,
  Settings,
  Package,
  Tag,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  BarChart2,
  CreditCard,
  Shield,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  demarcheurOnly?: boolean;
}

const sidebarItems: SidebarItem[] = [
  // Éléments communs
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Annonces', href: '/dashboard/annonces', icon: Home },
  { name: 'Réservations', href: '/dashboard/reservations', icon: Package },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  
  // Éléments admin uniquement
  { name: 'Utilisateurs', href: '/dashboard/users', icon: Users, adminOnly: true },
  { name: 'Statistiques', href: '/dashboard/stats', icon: BarChart2, adminOnly: true },
  { name: 'Forfaits', href: '/dashboard/forfaits', icon: CreditCard, adminOnly: true },
  { name: 'Catégories', href: '/dashboard/categories', icon: Tag, adminOnly: true },
  { name: 'Signalements', href: '/dashboard/signalements', icon: AlertCircle, adminOnly: true },
  { name: 'Contact', href: '/dashboard/contact', icon: Mail, adminOnly: true },
  
  // Éléments démarcheur uniquement
  { name: 'Mon Profil', href: '/dashboard/profile', icon: Shield, demarcheurOnly: true },
  { name: 'Mes Statistiques', href: '/dashboard/mes-stats', icon: BarChart2, demarcheurOnly: true },
  { name: 'Mon Forfait', href: '/dashboard/mon-forfait', icon: CreditCard, demarcheurOnly: true },
  
  // Éléments communs
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <motion.div
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 80 : 240 }}
      className="h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4">
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Locagram
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            // Filtrer les éléments selon le rôle
            if (item.adminOnly && user?.role !== 'admin') return null;
            if (item.demarcheurOnly && user?.role !== 'demarcheur') return null;
            
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Déconnexion</span>}
          </button>
        </div>
      </div>
    </motion.div>
  );
} 