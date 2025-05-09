import { motion } from 'framer-motion';
import {
  Home,
  Users,
  MessageSquare,
  Package,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for statistics
const stats = [
  {
    name: 'Annonces actives',
    value: '156',
    change: '+12%',
    trend: 'up',
    icon: Home,
  },
  {
    name: 'Nouveaux clients',
    value: '24',
    change: '+8%',
    trend: 'up',
    icon: Users,
  },
  {
    name: 'Messages non lus',
    value: '8',
    change: '-2',
    trend: 'down',
    icon: MessageSquare,
  },
  {
    name: 'Réservations',
    value: '42',
    change: '+15%',
    trend: 'up',
    icon: Package,
  },
];

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    type: 'new_booking',
    message: 'Nouvelle réservation pour Villa Luxe',
    time: 'Il y a 5 minutes',
  },
  {
    id: 2,
    type: 'new_message',
    message: 'Message de Jean Dupont concernant Appartement Centre',
    time: 'Il y a 15 minutes',
  },
  {
    id: 3,
    type: 'new_listing',
    message: 'Nouvelle annonce publiée: Studio Moderne',
    time: 'Il y a 1 heure',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bonjour, {user?.name}
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Voici un aperçu de votre activité aujourd'hui
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <stat.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`ml-2 text-sm font-medium ${
                    stat.trend === 'up'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  vs mois dernier
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent activities */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Activités récentes
            </h2>
            <div className="mt-6 space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 