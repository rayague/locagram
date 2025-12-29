import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useParallax } from '@/hooks/use-parallax';
import { HERO_PROPERTIES } from '@/lib/constants';
import SearchBar from './SearchBar';

export default function HeroSection() {
  const { ref: parallaxRef } = useParallax<HTMLDivElement>(0.2);
  const [currentBg, setCurrentBg] = useState(0);

  // Cycle through background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_PROPERTIES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden parallax-container">
      {/* Background image with parallax effect */}
      <motion.div 
        ref={parallaxRef}
        className="absolute inset-0 parallax-element transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url(${HERO_PROPERTIES[currentBg]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-screen">
        <motion.div 
          className="max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="inline-block px-3 py-1 text-xs font-medium bg-primary-500/90 text-white rounded-full mb-4 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            La référence immobilière locale
          </motion.span>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Découvrez des propriétés <span className="text-primary-400">exceptionnelles</span> près de chez vous
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Explorer, acheter ou louer des biens immobiliers de prestige dans les plus beaux endroits près de chez vous.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <SearchBar />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <a 
            href="#featured" 
            className="block text-white p-2 animate-bounce"
          >
            <ChevronDown className="w-6 h-6" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
