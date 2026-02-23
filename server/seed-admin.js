const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCeaMAgyFWN12ktRuGSHsLdySgiZqvBIKA",
  authDomain: "locagram-f08b9.firebaseapp.com",
  projectId: "locagram-f08b9",
  storageBucket: "locagram-f08b9.appspot.com",
  messagingSenderId: "504321320981",
  appId: "1:504321320981:web:65037b379691080972c61c",
};

// Chercher le fichier serviceAccountKey.json
const credPath = './serviceAccountKey.json';

// Initialiser Firebase Admin
let app;
try {
  if (fs.existsSync(credPath)) {
    console.log("🔑 Credentials trouvés:", credPath);
    app = initializeApp({
      credential: cert(credPath),
      projectId: firebaseConfig.projectId,
    });
  } else {
    console.log("⚠️  Aucun fichier credentials trouvé à", credPath);
    console.log("   Téléchargez la clé de service depuis Firebase Console");
    console.log("   et placez-la dans:", path.resolve(credPath));
    process.exit(1);
  }
} catch (e) {
  console.log("ℹ️  App déjà initialisée ou erreur:", e.message);
  process.exit(1);
}

const auth = getAuth(app);
const db = getFirestore(app);

const adminEmail = "admin@demarcheur.com";
const adminPassword = "Admin123!@#";

async function seedAdmin() {
  console.log("🚀 Démarrage du seeding admin...\n");

  try {
    // 1. Récupérer l'utilisateur existant dans Firebase Auth
    console.log("� Récupération de l'utilisateur admin dans Firebase Auth...");
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(adminEmail);
      console.log("✅ Utilisateur admin trouvé avec UID:", userRecord.uid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Créer l'utilisateur s'il n'existe pas
        console.log("👤 Création de l'utilisateur admin dans Firebase Auth...");
        userRecord = await auth.createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: "Administrateur",
        });
        console.log("✅ Utilisateur admin créé avec UID:", userRecord.uid);
      } else {
        throw error;
      }
    }

    const uid = userRecord.uid;

    // 2. Vérifier si le document existe déjà dans Firestore avec cet UID
    console.log("🔍 Vérification du document admin dans Firestore...");
    const userDocRef = db.collection("users").doc(uid);
    const doc = await userDocRef.get();

    if (doc.exists) {
      console.log("✅ Le document admin existe déjà dans Firestore");
      console.log("📄 Document:", JSON.stringify(doc.data(), null, 2));
      return;
    }

    // 3. Créer le document dans Firestore avec le bon UID
    console.log("📝 Création du document admin dans Firestore...");
    await userDocRef.set({
      cip: "0000000000",
      email: adminEmail,
      ifu: "0000000000",
      name: "Administrateur",
      phone: "00000000",
      role: "admin",
      status: "actif",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("\n✅ Document admin créé avec succès!");
    console.log("\n📋 Récapitulatif:");
    console.log("   Email:", adminEmail);
    console.log("   Mot de passe:", adminPassword);
    console.log("   UID:", uid);
    console.log("   Role: admin");
    console.log("   Status: actif");

  } catch (error) {
    console.error("\n❌ Erreur lors du seeding:", error.message);
    if (error.code) console.error("Code:", error.code);
    process.exit(1);
  }
}

// Exécuter le seeding
seedAdmin().then(() => {
  console.log("\n🎉 Seeding terminé avec succès!");
  process.exit(0);
}).catch((error) => {
  console.error("\n💥 Erreur fatale:", error);
  process.exit(1);
});
