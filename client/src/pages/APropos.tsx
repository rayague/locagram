import { motion } from 'framer-motion';
import { Building2, Users, Award, Heart } from 'lucide-react';

const stats = [
  { id: 1, name: 'Biens immobiliers', value: '1000+' },
  { id: 2, name: 'Clients satisfaits', value: '500+' },
  { id: 3, name: 'Années d\'expérience', value: '10+' },
  { id: 4, name: 'Agents immobiliers', value: '50+' }
];

const values = [
  {
    id: 1,
    name: 'Expertise',
    description: 'Notre équipe d\'experts vous accompagne à chaque étape de votre projet immobilier.',
    icon: Award
  },
  {
    id: 2,
    name: 'Confiance',
    description: 'Nous construisons des relations durables basées sur la transparence et l\'honnêteté.',
    icon: Heart
  },
  {
    id: 3,
    name: 'Innovation',
    description: 'Nous utilisons les dernières technologies pour simplifier vos transactions immobilières.',
    icon: Building2
  },
  {
    id: 4,
    name: 'Service',
    description: 'Notre priorité est votre satisfaction, nous sommes là pour vous servir.',
    icon: Users
  }
];

export default function AProposPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative py-20 bg-gradient-to-r from-green-600 to-green-800">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                À propos de nous
              </h1>
              <p className="text-xl text-white/90">
                Votre partenaire de confiance dans l'immobilier depuis plus de 10 ans
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.id * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Nos valeurs
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Ces principes guident chacune de nos actions et décisions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: value.id * 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {value.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Notre équipe
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Des professionnels passionnés à votre service
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team member cards would go here */}
              <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm">
                <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Jean Dupont
                  </h3>
                  <p className="text-green-600 dark:text-green-400 mb-4">
                    Directeur Général
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Plus de 15 ans d'expérience dans l'immobilier
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm">
                <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Marie Martin
                  </h3>
                  <p className="text-green-600 dark:text-green-400 mb-4">
                    Responsable Commerciale
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Expertise en négociation immobilière
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm">
                <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Pierre Durand
                  </h3>
                  <p className="text-green-600 dark:text-green-400 mb-4">
                    Expert Immobilier
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Spécialiste en investissement immobilier
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 