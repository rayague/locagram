import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MoreVertical,
  Check,
  X,
  Clock,
  Calendar,
  User,
  Home,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for reservations
const reservations = [
  {
    id: 1,
    property: {
      title: 'Villa Luxe avec Piscine',
      type: 'Vente',
      price: '250,000,000 FCFA',
    },
    client: {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      phone: '+229 90 00 00 00',
    },
    status: 'pending',
    date: '2024-02-20',
    time: '14:30',
    createdAt: '2024-02-15',
  },
  {
    id: 2,
    property: {
      title: 'Appartement Moderne Centre-Ville',
      type: 'Location',
      price: '150,000 FCFA/mois',
    },
    client: {
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      phone: '+229 91 11 11 11',
    },
    status: 'confirmed',
    date: '2024-02-22',
    time: '10:00',
    createdAt: '2024-02-14',
  },
  {
    id: 3,
    property: {
      title: 'Studio Meublé',
      type: 'Location',
      price: '75,000 FCFA/mois',
    },
    client: {
      name: 'Pierre Durand',
      email: 'pierre.durand@example.com',
      phone: '+229 92 22 22 22',
    },
    status: 'cancelled',
    date: '2024-02-18',
    time: '16:00',
    createdAt: '2024-02-13',
  },
];

export default function ReservationsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.property.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      reservation.client.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || reservation.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Réservations
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Gérez les demandes de réservation
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une réservation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="cancelled">Annulée</option>
            </select>
            <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Filter className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Reservations list */}
        <div className="grid gap-6">
          {filteredReservations.map((reservation) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-4">
                    {/* Property info */}
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Home className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {reservation.property.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {reservation.property.type} - {reservation.property.price}
                        </p>
                      </div>
                    </div>

                    {/* Client info */}
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {reservation.client.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {reservation.client.email}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {reservation.client.phone}
                        </p>
                      </div>
                    </div>

                    {/* Date and time */}
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Date: {reservation.date}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Heure: {reservation.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                    {reservation.status === 'pending' && (
                      <>
                        <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg">
                          <Check className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Status badge */}
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      reservation.status === 'confirmed'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : reservation.status === 'cancelled'
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}
                  >
                    {reservation.status === 'confirmed'
                      ? 'Confirmée'
                      : reservation.status === 'cancelled'
                      ? 'Annulée'
                      : 'En attente'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Créée le {reservation.createdAt}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 