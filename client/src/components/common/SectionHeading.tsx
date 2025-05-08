import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export default function SectionHeading({ 
  title, 
  subtitle, 
  center = true, 
  className 
}: SectionHeadingProps) {
  return (
    <motion.div 
      className={cn(
        "mb-16 max-w-xl",
        center ? "mx-auto text-center" : "",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
