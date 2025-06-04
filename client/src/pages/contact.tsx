import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionHeading from "@/components/common/SectionHeading";
import { useToast } from "@/hooks/use-toast";
import { saveContactMessage } from "@/lib/firebase";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  MessageSquare,
  Send,
} from "lucide-react";

export default function ContactPage() {
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
      console.log("📝 Tentative d'envoi du message:", formData);

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
      const messageId = await saveContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      console.log("✅ Message envoyé avec succès, ID:", messageId);

      // Notification de succès
      toast({
        title: "Message envoyé",
        description:
          "Nous avons bien reçu votre message. Nous vous répondrons dans les plus brefs délais.",
      });

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("❌ Erreur:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'envoi du message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphone",
      content: "+229 90 00 00 00",
      description: "Du lundi au vendredi, 8h-18h",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "contact@locagram.bj",
      description: "Réponse sous 24h",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adresse",
      content: "123 Avenue de l'Indépendance",
      description: "Cotonou, Bénin",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Horaires",
      content: "Lundi - Vendredi",
      description: "8h00 - 18h00",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-gray-900"
    >
      {/* Hero section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-green-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Notre équipe est à votre disposition pour répondre à toutes vos
              questions et vous accompagner dans vos projets immobiliers.
            </p>
          </div>
        </div>
      </section>

      {/* Contact info section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
              >
                <div className="text-green-600 dark:text-green-400 mb-4 flex justify-center">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{info.title}</h3>
                <p className="text-gray-900 dark:text-white font-medium mb-2">
                  {info.content}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SectionHeading
              title="Envoyez-nous un message"
              subtitle="Nous vous répondrons dans les plus brefs délais"
            />

            <form
              onSubmit={handleSubmit}
              className="mt-12 space-y-6 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Sujet
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                      className="pl-10"
                      placeholder="Sujet de votre message"
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
