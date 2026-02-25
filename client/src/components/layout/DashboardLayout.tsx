import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Home,
  LogOut,
  User,
  ListFilter,
  Plus,
  MessageSquare,
  CreditCard,
  Settings,
  Menu,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { Notification } from "@/components/ui/notification";
import { useNotifications } from "@/contexts/NotificationContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: Home },
  { name: "Mon profil", href: "/dashboard/profile", icon: User },
  { name: "Mes annonces", href: "/dashboard/listings", icon: ListFilter },
  { name: "Créer une annonce", href: "/dashboard/create-listing", icon: Plus },
  {
    name: "Réservations",
    href: "/dashboard/reservations",
    icon: MessageSquare,
  },
  { name: "Abonnement", href: "/dashboard/subscription", icon: CreditCard },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut, LogoutDialog } = useAuth();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { unreadCount, notifications, markAsRead } = useNotifications();

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-background">
      <LogoutDialog />

      {/* Header fixe */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <span className="text-xl bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Locagram
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Notification
              unreadCount={unreadCount}
              notifications={notifications}
              onMarkAsRead={markAsRead}
            />
          </div>
        </div>
      </header>

      {/* Sidebar fixe */}
      <aside
        className={cn(
          "fixed top-16 left-0 bottom-0 w-64 bg-background border-r z-40 transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Profil utilisateur */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "text-muted-foreground hover:bg-green-50/50 hover:text-green-700"
                    )}
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        isActive
                          ? "text-green-600"
                          : "text-muted-foreground group-hover:text-green-600"
                      )}
                    />
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-green-600" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bouton de déconnexion */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50/50"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay pour mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <main className="min-h-screen pt-16 md:pl-64">
        <div className="h-full p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
