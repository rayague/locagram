import React, { useEffect, useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Mail, MessageSquare, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "user_registered":
      return "👤";
    case "user_updated":
      return "✏️";
    case "user_status_changed":
      return "🔄";
    case "listing_created":
      return "📝";
    case "listing_updated":
      return "📋";
    case "listing_deleted":
      return "🗑️";
    case "listing_status_changed":
      return "📊";
    case "subscription_created":
      return "💳";
    case "subscription_updated":
      return "🔄";
    case "subscription_expired":
      return "⚠️";
    default:
      return "📢";
  }
};

interface ContactMessage {
  id: string;
  createdAt: Timestamp;
  email: string;
  message: string;
  name: string;
  phone: string;
  subject: string;
  type: string;
}

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const messagesRef = collection(db, "contact-messages");
      const q = query(messagesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ContactMessage[];

      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (type: "email" | "whatsapp", contact: string) => {
    const url =
      type === "email"
        ? `mailto:${contact}`
        : `https://wa.me/${contact.replace(/\D/g, "")}`;
    window.open(url, "_blank");
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            {notifications.some((n) => !n.read) && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="text-sm"
              >
                Tout marquer comme lu
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Aucune notification
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-6 hover:bg-accent cursor-pointer transition-colors",
                        !notification.read && "bg-accent/50"
                      )}
                      onClick={() =>
                        !notification.read && markAsRead(notification.id)
                      }
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className="text-3xl"
                          role="img"
                          aria-label={notification.type}
                        >
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(
                                notification.createdAt instanceof Timestamp
                                  ? notification.createdAt.toDate()
                                  : notification.createdAt,
                                "PPp",
                                { locale: fr }
                              )}
                            </p>
                          </div>
                          <p className="text-muted-foreground">
                            {notification.message}
                          </p>
                          {notification.data && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(notification.data, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Messages de Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Aucun message
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-medium">{message.subject}</h3>
                          <p className="text-sm text-muted-foreground">
                            De: {message.name}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            message.createdAt.toDate(),
                            "d MMMM yyyy 'à' HH:mm:ss",
                            { locale: fr }
                          )}
                        </p>
                      </div>

                      <p className="mt-2 text-sm">{message.message}</p>

                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {message.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {message.phone}
                        </div>

                        <div className="ml-auto">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Répondre
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleReply("email", message.email)
                                }
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Répondre par email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleReply("whatsapp", message.phone)
                                }
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Répondre par WhatsApp
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
