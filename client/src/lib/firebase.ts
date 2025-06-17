import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  setDoc,
  writeBatch,
  getDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCeaMAgyFWN12ktRuGSHsLdySgiZqvBIKA",
  authDomain: "locagram-f08b9.firebaseapp.com",
  projectId: "locagram-f08b9",
  storageBucket: "locagram-f08b9.appspot.com",
  messagingSenderId: "504321320981",
  appId: "1:504321320981:web:65037b379691080972c61c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Enable multi-tab persistence
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn(
      "Multiple tabs open, persistence can only be enabled in one tab at a time."
    );
  } else if (err.code === "unimplemented") {
    console.warn("The current browser does not support persistence.");
  }
});

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

const storage = getStorage(app);

console.log("Firestore instance:", db);

// En développement, on peut connecter aux émulateurs Firebase
if (import.meta.env.DEV) {
  // Décommenter ces lignes si tu veux utiliser les émulateurs Firebase en local
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectStorageEmulator(storage, 'localhost', 9199);
}

// Liste exacte des catégories
const EXACT_CATEGORIES = [
  { name: "Auberge", id: "auberge" },
  { name: "Maison à louer", id: "maison-louer" },
  { name: "Manoir", id: "manoir" },
  { name: "Atelier", id: "atelier" },
  { name: "Villa", id: "villa" },
  { name: "Chalet", id: "chalet" },
  { name: "Loft", id: "loft" },
  { name: "Studio", id: "studio" },
  { name: "Pavillon", id: "pavillon" },
  { name: "Mobil-home", id: "mobilhome" },
  { name: "Appartement meublé", id: "appartement-meuble" },
  { name: "Duplex", id: "duplex" },
  { name: "Penthouse", id: "penthouse" },
  { name: "Chambre d'hôtel", id: "chambre-hotel" },
  { name: "Loft industriel", id: "loft-industriel" },
  { name: "Caravane", id: "caravane" },
  { name: "Hôtel de ville", id: "hotel-ville" },
  { name: "Parcelle à vendre", id: "parcelle-vendre" },
  { name: "Résidence étudiante", id: "residence-etudiante" },
  { name: "Famille d'accueil", id: "famille-accueil" },
  { name: "Colocation", id: "colocation" },
  { name: "Internat universitaire", id: "internat-universitaire" },
  { name: "Boutique", id: "boutique" },
  { name: "Bureau", id: "bureau" },
  { name: "Hangar", id: "hangar" },
  { name: "Entrepôt", id: "entrepot" },
  { name: "Terrain agricole", id: "terrain-agricole" },
  { name: "Salle de réception", id: "salle-reception" },
  { name: "Je suis propriétaire", id: "proprietaire" },
];

// Variable pour suivre si le seeding a déjà été fait
let hasSeeded = false;

