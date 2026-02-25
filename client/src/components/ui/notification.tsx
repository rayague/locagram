import React from "react";
import { Bell } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Badge } from "./badge";
import { useLocation } from "wouter";

interface NotificationProps {
  unreadCount: number;
  notifications: Array<{
    id: string;
    message: string;
    createdAt: Date;
    read: boolean;
  }>;
  onMarkAsRead: (id: string) => void;
}

export function Notification({
  unreadCount,
  notifications,
  onMarkAsRead,
}: NotificationProps) {
  const [, setLocation] = useLocation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => notifications.forEach((n) => onMarkAsRead(n.id))}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                onClick={() => {
                  if (!notification.read) {
                    onMarkAsRead(notification.id);
                  }
                  setLocation("/dashboard/messages");
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{notification.message}</span>
                  {!notification.read && (
                    <Badge variant="secondary" className="ml-2">
                      Nouveau
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {notification.createdAt.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
