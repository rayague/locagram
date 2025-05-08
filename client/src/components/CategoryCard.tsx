import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';
import { CategoryItem } from '@/lib/types';

interface CategoryCardProps {
  category: CategoryItem;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div 
      className="card-hover group rounded-xl overflow-hidden relative h-80 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 z-10"></div>
      <img 
        src={category.image} 
        alt={category.name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      <div className="absolute bottom-0 left-0 w-full p-6 z-20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold font-serif text-white">{category.name}</h3>
          <motion.span 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white transform transition-transform duration-300 group-hover:scale-110"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.span>
        </div>
        <p className="text-gray-300 text-sm">{category.description}</p>
      </div>
    </motion.div>
  );
}
