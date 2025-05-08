import { InsertProperty, Property } from "@shared/schema";

// Mock properties data
export const mockProperties: InsertProperty[] = [
  {
    title: "Villa La Paillote",
    description: "Magnifique villa de luxe avec piscine à débordement et vue panoramique sur l'océan. Cette propriété exceptionnelle dispose de 5 chambres spacieuses, 4 salles de bains modernes, un grand salon, une cuisine équipée et un jardin luxuriant.\n\nLa villa est située dans un quartier résidentiel prisé de Cotonou, à proximité des plages, des restaurants et des commerces. Une opportunité rare d'acquérir une propriété d'exception dans l'un des quartiers les plus recherchés du Bénin.",
    price: 450000000,
    priceUnit: "FCFA",
    location: "Fidjrossè",
    city: "Cotonou",
    country: "Bénin",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    landArea: 1200,
    isFurnished: false,
    type: "villa",
    status: "for_sale",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1600566753051-f0b4ae75f9df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c0862?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
    ],
    features: [
      "Piscine à débordement",
      "Vue sur l'océan",
      "Jardin paysager",
      "Terrasse",
      "Garage pour 3 voitures",
      "Système de sécurité",
      "Climatisation",
      "Internet haut débit"
    ],
    isFeatured: true
  },
  {
    title: "Résidence Harmonie",
    description: "Appartement de luxe dans la résidence Harmonie, l'une des plus prestigieuses de Cotonou. Cet appartement meublé de 3 chambres offre un confort optimal avec ses finitions haut de gamme, son salon spacieux et sa cuisine entièrement équipée.\n\nSitué dans le quartier prisé de Fidjrossè, à proximité des commerces, restaurants et de la plage, cet appartement bénéficie d'une vue imprenable sur la ville. La résidence dispose d'une piscine, d'une salle de sport et d'un service de sécurité 24h/24.",
    price: 950000,
    priceUnit: "FCFA",
    location: "Fidjrossè",
    city: "Cotonou",
    country: "Bénin",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    isFurnished: true,
    type: "apartment",
    status: "for_rent",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1630699144867-37acec97df5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
    ],
    features: [
      "Meublé et équipé",
      "Climatisation centralisée",
      "Accès piscine",
      "Salle de sport",
      "Sécurité 24h/24",
      "Ascenseur",
      "Parking souterrain",
      "Balcon avec vue"
    ],
    isFeatured: true
  },
  {
    title: "Maison Coloniale",
    description: "Authentique maison coloniale rénovée avec goût, alliant charme d'antan et confort moderne. Cette demeure d'exception située au cœur historique de Porto-Novo offre 4 chambres, 3 salles de bains, un vaste séjour, une salle à manger et une cuisine équipée.\n\nLe jardin tropical de 800 m² abrite une terrasse ombragée idéale pour les repas en extérieur. Les boiseries d'origine, les hauts plafonds et les carrelages anciens ont été préservés lors de la rénovation, conférant à cette propriété un caractère unique.",
    price: 280000000,
    priceUnit: "FCFA",
    location: "Centre-ville",
    city: "Porto-Novo",
    country: "Bénin",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    landArea: 800,
    isFurnished: false,
    type: "house",
    status: "for_sale",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1599327286089-85d2e63b5a42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
    ],
    features: [
      "Architecture coloniale",
      "Jardin tropical",
      "Terrasse",
      "Éléments d'origine restaurés",
      "Climatisation",
      "Puits artésien",
      "Dépendance",
      "Murs d'enceinte"
    ],
    isFeatured: true
  },
  {
    title: "Duplex Moderne",
    description: "Duplex contemporain de 4 chambres dans une résidence sécurisée à Abomey-Calavi. Ce logement moderne offre de beaux volumes avec son séjour cathédrale, sa cuisine américaine et ses 3 salles d'eau. À l'étage, la suite parentale dispose d'un dressing et d'une salle de bain privative.\n\nLa résidence propose des prestations haut de gamme : piscine commune, espaces verts, sécurité 24h/24 et parking réservé. Idéalement situé à proximité des écoles internationales et des commerces.",
    price: 120000000,
    priceUnit: "FCFA",
    location: "Togoudo",
    city: "Abomey-Calavi",
    country: "Bénin",
    bedrooms: 4,
    bathrooms: 3,
    area: 210,
    isFurnished: false,
    type: "house",
    status: "for_sale",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
    ],
    features: [
      "Duplex contemporain",
      "Résidence sécurisée",
      "Accès piscine",
      "Suite parentale",
      "Cuisine américaine",
      "Climatisation",
      "Parking privé",
      "Espaces verts"
    ],
    isFeatured: false
  },
  {
    title: "Villa bord de mer",
    description: "Exceptionnelle villa pieds dans l'eau sur la côte béninoise. Cette propriété unique offre un accès direct à la plage et une vue imprenable sur l'océan depuis toutes les pièces principales. Avec ses 6 chambres, 5 salles de bains, son vaste salon ouvert sur la terrasse et sa piscine à débordement, cette villa incarne le luxe balnéaire.\n\nLe terrain de 2000 m² comprend un jardin tropical aménagé, un pool house avec bar et un accès privé à la plage. Une propriété rare sur le marché, idéale comme résidence principale de prestige ou comme investissement locatif haut de gamme.",
    price: 850000000,
    priceUnit: "FCFA",
    location: "Djègbadji",
    city: "Ouidah",
    country: "Bénin",
    bedrooms: 6,
    bathrooms: 5,
    area: 550,
    landArea: 2000,
    isFurnished: false,
    type: "villa",
    status: "for_sale",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
    ],
    features: [
      "Front de mer",
      "Accès privé plage",
      "Piscine à débordement",
      "Pool house",
      "Jardin tropical",
      "Garage double",
      "Système domotique",
      "Énergie solaire"
    ],
    isFeatured: false
  },
  {
    title: "Appartement Central",
    description: "Appartement moderne et lumineux au cœur de Cotonou. Ce 2 pièces entièrement rénové offre un séjour avec cuisine ouverte, une chambre spacieuse et une salle d'eau contemporaine. Les prestations incluent climatisation, volets électriques et équipements de qualité.\n\nSitué dans un immeuble sécurisé du quartier Ganhi, à proximité immédiate des administrations, commerces et restaurants, cet appartement est idéal pour les jeunes actifs ou comme investissement locatif à fort rendement.",
    price: 350000,
    priceUnit: "FCFA",
    location: "Ganhi",
    city: "Cotonou",
    country: "Bénin",
    bedrooms: 1,
    bathrooms: 1,
    area: 65,
    isFurnished: true,
    type: "apartment",
    status: "for_rent",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
    ],
    features: [
      "Entièrement rénové",
      "Meublé et équipé",
      "Cuisine américaine",
      "Climatisation",
      "Volets électriques",
      "Internet fibre",
      "Immeuble sécurisé",
      "Ascenseur"
    ],
    isFeatured: false
  }
];

