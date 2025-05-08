import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Testimonial } from '@/lib/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}

export default function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  return (
    <motion.div 
      className="min-w-[350px] max-w-md bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center mb-6">
        <div className="text-amber-400 flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : ''}`} 
            />
          ))}
        </div>
      </div>
      
      <blockquote className="text-gray-600 dark:text-gray-300 mb-6">
        "{testimonial.comment}"
      </blockquote>
      
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4">
          <img 
            src={testimonial.avatar} 
            alt={`Portrait de ${testimonial.name}`} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {testimonial.role} à {testimonial.location}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
