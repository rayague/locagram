import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Bell,
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getAllContactMessages } from "@/lib/firebase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";

export default function AdminNotificationsPage() {
  return (
    <AdminProtectedRoute>
      <NotificationsContent />
    </AdminProtectedRoute>
  );
}

function NotificationsContent() {
  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: getAllContactMessages,
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
              >
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-lg">
            <h3 className="text-lg font-medium">Erreur</h3>
            <p>Une erreur est survenue lors du chargement des notifications.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary-500" />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
          <Badge variant="secondary" className="text-sm">
            {messages?.length || 0} message{messages?.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
          <div className="space-y-4">
            {messages?.map((message) => {
              return (
                <div
                  key={message.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-50 dark:bg-primary-900/10 p-2 rounded-full">
                        <MessageSquare className="h-5 w-5 text-primary-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">{message.subject}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {message.name}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        message.status === "read" ? "secondary" : "default"
                      }
                    >
                      {message.status === "read" ? "Lu" : "Non lu"}
                    </Badge>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                    {message.message}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${message.email}`}
                        className="hover:text-primary-500"
                      >
                        {message.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a
                        href={`tel:${message.phone}`}
                        className="hover:text-primary-500"
                      >
                        {message.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(message.createdAt, "d MMMM yyyy 'à' HH:mm", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{message.type}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </AdminLayout>
  );
}