// Fonction pour réinitialiser les catégories
export const resetCategories = async () => {
  try {
    console.log("Début de la réinitialisation des catégories...");
    const categoriesRef = collection(db, "categories");

    // 1. Vérifier les catégories existantes
    const existingSnapshot = await getDocs(categoriesRef);
    console.log(`Nombre de catégories existantes: ${existingSnapshot.size}`);

    // 2. Supprimer toutes les catégories existantes
    const batch = writeBatch(db);
    existingSnapshot.docs.forEach((doc) => {
      console.log(
        `Suppression de la catégorie: ${doc.id} - ${doc.data().name}`
      );
      batch.delete(doc.ref);
    });

    // 3. Attendre que la suppression soit terminée
    await batch.commit();
    console.log("Toutes les catégories existantes ont été supprimées");

    // 4. Vérifier que la collection est vide
    const checkEmpty = await getDocs(categoriesRef);
    if (checkEmpty.size > 0) {
      throw new Error("La collection n'est pas vide après la suppression");
    }

    // 5. Créer un nouveau batch pour l'ajout
    const addBatch = writeBatch(db);

    // 6. Ajouter les nouvelles catégories une par une
    for (const category of EXACT_CATEGORIES) {
      const docRef = doc(categoriesRef, category.id);
      addBatch.set(docRef, {
        name: category.name,
        description: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Ajout de la catégorie: ${category.id} - ${category.name}`);
    }

    // 7. Exécuter l'ajout
    await addBatch.commit();
    console.log("Nouvelles catégories ajoutées");

    // 8. Vérification finale
    const finalSnapshot = await getDocs(categoriesRef);
    console.log(`Nombre final de catégories: ${finalSnapshot.size}`);
    console.log("Liste des catégories après réinitialisation:");
    finalSnapshot.docs.forEach((doc) => {
      console.log(`- ${doc.id}: ${doc.data().name}`);
    });

    if (finalSnapshot.size !== EXACT_CATEGORIES.length) {
      throw new Error(
        `Nombre incorrect de catégories: ${finalSnapshot.size} au lieu de ${EXACT_CATEGORIES.length}`
      );
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la réinitialisation des catégories:", error);
    throw error;
  }
};

// Fonction pour récupérer les catégories
export const getCategories = async () => {
  try {
    // Si le seeding a déjà été fait, récupérer directement les catégories
    if (hasSeeded) {
      const categoriesRef = collection(db, "categories");
      const snapshot = await getDocs(categoriesRef);
      return snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description || "",
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "fr"));
    }

    // Sinon, vérifier si la collection est vide et faire le seeding si nécessaire
    const categoriesRef = collection(db, "categories");
    const snapshot = await getDocs(categoriesRef);

    if (snapshot.empty) {
      console.log("Collection categories vide, début du seeding...");
      const batch = writeBatch(db);

      // Ajouter chaque catégorie
      EXACT_CATEGORIES.forEach((category) => {
        const docRef = doc(categoriesRef, category.id);
        batch.set(docRef, {
          name: category.name,
          description: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      // Exécuter le batch
      await batch.commit();
      console.log("Seeding des catégories terminé avec succès");
      hasSeeded = true;

      // Retourner les catégories nouvellement créées
      return EXACT_CATEGORIES.map((category) => ({
        id: category.id,
        name: category.name,
        description: "",
      })).sort((a, b) => a.name.localeCompare(b.name, "fr"));
    } else {
      // Si la collection n'est pas vide, marquer comme seeded et retourner les catégories existantes
      hasSeeded = true;
      return snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description || "",
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "fr"));
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    throw error;
  }
};

// Interface pour les annonces
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  images: string[];
  capacity: number;
  availability: string;
  contacts: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  views: number;
  status: string;
  negotiable: boolean;
  neighborhood: string;
  roomType: string;
  rooms: {
    bedrooms: string;
    bathrooms: string;
    livingRooms: string;
    kitchens: string;
  };
  equipment: {
    pool: boolean;
    airConditioning: boolean;
    wifi: boolean;
    parking: boolean;
    balcony: boolean;
  };
}

// Fonction pour récupérer les annonces filtrées
export const getProperties = async (filters: {
  location?: string;
  type?: string;
  maxPrice?: number;
  category?: string;
}) => {
  try {
    console.log("Récupération des annonces avec filtres:", filters);
    const listingsRef = collection(db, "listings");
    const q = query(listingsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    console.log(`Nombre total d'annonces trouvées: ${snapshot.size}`);

    // Log toutes les annonces avant filtrage
    console.log("Toutes les annonces avant filtrage:");
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log(
        `- ID: ${doc.id}, Catégorie: ${data.category}, Titre: ${data.title}, Status: ${data.status}`
      );
    });

    // Filtrer les résultats côté client
    const results = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        const property = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          price: data.price as number,
        } as Property;

        return property;
      })
      .filter((property) => {
        // Vérifier d'abord si l'annonce est active
        if (property.status === "inactive" || property.status === "desactive") {
          console.log(`Annonce ${property.id} filtrée car ${property.status}`);
          return false;
        }

        // Appliquer tous les autres filtres
        const matchesLocation =
          !filters.location || property.location === filters.location;
        const matchesType = !filters.type || property.roomType === filters.type;
        const matchesPrice =
          !filters.maxPrice || property.price <= filters.maxPrice;
        const matchesCategory =
          !filters.category || property.category === filters.category;

        // Log détaillé du filtrage pour chaque annonce
        if (filters.category) {
          console.log(`Filtrage pour ${property.id}:`, {
            propertyCategory: property.category,
            filterCategory: filters.category,
            matchesCategory,
            matchesLocation,
            matchesType,
            matchesPrice,
            status: property.status,
            finalResult:
              matchesLocation && matchesType && matchesPrice && matchesCategory,
          });
        }

        return (
          matchesLocation && matchesType && matchesPrice && matchesCategory
        );
      });

    console.log(`Nombre d'annonces après filtrage: ${results.length}`);
    if (filters.category) {
      console.log(
        "Annonces filtrées par catégorie:",
        results.map((p) => ({
          id: p.id,
          category: p.category,
          title: p.title,
          status: p.status,
        }))
      );
    }
    return results;
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces:", error);
    throw error;
  }
};

