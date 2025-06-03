import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Configuration Firebase pour le projet locagram-f08b9
const firebaseConfig = {
  apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx", // Remplace par ta clé API
  authDomain: "locagram-f08b9.firebaseapp.com",
  projectId: "locagram-f08b9",
  storageBucket: "locagram-f08b9.appspot.com",
  messagingSenderId: "118315401649757880816", // ID du projet
  appId: "1:118315401649757880816:web:2bd8440602b25100b9f3d9" // ID de l'application
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// En développement, on peut connecter aux émulateurs Firebase
if (import.meta.env.DEV) {
  // Décommenter ces lignes si tu veux utiliser les émulateurs Firebase en local
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectStorageEmulator(storage, 'localhost', 9199);
}

// Fonction pour récupérer les catégories
export const getCategories = async () => {
  const categoriesRef = collection(db, 'categories');
  const snapshot = await getDocs(categoriesRef);
  
  // Utiliser un Map pour dédupliquer les catégories par ID
  const uniqueCategories = new Map();
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    // Si une catégorie avec cet ID existe déjà, on la garde
    if (!uniqueCategories.has(doc.id)) {
      uniqueCategories.set(doc.id, {
        id: doc.id,
        ...data
      });
    }
  });
  
  return Array.from(uniqueCategories.values());
};

// Interface pour les annonces
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  category: string;
  images: string[];
  features: {
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    parking?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Fonction pour récupérer les annonces filtrées
export const getProperties = async (filters: {
  location?: string;
  type?: string;
  maxPrice?: number;
}) => {
  try {
    const listingsRef = collection(db, 'listings');
    // On récupère toutes les annonces et on filtre côté client
    const q = query(listingsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    // Filtrer les résultats côté client
    const results = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          price: data.price as number
        } as Property;
      })
      .filter(property => {
        // Appliquer tous les filtres côté client
        const matchesLocation = !filters.location || property.location === filters.location;
        const matchesType = !filters.type || property.type === filters.type;
        const matchesPrice = !filters.maxPrice || property.price <= filters.maxPrice;
        return matchesLocation && matchesType && matchesPrice;
      });

    return results;
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces:", error);
    throw error;
  }
};

export { db, auth, storage }; 