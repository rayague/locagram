import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Phone, Search, WhatsappIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  receiverId: string;
  createdAt: Date;
  listingId: string;
  listingTitle: string;
  status: "unread" | "read";
}

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("receiverId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Message[];

      setMessages(messagesData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredMessages = messages.filter(
    (message) =>
      message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.listingTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContact = (message: Message) => {
    setSelectedMessage(message);
    setIsContactModalOpen(true);
  };

  const handleEmailContact = () => {
    if (selectedMessage) {
      window.location.href = `mailto:${selectedMessage.senderEmail}?subject=Re: ${selectedMessage.listingTitle}`;
    }
    setIsContactModalOpen(false);
  };

  const handleWhatsAppContact = () => {
    if (selectedMessage) {
      // Formater le numéro de téléphone pour WhatsApp
      const formattedPhone = selectedMessage.senderPhone.replace(/\D/g, "");
      window.open(`https://wa.me/${formattedPhone}`, "_blank");
    }
    setIsContactModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">
            Gérez vos messages et demandes de contact
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Rechercher par nom ou titre d'annonce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Messages List */}
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">Chargement des messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">Aucun message trouvé</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card key={message.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {message.senderName}
                      </CardTitle>
                      <CardDescription>
                        Pour : {message.listingTitle}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        message.status === "unread" ? "default" : "secondary"
                      }
                    >
                      {message.status === "unread" ? "Non lu" : "Lu"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{message.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {message.createdAt.toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleContact(message)}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contacter
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Contact Modal */}
        <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choisir le moyen de contact</DialogTitle>
              <DialogDescription>
                Comment souhaitez-vous contacter {selectedMessage?.senderName} ?
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleEmailContact}
              >
                <Mail className="h-4 w-4" />
                Contacter par email
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleWhatsAppContact}
              >
                <Phone className="h-4 w-4" />
                Contacter par WhatsApp
              </Button>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setIsContactModalOpen(false)}
              >
                Annuler
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
