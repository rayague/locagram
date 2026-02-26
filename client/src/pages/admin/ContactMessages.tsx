import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Search, Send, Mail, Phone, User, Calendar } from "lucide-react";
import { ContactMessage } from "@/lib/types";

export default function ContactMessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [response, setResponse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "contactMessages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
      })) as ContactMessage[];
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSendResponse = async () => {
    if (!selectedMessage || !response.trim() || !user) return;

    try {
      const messageRef = doc(db, "contactMessages", selectedMessage.id);
      await updateDoc(messageRef, {
        status: "replied",
        response: {
          message: response,
          createdAt: Timestamp.now(),
          adminId: user.uid,
        },
      });

      toast({
        title: "Réponse envoyée",
        description: "Votre réponse a été envoyée avec succès.",
      });

      setResponse("");
      setSelectedMessage(null);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la réponse.",
        variant: "destructive",
      });
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: ContactMessage["status"]) => {
    const statusConfig = {
      new: { label: "Nouveau", color: "bg-blue-500" },
      read: { label: "Lu", color: "bg-yellow-500" },
      replied: { label: "Répondu", color: "bg-green-500" },
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} text-white`}>{config.label}</Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Messages de contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom, email ou sujet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Liste des messages */}
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <Card
                    key={message.id}
                    className={`cursor-pointer transition-all ${
                      selectedMessage?.id === message.id
                        ? "ring-2 ring-primary"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{message.name}</span>
                            {getStatusBadge(message.status)}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                            <Mail className="h-4 w-4" />
                            <span>{message.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                            <Phone className="h-4 w-4" />
                            <span>{message.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-2 font-medium">{message.subject}</p>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Détail du message et réponse */}
              <div>
                {selectedMessage ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">
                            De: {selectedMessage.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {selectedMessage.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedMessage.phone}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">Sujet</h4>
                          <p>{selectedMessage.subject}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Message</h4>
                          <p className="whitespace-pre-wrap">
                            {selectedMessage.message}
                          </p>
                        </div>

                        {selectedMessage.response ? (
                          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium">Réponse précédente</h4>
                            <p className="mt-2">
                              {selectedMessage.response.message}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Envoyée le{" "}
                              {new Date(
                                selectedMessage.response.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-6">
                            <h4 className="font-medium mb-2">Répondre</h4>
                            <Textarea
                              value={response}
                              onChange={(e) => setResponse(e.target.value)}
                              placeholder="Écrivez votre réponse..."
                              className="min-h-[120px]"
                            />
                            <Button
                              onClick={handleSendResponse}
                              className="mt-4 w-full flex items-center justify-center gap-2"
                              disabled={!response.trim()}
                            >
                              <Send className="h-4 w-4" />
                              <span>Envoyer la réponse</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Sélectionnez un message pour voir les détails
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