// Récupérer un utilisateur par son ID
export async function getUserById(userId: string) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;
  const data = userSnap.data();
  return {
    id: userId,
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    ...data,
  };
}

// Fonction pour incrémenter les vues d'une propriété
export const incrementPropertyViews = async (propertyId: string) => {
  try {
    const propertyRef = doc(db, "listings", propertyId);
    const propertyDoc = await getDoc(propertyRef);

    if (!propertyDoc.exists()) {
      console.error("Propriété non trouvée:", propertyId);
      return;
    }

    // Incrémenter le compteur de vues
    await setDoc(propertyRef, {
      ...propertyDoc.data(),
      views: (propertyDoc.data().views || 0) + 1,
      updatedAt: new Date(),
    });

    console.log("Vues incrémentées pour la propriété:", propertyId);
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des vues:", error);
    throw error;
  }
};

// Fonction pour récupérer les messages d'un utilisateur
export const getUserMessages = async (userId: string) => {
  try {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("receiverId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ContactMessageData[];
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    throw error;
  }
};

// Fonction pour marquer un message comme lu
export const markMessageAsRead = async (messageId: string) => {
  try {
    const messageRef = doc(db, "messages", messageId);
    await updateDoc(messageRef, {
      status: "read",
    });
  } catch (error) {
    console.error("Erreur lors du marquage du message comme lu:", error);
    throw error;
  }
};

// Fonction simple pour sauvegarder un message
export const saveContactMessage = async (messageData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) => {
  try {
    console.log("⭐ Début saveContactMessage");
    console.log("📝 Données reçues:", messageData);

    // Vérifier la connexion à Firestore
    if (!db) {
      throw new Error("Firestore n'est pas initialisé");
    }

    // Créer la référence à la collection
    const messagesRef = collection(db, "contact-messages");
    console.log("📁 Collection référencée:", messagesRef.id);

    // Préparer les données du message
    const messageToSave = {
      ...messageData,
      createdAt: serverTimestamp(),
      type: "contact",
    };

    console.log("📦 Données à sauvegarder:", messageToSave);

    // Tentative d'ajout du document
    try {
      const docRef = await addDoc(messagesRef, messageToSave);
      console.log("✅ Message sauvegardé avec succès! ID:", docRef.id);

      // Vérifier que le document a bien été créé
      const savedDoc = await getDoc(docRef);
      if (savedDoc.exists()) {
        console.log("✅ Document vérifié comme existant");
      } else {
        console.log("❌ Document non trouvé après sauvegarde");
      }

      return docRef.id;
    } catch (addError) {
      console.error("❌ Erreur lors de l'ajout du document:", addError);
      throw addError;
    }
  } catch (error) {
    console.error("❌ Erreur dans saveContactMessage:", error);
    if (error instanceof Error) {
      throw new Error(`Erreur lors de la sauvegarde: ${error.message}`);
    } else {
      throw new Error("Une erreur inconnue est survenue");
    }
  }
};

// Custom sign in function with persistence
export const signInWithPersistence = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

interface ContactMessageData {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: Date;
  type: string;
  status?: "read" | "unread";
}

// Fonction pour récupérer tous les messages de contact (admin only)
export const getAllContactMessages = async (): Promise<
  ContactMessageData[]
> => {
  try {
    console.log("Récupération de tous les messages de contact");
    const messagesRef = collection(db, "contact-messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        subject: data.subject || "",
        message: data.message || "",
        createdAt: data.createdAt?.toDate() || new Date(),
        type: data.type || "contact",
        status: data.status || "unread",
      };
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    throw error;
  }
};

export { db, auth, storage };
