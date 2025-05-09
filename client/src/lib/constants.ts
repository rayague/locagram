import { CategoryItem, Benefit, Testimonial } from './types';

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Appartement' },
  { value: 'house', label: 'Maison' },
  { value: 'villa', label: 'Villa' },
  { value: 'land', label: 'Terrain' }
];

export const PRICE_RANGES = [
  { value: 'nomax', label: 'Budget max' },
  { value: '10000000', label: '10 000 000 FCFA' },
  { value: '50000000', label: '50 000 000 FCFA' },
  { value: '100000000', label: '100 000 000 FCFA' },
  { value: '500000000', label: '500 000 000 FCFA' },
  { value: '1000000000', label: '1 000 000 000+ FCFA' }
];

export const LOCATIONS = [
  'Cotonou',
  'Porto-Novo',
  'Parakou',
  'Abomey',
  'Bohicon',
  'Natitingou',
  'Ouidah',
  'Lokossa',
  'Abomey-Calavi',
  'Djougou'
];

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'apartments',
    name: 'Appartements',
    description: 'Résidences modernes en ville',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800'
  },
  {
    id: 'villas',
    name: 'Villas',
    description: 'Demeures d\'exception',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800'
  },
  {
    id: 'coastal',
    name: 'Bord de mer',
    description: 'Propriétés avec vue sur l\'océan',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800'
  },
  {
    id: 'land',
    name: 'Terrains',
    description: 'Parcelles prêtes à construire',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800'
  }
];

export const BENEFITS: Benefit[] = [
  {
    id: 'selection',
    title: 'Sélection rigoureuse',
    description: 'Nous vérifions et sélectionnons soigneusement chaque propriété pour garantir la meilleure qualité à nos clients.',
    icon: 'check-circle'
  },
  {
    id: 'service',
    title: 'Service personnalisé',
    description: 'Nos conseillers immobiliers vous accompagnent à chaque étape avec un service sur mesure selon vos besoins.',
    icon: 'user'
  },
  {
    id: 'secure',
    title: 'Transactions sécurisées',
    description: 'Nous vous garantissons des transactions immobilières transparentes et sécurisées, en toute confiance.',
    icon: 'shield'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Kofi Mensah',
    role: 'Acheteur',
    location: 'Cotonou',
    rating: 5,
    comment: 'Locagram m\'a aidé à trouver la maison de mes rêves à Cotonou. Le processus a été simple et l\'équipe a été très professionnelle tout au long de la transaction.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100'
  },
  {
    id: 2,
    name: 'Aïcha Diallo',
    role: 'Vendeuse',
    location: 'Porto-Novo',
    rating: 5,
    comment: 'J\'ai vendu ma villa grâce à Locagram en un temps record. La plateforme est intuitive et l\'équipe est très réactive. Je recommande vivement leurs services.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100'
  },
  {
    id: 3,
    name: 'David Adjovi',
    role: 'Propriétaire',
    location: 'Parakou',
    rating: 4,
    comment: 'La location de mon appartement à travers Locagram a été une expérience très positive. Le suivi et les conseils des agents immobiliers ont été précieux.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100'
  }
];

export const HERO_PROPERTIES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080'
];

export const COMPANY_INFO = {
  name: 'Locagram',
  address: '123 Avenue de la Marina, Cotonou, Bénin',
  phone: '+229 21 12 34 56',
  email: 'contact@locagram.com',
  hours: 'Lun-Ven: 8h-18h | Sam: 9h-13h',
  social: {
    facebook: '#',
    instagram: '#',
    twitter: '#',
    linkedin: '#'
  }
};
