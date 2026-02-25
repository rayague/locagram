import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Building2,
  Settings,
  LogOut,
  Menu,
  User,
  Tags,
  Bell,
  CreditCard,
} from "lucide-react";

interface AdminNavProps {
  isMobile: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
  onLogout: () => void;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  {
    title: "Vue d'ensemble",
    icon: BarChart3,
    path: "/admin",
  },
  {
    title: "Profil",
    icon: User,
    path: "/admin/profile",
  },
  {
    title: "Utilisateurs",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Annonces",
    icon: Building2,
    path: "/admin/listings",
  },
  {
    title: "Catégories",
    icon: Tags,
    path: "/admin/categories",
  },
  {
    title: "Souscriptions",
    icon: CreditCard,
    path: "/admin/subscriptions",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "/admin/notifications",
  },
  {
    title: "Paramètres",
    icon: Settings,
    path: "/admin/settings",
  },
];

const AdminNav: React.FC<AdminNavProps> = ({
  isMobile,
  isCollapsed = false,
  onClose,
  onToggleCollapse,
  onLogout,
}) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [location, setLocation] = useLocation();

  const handleNavigation = (path: string) => {
    setLocation(path);
    if (onClose) onClose();
  };

  return (
    <div className="h-full flex flex-col bg-white/80 backdrop-blur-md border-r border-green-100/50">
      <div className="p-4 flex items-center border-b border-green-100/50">
        {isCollapsed ? (
          <div className="text-2xl font-bold w-full text-center bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            ADM
          </div>
        ) : (
          <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Administration
          </div>
        )}
        {!isMobile && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="ml-auto hover:bg-green-50/50"
          >
            <Menu className="h-5 w-5 text-green-600" />
          </Button>
        )}
      </div>

      <div className="flex flex-col space-y-2 p-3 flex-1">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const isNotifications = item.path === "/admin/notifications";

          return (
            <Button
              key={item.title}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "justify-start relative h-11 transition-all duration-200",
                !isCollapsed && "px-3",
                isActive
                  ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-sm hover:from-green-700 hover:to-green-600"
                  : "hover:bg-green-50/50 text-gray-700 hover:text-green-700",
                "group"
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  !isCollapsed && "mr-3",
                  isActive
                    ? "text-white"
                    : "text-green-600 group-hover:text-green-700"
                )}
              />
              {!isCollapsed && (
                <>
                  <span className="font-medium">{item.title}</span>
                  {isNotifications && unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute right-3 top-1/2 -translate-y-1/2 shadow-sm"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          );
        })}
      </div>

      <div className="mt-auto p-4 border-t border-green-100/50">
        {!isCollapsed && (
          <div className="flex items-center space-x-3 mb-3 p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-green-100/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center text-white font-medium shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
                {user?.name}
              </div>
              <div className="text-xs text-gray-500 truncate max-w-[140px]">
                {user?.email}
              </div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            "w-full h-11 transition-all duration-200",
            !isCollapsed ? "justify-start px-3" : "justify-center px-2",
            "text-red-600 hover:text-red-700 hover:bg-red-50/50"
          )}
          onClick={onLogout}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Déconnexion"}
        </Button>
      </div>
    </div>
  );
};

export default AdminNav;
