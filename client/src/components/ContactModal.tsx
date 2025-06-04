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
import { saveContactMessage } from "@/lib/firebase";
import { User, Mail, Phone, Send } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
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
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim() ||
        !formData.subject.trim() ||
        !formData.message.trim()
      ) {
        throw new Error("Tous les champs sont obligatoires");
      }

      // Sauvegarder le message
      console.log("💾 Tentative de sauvegarde du message...");
      const messageId = await saveContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      console.log("✅ Message enregistré avec ID:", messageId);

      // Afficher le succès
      toast({
        title: "Message envoyé",
        description: "Votre message a été enregistré avec succès.",
        variant: "default",
      });

      // Réinitialiser et fermer
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
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
          <DialogTitle>Nous contacter</DialogTitle>
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
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
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="pl-10"
                  placeholder="+229 00 00 00 00"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2">Sujet</label>
              <Input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
                placeholder="Sujet de votre message"
              />
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
