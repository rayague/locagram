import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Mail, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import HeroSection from "@/components/HeroSection";
import PropertyCard from "@/components/PropertyCard";
import CategoryCard from "@/components/CategoryCard";
import BenefitCard from "@/components/BenefitCard";
import TestimonialCard from "@/components/TestimonialCard";
import ParallaxSection from "@/components/ParallaxSection";
import ContactModal from "@/components/ContactModal";
import SectionHeading from "@/components/common/SectionHeading";
import { CATEGORIES, BENEFITS, TESTIMONIALS } from "@/lib/constants";
import { Property } from "@/lib/types";

export default function HomePage() {
  const { toast } = useToast();
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Fetch featured properties
  const { data: featuredProperties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  // Ajout d'une variable pour la couleur de fond principale
  const mainBg = "bg-white dark:bg-gray-900 transition-colors duration-300";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero section */}
      <HeroSection />

      {/* Featured properties */}
      <section id="featured" className={`py-20 ${mainBg}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Propriétés en vedette"
            subtitle="Découvrez notre sélection de biens immobiliers d'exception à travers le Bénin."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? // Loading state with skeleton cards
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse"
                  >
                    <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))
              : featuredProperties.map((property, index) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    index={index}
                  />
                ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg px-6 py-3 border border-green-700 transition-all duration-300"
            >
              <Link href="/louer" className="flex flex-row gap-2 items-center">
                <span>Voir toutes les propriétés</span>
                <ArrowRight className="w-4 flex h-4 " />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Parallax mission section */}
      <ParallaxSection
        backgroundImage="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
        title="L'expérience immobilière redéfinie"
        subtitle="Notre mission"
        description="Chez Locagram, nous vous proposons les meilleures propriétés du Bénin avec un service personnalisé et des outils numériques innovants pour faciliter votre investissement."
        buttonText="Découvrir notre histoire"
        buttonLink="/about"
      />

      {/* Categories */}
      <section className={`py-20 ${mainBg}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Explorez par catégorie"
            subtitle="Trouvez le bien immobilier qui correspond à votre style de vie et à vos besoins."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        className={`py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Pourquoi choisir Locagram"
            subtitle="Nous mettons tout en œuvre pour vous offrir une expérience immobilière exceptionnelle."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, index) => (
              <BenefitCard key={benefit.id} benefit={benefit} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 ${mainBg}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Ce que disent nos clients"
            subtitle="Découvrez les expériences de ceux qui nous ont fait confiance."
          />

          <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-500 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Prêt à trouver votre propriété idéale ?
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Rejoignez-nous dès aujourd'hui et laissez-nous vous aider à
              trouver le bien immobilier parfait pour vous au Bénin.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg px-6 py-3 border border-green-700 transition-all duration-300"
                onClick={() => setContactModalOpen(true)}
              >
                <Mail className="w-5 h-5 mr-2" />
                <span>Nous contacter</span>
              </Button>

              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg px-6 py-3 border border-green-700 transition-all duration-300"
              >
                <Link href="/louer" className="flex items-center">
                  <HomeIcon className="w-5 h-5 mr-2" />
                  <span>Explorer les propriétés</span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </motion.div>
  );
}
