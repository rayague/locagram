import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParallax } from '@/hooks/use-parallax';

interface ParallaxSectionProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function ParallaxSection({
  backgroundImage,
  title,
  subtitle,
  description,
  buttonText,
  buttonLink
}: ParallaxSectionProps) {
  const { ref: parallaxRef } = useParallax<HTMLDivElement>(0.3);

  return (
    <section className="relative py-24 overflow-hidden parallax-container">
      {/* Background image with parallax effect */}
      <motion.div 
        ref={parallaxRef}
        className="absolute inset-0 parallax-element"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)'
        }}
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="inline-block px-3 py-1 text-xs font-medium bg-primary-500/90 text-white rounded-full mb-4 shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {subtitle}
          </motion.span>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-serif font-bold text-white mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-300 mb-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-100 text-primary-600 font-display font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <a href={buttonLink}>
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
