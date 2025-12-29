import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/common/SectionHeading";

export default function AboutPage() {
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
              À propos de nous
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Découvrez l'histoire de notre entreprise et notre engagement pour
              l'excellence immobilière partout.
            </p>
          </div>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SectionHeading
              title="Notre histoire"
              subtitle="Une vision, une passion, une expertise"
            />

            <div className="prose dark:prose-invert max-w-none mt-12">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Fondée en 2010, notre entreprise s'est construite sur des
                valeurs fortes d'intégrité, de professionnalisme et de service
                client. Nous avons commencé avec une petite équipe passionnée et
                avons grandi pour devenir l'un des acteurs majeurs de
                l'immobilier partout.
              </p>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Notre mission est de transformer l'expérience immobilière en
                offrant un service personnalisé et innovant. Nous croyons que
                chaque transaction immobilière est unique et mérite une
                attention particulière.
              </p>

              <p className="text-lg text-gray-600 dark:text-gray-300">
                Aujourd'hui, nous sommes fiers de notre réseau d'experts et de
                notre portefeuille diversifié de propriétés. Notre engagement
                envers l'excellence nous a permis de construire une réputation
                solide dans le secteur immobilier local.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Nos valeurs"
            subtitle="Les principes qui guident notre action"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Intégrité</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nous agissons avec honnêteté et transparence dans toutes nos
                transactions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nous visons la perfection dans chaque aspect de notre service.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nous repoussons les limites pour offrir des solutions
                innovantes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
