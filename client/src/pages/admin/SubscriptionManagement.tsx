import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { useNotificationActions } from "@/hooks/useNotificationActions";

interface SubscriptionRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  plan: "trial" | "basic" | "premium";
  status: "pending" | "approved" | "rejected";
  paymentStatus: "pending" | "confirmed";
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  userPhone?: string;
  userZone?: string;
  userCountry?: string;
}

const SubscriptionManagement = () => {
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<
    SubscriptionRequest[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { notifySubscriptionCreation } = useNotificationActions();

  useEffect(() => {
    loadSubscriptionRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, requests]);

  const loadSubscriptionRequests = async () => {
    try {
      const requestsRef = collection(db, "subscriptionRequests");
      const q = query(requestsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const requestsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as SubscriptionRequest[];

      setRequests(requestsData);
      setFilteredRequests(requestsData);
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de souscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    const query = searchQuery.toLowerCase();
    const filtered = requests.filter(
      (request) =>
        request.userName.toLowerCase().includes(query) ||
        request.userEmail.toLowerCase().includes(query) ||
        request.userPhone?.toLowerCase().includes(query) ||
        request.userZone?.toLowerCase().includes(query)
    );
    setFilteredRequests(filtered);
  };

  const handleApproveSubscription = async (request: SubscriptionRequest) => {
    try {
      // Mettre à jour le statut de la demande
      const requestRef = doc(db, "subscriptionRequests", request.id);
      await updateDoc(requestRef, {
        status: "approved",
        paymentStatus: "confirmed",
        updatedAt: new Date(),
      });

      // Mettre à jour le type d'abonnement de l'utilisateur
      const userRef = doc(db, "users", request.userId);
      await updateDoc(userRef, {
        subscriptionType: request.plan,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      });

      // Notifier l'utilisateur
      notifySubscriptionCreation(
        request.userId,
        request.userName,
        request.plan
      );

      toast({
        title: "Succès",
        description: "La souscription a été approuvée avec succès",
      });

      // Recharger les demandes
      loadSubscriptionRequests();
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la souscription",
        variant: "destructive",
      });
    }
  };

  const handleRejectSubscription = async (request: SubscriptionRequest) => {
    try {
      const requestRef = doc(db, "subscriptionRequests", request.id);
      await updateDoc(requestRef, {
        status: "rejected",
        updatedAt: new Date(),
      });

      toast({
        title: "Succès",
        description: "La demande a été rejetée",
      });

      loadSubscriptionRequests();
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la demande",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: SubscriptionRequest["status"]) => {
    const statusConfig: Record<string, { label: string; variant: string; icon: React.ElementType }> = {
      pending: { label: "En attente", variant: "warning", icon: Clock },
      approved: { label: "Approuvé", variant: "success", icon: CheckCircle2 },
      rejected: { label: "Rejeté", variant: "destructive", icon: XCircle },
    };

    const config = statusConfig[status as string] ?? { label: status ?? "Inconnu", variant: "secondary", icon: AlertCircle };
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant as any}
        className="flex items-center gap-1"
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold">
                    Gestion des Souscriptions
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2">
                    Gérez les demandes de souscription des utilisateurs
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher une demande..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-64 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                  <Button
                    onClick={loadSubscriptionRequests}
                    variant="outline"
                    className="bg-white/50 backdrop-blur-sm"
                  >
                    Actualiser
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="relative overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        {getStatusBadge(request.status)}
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {request.userName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {request.userEmail}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-sm">
                              {request.plan === "basic"
                                ? "Basic"
                                : request.plan === "premium"
                                ? "Premium"
                                : "Trial"}
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                              {request.amount} FCFA
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Téléphone: {request.userPhone || "Non renseigné"}
                            </p>
                            <p className="text-muted-foreground">
                              Zone: {request.userZone || "Non renseignée"}
                            </p>
                            <p className="text-muted-foreground">
                              Pays: {request.userCountry || "Non renseigné"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Date de demande:{" "}
                              {format(request.createdAt, "PPp", { locale: fr })}
                            </p>
                            <p className="text-muted-foreground">
                              Dernière mise à jour:{" "}
                              {format(request.updatedAt, "PPp", { locale: fr })}
                            </p>
                          </div>
                        </div>

                        {request.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => handleRejectSubscription(request)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeter
                            </Button>
                            <Button
                              onClick={() => handleApproveSubscription(request)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Approuver
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredRequests.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Aucune demande de souscription trouvée
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SubscriptionManagement;
