import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  ListFilter,
  MessageSquare,
  Plus as PlusIcon,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

interface DashboardStats {
  activeListings: number;
  totalViews: number;
  unreadMessages: number;
  activeListingsChange: string;
  totalViewsChange: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const today = new Date();
  const subscriptionEndDate =
    user?.subscriptionType === "trial"
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : null;

  // Calculate days remaining in subscription
  const daysRemaining = subscriptionEndDate
    ? Math.max(
        0,
        Math.ceil(
          (subscriptionEndDate.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  // Whether subscription is in trial period
  const isTrialPeriod = user?.subscriptionType === "trial";

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.uid) return;

      try {
        setIsLoading(true);
        setError(null);

        // Récupérer les annonces actives
        const listingsRef = collection(db, "listings");
        const activeListingsQuery = query(
          listingsRef,
          where("userId", "==", user.uid),
          where("status", "==", "active")
        );

        // Récupérer les messages non lus
        const messagesRef = collection(db, "messages");
        const unreadMessagesQuery = query(
          messagesRef,
          where("receiverId", "==", user.uid),
          where("read", "==", false)
        );

        // Écouter les changements en temps réel pour les annonces
        const unsubscribeListings = onSnapshot(
          activeListingsQuery,
          (snapshot) => {
            const activeListings = snapshot.docs.length;
            const totalViews = snapshot.docs.reduce(
              (sum, doc) => sum + (doc.data().views || 0),
              0
            );

            // Calculer le changement pour les annonces actives (comparaison avec la semaine dernière)
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const newListingsThisWeek = snapshot.docs.filter((doc) => {
              const createdAt = doc.data().createdAt?.toDate();
              return createdAt && createdAt > oneWeekAgo;
            }).length;

            // Calculer le changement pour les vues (comparaison avec le mois dernier)
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            const lastMonthViews = snapshot.docs.reduce((sum, doc) => {
              const views = doc.data().views || 0;
              const lastMonthViews = doc.data().lastMonthViews || 0;
              return sum + (views - lastMonthViews);
            }, 0);

            const viewsChange =
              lastMonthViews > 0
                ? `+${Math.round((lastMonthViews / totalViews) * 100)}% ce mois`
                : "0% ce mois";

            setStats((prevStats) => ({
              ...prevStats,
              activeListings,
              totalViews,
              activeListingsChange:
                newListingsThisWeek > 0
                  ? `+${newListingsThisWeek} cette semaine`
                  : "0 cette semaine",
              totalViewsChange: viewsChange,
            }));
          }
        );

        // Écouter les changements en temps réel pour les messages non lus
        const unsubscribeMessages = onSnapshot(
          unreadMessagesQuery,
          (snapshot) => {
            const unreadMessages = snapshot.docs.length;
            setStats((prevStats) => ({
              ...prevStats,
              unreadMessages,
            }));
          }
        );

        // Nettoyer les écouteurs lors du démontage
        return () => {
          unsubscribeListings();
          unsubscribeMessages();
        };
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(
          "Impossible de charger les données du tableau de bord. Veuillez réessayer plus tard."
        );
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données du tableau de bord.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Navigation handlers
  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Chargement du tableau de bord...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-destructive font-medium">{error}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    {
      title: "Annonces actives",
      value: stats?.activeListings?.toString() || "0",
      change: stats?.activeListingsChange || "0 cette semaine",
      icon: ListFilter,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      gradient: "from-blue-500 to-blue-600",
      description: "Annonces en ligne actuellement",
    },
    {
      title: "Vues totales",
      value: stats?.totalViews?.toLocaleString() || "0",
      change: stats?.totalViewsChange || "0% ce mois",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      gradient: "from-green-500 to-green-600",
      description: "Visiteurs sur vos annonces",
    },
    {
      title: "Messages",
      value: stats?.unreadMessages?.toString() || "0",
      change: "non lus",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      gradient: "from-orange-500 to-orange-600",
      description: "Messages non lus",
    },
  ];

  const dashboardContent = (
    <div className="space-y-6">
      {/* Welcome & Subscription Status */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight animate-fade-in">
            Bonjour, {user?.name}
          </h2>
          <p
            className="text-muted-foreground animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Voici un aperçu de votre activité récente et de vos statistiques.
          </p>
        </div>

        <Card className="w-full md:w-auto hover-lift transition-all-smooth">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-full ${
                  isTrialPeriod ? "bg-green-100" : "bg-amber-100"
                } ripple-effect`}
              >
                <Calendar
                  className={`h-5 w-5 ${
                    isTrialPeriod ? "text-green-600" : "text-amber-500"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isTrialPeriod ? "Période d'essai" : "Abonnement"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {daysRemaining} jours restants
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {statsCards.map((stat, i) => (
          <Card
            key={i}
            className="hover-lift transition-all-smooth animate-fade-in overflow-hidden group"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`h-1 w-full bg-gradient-to-r ${stat.gradient}`} />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {stat.change}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-black">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="hover-lift transition-all-smooth">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Actions rapides
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Accédez rapidement aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              className="h-24 flex flex-col items-center justify-center gap-2 p-6 hover:scale-[1.02] transition-transform bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-200 text-blue-700"
              variant="outline"
              onClick={() => handleNavigate("/dashboard/create-listing")}
            >
              <PlusIcon className="h-8 w-8" />
              <span className="text-lg font-medium">Nouvelle annonce</span>
              <span className="text-sm text-blue-600/80">
                Publier une nouvelle offre
              </span>
            </Button>

            <Button
              className="h-24 flex flex-col items-center justify-center gap-2 p-6 hover:scale-[1.02] transition-transform bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-100 hover:to-green-200 text-green-700"
              variant="outline"
              onClick={() => handleNavigate("/dashboard/reservations")}
            >
              <MessageSquare className="h-8 w-8" />
              <span className="text-lg font-medium">Voir messages</span>
              <span className="text-sm text-green-600/80">
                Gérer vos conversations
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardLayout>{dashboardContent}</DashboardLayout>;
};

export default Dashboard;
