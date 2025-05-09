import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  UserPlus,
  Calendar,
  Mail,
  AlertTriangle,
  CreditCard,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  type: 'user' | 'reservation' | 'message' | 'report' | 'subscription' | 'validation';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'user',
    title: 'Nouvelle demande de compte',
    message: 'Jean Dupont a demandé la validation de son compte',
    time: 'Il y a 5 minutes',
    read: false,
  },
  {
    id: '2',
    type: 'reservation',
    title: 'Nouvelle réservation',
    message: 'Réservation pour Villa Luxe à Cotonou',
    time: 'Il y a 15 minutes',
    read: false,
  },
  {
    id: '3',
    type: 'message',
    title: 'Nouveau message',
    message: 'Message reçu via le formulaire de contact',
    time: 'Il y a 1 heure',
    read: true,
  },
  {
    id: '4',
    type: 'report',
    title: 'Signalement d\'annonce',
    message: 'Une annonce a été signalée comme non conforme',
    time: 'Il y a 2 heures',
    read: false,
  },
  {
    id: '5',
    type: 'subscription',
    title: 'Expiration de forfait',
    message: 'Votre forfait expire dans 7 jours',
    time: 'Il y a 1 jour',
    read: true,
  },
];

export default function NotificationsPanel() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'user':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case 'reservation':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'message':
        return <Mail className="h-5 w-5 text-purple-500" />;
      case 'report':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'subscription':
        return <CreditCard className="h-5 w-5 text-yellow-500" />;
      case 'validation':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (user?.role === 'admin') {
      return ['user', 'message', 'report'].includes(notification.type);
    } else {
      return ['reservation', 'subscription', 'validation'].includes(notification.type);
    }
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative"
      >
        <Bell className="h-5 w-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                      !notification.read ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Aucune notification
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 