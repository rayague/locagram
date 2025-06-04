import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Mail, Phone, Send } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyId: string;
  author: {
    name: string;
    email?: string;
    phone?: string;
    id: string;
  };
}

export default function ContactModal({
  isOpen,
  onClose,
  propertyTitle,
  propertyId,
  author,
}: ContactModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("📝 Début de la soumission du formulaire");
      console.log("📦 Données du formulaire:", formData);

      // Valider les données
      if (
        !formData.senderName.trim() ||
        !formData.senderEmail.trim() ||
        !formData.senderPhone.trim() ||
        !formData.message.trim()
      ) {
        throw new Error("Tous les champs sont obligatoires");
      }

      // Générer un browserToken unique
      const browserToken = Math.random().toString(36).substring(2, 15);

      // Sauvegarder le message dans la collection messages
      const messageData = {
        browserToken,
        createdAt: serverTimestamp(),
        message: formData.message.trim(),
        propertyId,
        propertyTitle,
        read: false,
        receiverId: author.id,
        senderEmail: formData.senderEmail.trim(),
        senderName: formData.senderName.trim(),
        senderPhone: formData.senderPhone.trim(),
        status: "sent",
      };

      const docRef = await addDoc(collection(db, "messages"), messageData);

      console.log("✅ Message enregistré avec ID:", docRef.id);

      // Afficher le succès
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès.",
        variant: "default",
      });

      // Réinitialiser et fermer
      setFormData({
        senderName: "",
        senderEmail: "",
        senderPhone: "",
        message: "",
      });
      onClose();
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du message:", error);

      toast({
        title: "Erreur d'envoi",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contacter l'annonceur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) =>
                    setFormData({ ...formData, senderName: e.target.value })
                  }
                  required
                  className="pl-10"
                  placeholder="Votre nom complet"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  value={formData.senderEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, senderEmail: e.target.value })
                  }
                  required
                  className="pl-10"
                  placeholder="exemple@email.com"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="tel"
                  value={formData.senderPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, senderPhone: e.target.value })
                  }
                  required
                  className="pl-10"
                  placeholder="+229 00 00 00 00"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                className="min-h-[120px] resize-none"
                placeholder="Votre message..."
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <Send className="mr-2 h-4 w-4" />
            {isLoading ? "Envoi en cours..." : "Envoyer le message"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
