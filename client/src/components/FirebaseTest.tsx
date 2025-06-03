import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export const FirebaseTest = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("🔄 Test de connexion à Firestore...");
        
        // On essaie d'abord de lire la collection test
        const testCollection = collection(db, "test");
        const querySnapshot = await getDocs(testCollection);
        
        // Si la collection est vide, on ajoute un document de test
        if (querySnapshot.empty) {
          console.log("📝 Création d'un document de test...");
          await addDoc(testCollection, {
            message: "Document de test",
            createdAt: serverTimestamp()
          });
          console.log("✅ Document de test créé avec succès !");
        }

        // On relit la collection pour avoir le nombre de documents
        const updatedSnapshot = await getDocs(testCollection);
        const count = updatedSnapshot.size;
        
        console.log("✅ Connexion à Firestore réussie !");
        console.log(`📊 Nombre de documents dans la collection 'test' : ${count}`);
        
        setStatus("success");
        setMessage(`Connexion réussie ! ${count} document(s) dans la collection 'test'.`);
      } catch (error) {
        console.error("❌ Erreur de connexion à Firestore:", error);
        setStatus("error");
        setMessage(`Erreur de connexion : ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 m-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-2">Test de connexion Firebase</h2>
      <div className={`p-2 rounded ${
        status === "loading" ? "bg-yellow-100" :
        status === "success" ? "bg-green-100" :
        "bg-red-100"
      }`}>
        {status === "loading" && "🔄 Test de connexion en cours..."}
        {status === "success" && "✅ " + message}
        {status === "error" && "❌ " + message}
      </div>
    </div>
  );
}; 