import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, collection, getDocs } from "firebase/firestore";
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
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export { db, auth, storage }; 