// Mock testimonials data
export const mockTestimonials = [
  {
    id: 1,
    name: "Kofi Mensah",
    role: "Acheteur",
    location: "Cotonou",
    rating: 5,
    comment: "Locagram m'a aidé à trouver la maison de mes rêves à Cotonou. Le processus a été simple et l'équipe a été très professionnelle tout au long de la transaction.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: 2,
    name: "Aïcha Diallo",
    role: "Vendeuse",
    location: "Porto-Novo",
    rating: 5,
    comment: "J'ai vendu ma villa grâce à Locagram en un temps record. La plateforme est intuitive et l'équipe est très réactive. Je recommande vivement leurs services.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: 3,
    name: "David Adjovi",
    role: "Propriétaire",
    location: "Parakou",
    rating: 4,
    comment: "La location de mon appartement à travers Locagram a été une expérience très positive. Le suivi et les conseils des agents immobiliers ont été précieux.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  }
];

// Mock categories data
export const mockCategories = [
  {
    id: "apartments",
    name: "Appartements",
    description: "Résidences modernes en ville",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800"
  },
  {
    id: "villas",
    name: "Villas",
    description: "Demeures d'exception",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800"
  },
  {
    id: "coastal",
    name: "Bord de mer",
    description: "Propriétés avec vue sur l'océan",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800"
  },
  {
    id: "land",
    name: "Terrains",
    description: "Parcelles prêtes à construire",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800"
  }
];

// Mock benefits data
export const mockBenefits = [
  {
    id: "selection",
    title: "Sélection rigoureuse",
    description: "Nous vérifions et sélectionnons soigneusement chaque propriété pour garantir la meilleure qualité à nos clients.",
    icon: "check-circle"
  },
  {
    id: "service",
    title: "Service personnalisé",
    description: "Nos conseillers immobiliers vous accompagnent à chaque étape avec un service sur mesure selon vos besoins.",
    icon: "user"
  },
  {
    id: "secure",
    title: "Transactions sécurisées",
    description: "Nous vous garantissons des transactions immobilières transparentes et sécurisées, en toute confiance.",
    icon: "shield"
  }
];
