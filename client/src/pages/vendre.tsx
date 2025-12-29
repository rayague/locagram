import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionHeading from "@/components/common/SectionHeading";
import {
  User,
  Mail,
  Phone,
  Home,
  MapPin,
  MessageSquare,
  Send,
} from "lucide-react";

export default function VendrePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    location: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

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
              Vendez votre bien immobilier
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Confiez-nous la vente de votre bien. Notre expertise et notre
              réseau vous garantissent une transaction réussie.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Pourquoi nous choisir ?"
            subtitle="Nous vous accompagnons à chaque étape de la vente de votre bien"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Expertise locale</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Notre connaissance approfondie du marché immobilier local
                vous garantit une estimation précise et une vente optimale.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Visibilité maximale</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nous mettons en valeur votre bien grâce à des photos
                professionnelles et une présentation soignée sur notre
                plateforme.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Accompagnement personnalisé
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Un agent dédié vous accompagne tout au long du processus de
                vente, de l'estimation à la signature finale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact form section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SectionHeading
              title="Contactez-nous"
              subtitle="Remplissez le formulaire ci-dessous pour nous présenter votre bien"
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
                    Type de bien
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.propertyType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertyType: e.target.value,
                        })
                      }
                      required
                      className="pl-10"
                      placeholder="Ex: Appartement, Maison, Villa..."
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2">
                  Localisation
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                    className="pl-10"
                    placeholder="Adresse du bien"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2">
                  Description du bien
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    className="pl-10 min-h-[120px] resize-none"
                    placeholder="Décrivez votre bien en détail..."
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg px-6 py-3 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer la demande</span>
              </Button>
            </form>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
