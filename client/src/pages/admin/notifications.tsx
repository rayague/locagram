import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  UserCheck,
  Clock,
  Building,
  Briefcase,
  FileText,
  MapPin,
} from "lucide-react";
import {
  getAllContactMessages,
  getSubscriptionRequests,
  approveSubscriptionRequest,
  rejectSubscriptionRequest,
} from "@/lib/firebase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import { toast } from "sonner";

export default function AdminNotificationsPage() {
  return (
    <AdminProtectedRoute>
      <NotificationsContent />
    </AdminProtectedRoute>
  );
}

function NotificationsContent() {
  const [activeTab, setActiveTab] = useState<"subscriptions" | "messages">(
    "subscriptions"
  );
  const queryClient = useQueryClient();

  const {
    data: subscriptions,
    isLoading: loadingSubscriptions,
    error: subsError,
  } = useQuery({
    queryKey: ["subscription-requests"],
    queryFn: getSubscriptionRequests,
  });

  const {
    data: messages,
    isLoading: loadingMessages,
    error: msgError,
  } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: getAllContactMessages,
  });

  const approveMutation = useMutation({
    mutationFn: ({ requestId, userId }: { requestId: string; userId: string }) =>
      approveSubscriptionRequest(requestId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-requests"] });
      toast.success("Compte approuvé", {
        description: "L'utilisateur peut maintenant se connecter.",
      });
    },
    onError: () => {
      toast.error("Erreur lors de l'approbation");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ requestId, userId }: { requestId: string; userId: string }) =>
      rejectSubscriptionRequest(requestId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-requests"] });
      toast.success("Demande refusée", {
        description: "L'utilisateur a été notifié.",
      });
    },
    onError: () => {
      toast.error("Erreur lors du refus");
    },
  });

  const pendingCount = subscriptions?.filter((s) => s.status === "pending").length ?? 0;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          {pendingCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {pendingCount} en attente
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === "subscriptions"
                ? "bg-white dark:bg-gray-800 border border-b-white dark:border-b-gray-800 border-gray-200 dark:border-gray-700 text-green-600"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <UserCheck className="h-4 w-4" />
            Demandes d'inscription
            {pendingCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === "messages"
                ? "bg-white dark:bg-gray-800 border border-b-white dark:border-b-gray-800 border-gray-200 dark:border-gray-700 text-green-600"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Messages de contact
            {(messages?.length ?? 0) > 0 && (
              <span className="ml-1 bg-gray-400 text-white text-xs rounded-full px-1.5 py-0.5">
                {messages?.length}
              </span>
            )}
          </button>
        </div>

        {/* Subscription requests tab */}
        {activeTab === "subscriptions" && (
          <ScrollArea className="h-[calc(100vh-14rem)] pr-4">
            {loadingSubscriptions ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : subsError ? (
              <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-lg">
                <p>Erreur lors du chargement des demandes d'inscription.</p>
              </div>
            ) : subscriptions?.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Aucune demande d'inscription</p>
                <p className="text-sm mt-1">Les nouvelles inscriptions apparaîtront ici.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions?.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-full">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {req.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {req.userType} · {req.profession}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          req.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : req.status === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }
                      >
                        {req.status === "pending" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {req.status === "approved" && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {req.status === "rejected" && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {req.status === "pending"
                          ? "En attente"
                          : req.status === "approved"
                          ? "Approuvé"
                          : "Refusé"}
                      </Badge>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0" />
                        <a href={`mailto:${req.email}`} className="hover:text-green-600 truncate">
                          {req.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0" />
                        <a href={`tel:${req.phone}`} className="hover:text-green-600">
                          {req.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>
                          {req.region ? `${req.region}, ` : ""}
                          {req.country?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 shrink-0" />
                        <span>{req.agencyName || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0" />
                        <span>
                          {req.idType?.toUpperCase()} · {req.idNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>
                          {format(req.createdAt, "d MMM yyyy 'à' HH:mm", {
                            locale: fr,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons — only for pending requests */}
                    {req.status === "pending" && (
                      <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={
                            approveMutation.isPending || rejectMutation.isPending
                          }
                          onClick={() =>
                            approveMutation.mutate({
                              requestId: req.id,
                              userId: req.userId,
                            })
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={
                            approveMutation.isPending || rejectMutation.isPending
                          }
                          onClick={() =>
                            rejectMutation.mutate({
                              requestId: req.id,
                              userId: req.userId,
                            })
                          }
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Refuser
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}

        {/* Contact messages tab */}
        {activeTab === "messages" && (
          <ScrollArea className="h-[calc(100vh-14rem)] pr-4">
            {loadingMessages ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : msgError ? (
              <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-lg">
                <p>Erreur lors du chargement des messages de contact.</p>
              </div>
            ) : messages?.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Aucun message de contact</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {message.subject}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {message.name}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={message.status === "read" ? "secondary" : "default"}
                      >
                        {message.status === "read" ? "Lu" : "Non lu"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap text-sm">
                      {message.message}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${message.email}`} className="hover:text-green-600">
                          {message.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${message.phone}`} className="hover:text-green-600">
                          {message.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(message.createdAt, "d MMM yyyy 'à' HH:mm", {
                            locale: fr,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </div>
    </AdminLayout>
  );
}
