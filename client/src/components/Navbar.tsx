import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Sun, Moon, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div 
                className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-xl font-serif font-bold dark:text-white">Locagram</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/properties?status=for_sale" className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition">
                Acheter
              </Link>
              <Link href="/properties?status=for_rent" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition">
                Louer
              </Link>
              <Link href="/properties" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition">
                Vendre
              </Link>
              <Link href="#about" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition">
                À propos
              </Link>
              <Link href="#contact" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition">
                Contact
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <Button 
              className="hidden md:flex items-center"
              variant="default"
            >
              <User className="w-4 h-4 mr-1.5" />
              <span>S'inscrire</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-white dark:bg-gray-900"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex justify-end p-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <nav className="flex flex-col items-center space-y-8 p-8">
              <Link href="/" className="text-xl font-serif font-bold" onClick={() => setMobileMenuOpen(false)}>
                Accueil
              </Link>
              <Link href="/properties?status=for_sale" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
                Acheter
              </Link>
              <Link href="/properties?status=for_rent" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
                Louer
              </Link>
              <Link href="/properties" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
                Vendre
              </Link>
              <Link href="#about" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
                À propos
              </Link>
              <Link href="#contact" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <Button 
                className="w-full mt-4"
                size="lg"
              >
                <User className="w-5 h-5 mr-2" />
                <span>S'inscrire</span>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
