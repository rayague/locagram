import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  author?: {
    name: string;
    phone?: string;
    email?: string;
  };
}

export default function ContactModal({ isOpen, onClose, propertyTitle, author }: ContactModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simuler l'envoi du message
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Votre message a été envoyé avec succès !');
      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'envoi du message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-white">
                  Contacter l'annonceur
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {author && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Annonceur
                    </h3>
                    <div className="space-y-1.5">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">{author.name}</span>
                      </p>
                      {author.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" />
                          {author.phone}
                        </p>
                      )}
                      {author.email && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          {author.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Vous êtes intéressé par : <span className="font-medium text-gray-900 dark:text-white">{propertyTitle}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                        Prénom
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Votre numéro de téléphone"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                      placeholder="Votre message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
