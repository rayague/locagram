import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Home, Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-serif font-bold">Locagram</span>
            </Link>
            
            <p className="text-gray-400 mb-6">
              La référence immobilière au Bénin pour l'achat, la vente et la location de biens de prestige.
            </p>
            
            <div className="flex space-x-4">
              <motion.a 
                href={COMPANY_INFO.social.facebook} 
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href={COMPANY_INFO.social.instagram} 
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href={COMPANY_INFO.social.twitter} 
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href={COMPANY_INFO.social.linkedin} 
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-6">Liens rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/properties?status=for_sale" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Acheter un bien
                </Link>
              </li>
              <li>
                <Link href="/properties?status=for_rent" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Louer un bien
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Vendre un bien
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Estimation gratuite
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Conseils immobiliers
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-6">À propos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Notre histoire
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Notre équipe
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Carrières
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Presse
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-6">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                <span className="text-gray-400">{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-primary-500 mr-3" />
                <span className="text-gray-400">{COMPANY_INFO.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-primary-500 mr-3" />
                <span className="text-gray-400">{COMPANY_INFO.email}</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-5 h-5 text-primary-500 mr-3" />
                <span className="text-gray-400">{COMPANY_INFO.hours}</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 Locagram. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">
                Plan du site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
