import { motion } from 'framer-motion';
import { CheckCircle, User, Shield } from 'lucide-react';
import { Benefit } from '@/lib/types';

interface BenefitCardProps {
  benefit: Benefit;
  index?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  'check-circle': <CheckCircle className="w-7 h-7 text-primary-500" />,
  'user': <User className="w-7 h-7 text-primary-500" />,
  'shield': <Shield className="w-7 h-7 text-primary-500" />
};

export default function BenefitCard({ benefit, index = 0 }: BenefitCardProps) {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
        {iconMap[benefit.icon]}
      </div>
      
      <h3 className="text-xl font-bold font-serif text-gray-900 dark:text-white mb-4">{benefit.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
    </motion.div>
  );
}
