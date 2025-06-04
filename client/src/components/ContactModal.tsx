import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Phone, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { generateBrowserToken, sendContactMessage } from "@/lib/firebase";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
  propertyId: string;
  author?: {
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author?.id || !propertyId || !propertyTitle) {
      toast.error("Informations manquantes pour l'envoi du message");
      return;
    }

    try {
      setIsSubmitting(true);

      // Récupère ou génère le token du navigateur
      const browserToken = generateBrowserToken();

      // Prépare les données du message
      const messageData = {
        senderName: formData.name,
        senderEmail: formData.email,
        senderPhone: formData.phone,
        message: formData.message,
        propertyId,
        propertyTitle,
        receiverId: author.id,
        browserToken,
      };

      // Envoie le message
      await sendContactMessage(messageData);

      // Affiche une notification de succès
      toast.success("Message envoyé avec succès!", {
        description: "L'annonceur vous répondra dans les plus brefs délais.",
        duration: 5000,
      });

      // Réinitialise le formulaire et ferme la modal
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      onClose();
    } catch (error: any) {
      // Affiche une notification d'erreur
      toast.error(error.message || "Erreur lors de l'envoi du message", {
        description: "Veuillez réessayer plus tard.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                  Contacter l'annonceur
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {propertyTitle && (
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {propertyTitle}
                </p>
              )}
              {author && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <div className="font-medium text-gray-900 dark:text-white mb-2">
                      Informations de l'annonceur:
                    </div>
                    <p>{author.name}</p>
                    {author.phone && <p>Tél: {author.phone}</p>}
                    {author.email && <p>Email: {author.email}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Votre nom"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Votre email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  placeholder="Votre message"
                  rows={3}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Envoyer le message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
