import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Calendar,
  Check,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  Search,
  X,
  MailOpen,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  addDoc,
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
  read: boolean;
}

const Reservations = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (!user?.uid) {
        console.log("Aucun utilisateur connecté");
        setIsLoading(false);
        return;
      }

      try {
        console.log("État de l'utilisateur:", user);
        console.log("UID de l'utilisateur:", user.uid);

        const messagesRef = collection(db, "messages");

        // Vérifier d'abord tous les messages
        const allMessagesSnapshot = await getDocs(messagesRef);
        console.log(
          "Nombre total de messages dans la collection:",
          allMessagesSnapshot.size
        );
        allMessagesSnapshot.forEach((doc) => {
          console.log("Message trouvé:", {
            id: doc.id,
            ...doc.data(),
          });
        });

        // Créer la requête filtrée
        const q = query(messagesRef, where("receiverId", "==", user.uid));

        // Vérifier les messages filtrés
        const filteredSnapshot = await getDocs(q);
        console.log(
          "Nombre de messages pour l'utilisateur:",
          filteredSnapshot.size
        );
        filteredSnapshot.forEach((doc) => {
          console.log("Message pour l'utilisateur:", {
            id: doc.id,
            ...doc.data(),
          });
        });

        // Configurer l'écoute en temps réel
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            console.log("Snapshot reçu, nombre de messages:", snapshot.size);

            if (snapshot.empty) {
              console.log("Aucun message trouvé pour l'utilisateur");
              setMessages([]);
              setIsLoading(false);
              return;
            }

            const messagesData = snapshot.docs.map((doc) => {
              const data = doc.data();
              console.log("Données du message:", data);

              return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
              } as Message;
            });

            console.log("Messages traités:", messagesData);

            const sortedMessages = messagesData.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            );

            setMessages(sortedMessages);
            setError(null);
            setIsLoading(false);

            snapshot.docChanges().forEach(async (change) => {
              if (change.type === "added") {
                const message = change.doc.data();

                // Créer une notification pour le nouveau message
                try {
                  await addDoc(collection(db, "notifications"), {
                    userId: user.uid,
                    message: `Nouveau message de ${message.senderName}`,
                    createdAt: new Date(),
                    read: false,
                    type: "message",
                    messageId: change.doc.id,
                  });
                } catch (error) {
                  console.error(
                    "Erreur lors de la création de la notification:",
                    error
                  );
                }
              }
            });
          },
          (error) => {
            console.error("Erreur détaillée:", error);
            setError(
              "Erreur lors de la récupération des messages: " + error.message
            );
            toast({
              title: "Erreur",
              description:
                "Impossible de charger les messages. Veuillez réessayer.",
              variant: "destructive",
            });
            setIsLoading(false);
          }
        );

        return () => {
          console.log("Nettoyage de l'écoute des messages");
          unsubscribe();
        };
      } catch (error) {
        console.error("Erreur détaillée lors du chargement:", error);
        setError(
          "Erreur lors du chargement des messages: " + (error as Error).message
        );
        toast({
          title: "Erreur",
          description:
            "Impossible de charger les messages. Veuillez réessayer.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [user]);

  const handleContact = (message: Message) => {
    setSelectedMessage(message);
    setIsContactModalOpen(true);
  };

  const handleEmailContact = () => {
    if (selectedMessage) {
      window.location.href = `mailto:${selectedMessage.senderEmail}`;
    }
    setIsContactModalOpen(false);
  };

  const handleWhatsAppContact = () => {
    if (selectedMessage) {
      const formattedPhone = selectedMessage.senderPhone.replace(/\D/g, "");
      window.open(`https://wa.me/${formattedPhone}`, "_blank");
    }
    setIsContactModalOpen(false);
  };

  const handleMarkAsRead = async (message: Message) => {
    try {
      const messageRef = doc(db, "messages", message.id);
      await updateDoc(messageRef, {
        read: true,
      });

      toast({
        title: "Message marqué comme lu",
        description: "Le message a été marqué comme lu avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors du marquage du message comme lu:", error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer le message comme lu.",
        variant: "destructive",
      });
    }
  };

  const [showReadMessages, setShowReadMessages] = useState(true);

  const filteredMessages = messages
    .filter((message) => showReadMessages || !message.read)
    .filter(
      (message) =>
        message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">
            Gérez vos messages et demandes de contact
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Rechercher par nom ou contenu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowReadMessages(!showReadMessages)}
            className="flex items-center gap-2"
          >
            <MailOpen className="h-4 w-4" />
            {showReadMessages
              ? "Masquer les messages lus"
              : "Afficher tous les messages"}
          </Button>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Messages List */}
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">Chargement des messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">Aucun message trouvé</p>
            {(searchTerm || !showReadMessages) && (
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("");
                  setShowReadMessages(true);
                }}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card
                key={message.id}
                className={message.read ? "opacity-75" : ""}
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {message.senderName}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContact(message)}
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Contacter
                        </Button>
                      </CardTitle>
                      <CardDescription>{message.senderEmail}</CardDescription>
                    </div>
                    <div className="flex items-center mt-2 sm:mt-0">
                      <div className="flex items-center mr-3 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {message.createdAt.toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {!message.read && (
                        <Badge variant="default" className="bg-blue-500">
                          Nouveau
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{message.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleContact(message)}
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Répondre
                    </Button>
                    {!message.read && (
                      <Button
                        variant="outline"
                        onClick={() => handleMarkAsRead(message)}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Marquer comme lu
                      </Button>
                    )}
                  </div>
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

export default Reservations;
