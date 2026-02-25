#!/usr/bin/env node

/**
 * Script de diagnostic pour le compte admin Firebase
 * Usage: node admin-diagnostic.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

console.log('🔍 Diagnostic - Compte Admin Firebase\n');

// Configuration
const credPath = './serviceAccountKey.json';
const adminEmail = 'admin@demarcheur.com';

async function runDiagnostic() {
  try {
    // Vérifier si le fichier de credentials existe
    if (!fs.existsSync(credPath)) {
      console.log('❌ Fichier credentials manquant:', credPath);
      console.log('   Téléchargez serviceAccountKey.json depuis Firebase Console');
      return;
    }

    // Initialiser Firebase Admin
    const app = initializeApp({
      credential: cert(credPath),
      projectId: 'locagram-f08b9'
    });

    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('✅ Connexion Firebase établie\n');

    // 1. Vérifier l'utilisateur dans Firebase Auth
    console.log('1️⃣ Vérification Firebase Auth...');
    try {
      const userRecord = await auth.getUserByEmail(adminEmail);
      console.log('✅ Utilisateur trouvé dans Auth:');
      console.log('   UID:', userRecord.uid);
      console.log('   Email:', userRecord.email);
      console.log('   Nom:', userRecord.displayName);
      console.log('   Créé:', new Date(userRecord.metadata.creationTime));
      console.log('   Dernière connexion:', new Date(userRecord.metadata.lastSignInTime));
      
      // 2. Vérifier le document dans Firestore
      console.log('\n2️⃣ Vérification document Firestore...');
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      
      if (userDoc.exists) {
        console.log('✅ Document utilisateur trouvé:');
        console.log(JSON.stringify(userDoc.data(), null, 2));
      } else {
        console.log('❌ Document utilisateur manquant dans Firestore');
        console.log('   Création du document...');
        
        await db.collection('users').doc(userRecord.uid).set({
          email: adminEmail,
          name: 'Administrateur',
          role: 'admin',
          status: 'actif',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log('✅ Document créé avec succès');
      }

      // 3. Vérifier les custom claims
      console.log('\n3️⃣ Vérification custom claims...');
      const customClaims = userRecord.customClaims;
      
      if (customClaims && customClaims.admin) {
        console.log('✅ Custom claims admin: true');
      } else {
        console.log('⚠️ Custom claims admin manquant');
        console.log('   Ajout du claim admin...');
        
        await auth.setCustomUserClaims(userRecord.uid, { admin: true });
        console.log('✅ Custom claims ajouté');
      }

    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log('❌ Utilisateur non trouvé dans Firebase Auth');
        console.log('   Exécutez: node seed-admin.js pour créer le compte');
      } else {
        console.log('❌ Erreur:', error.message);
      }
    }

    console.log('\n🎯 Diagnostic terminé');
    console.log('📝 Pour vous connecter:');
    console.log('   Email:', adminEmail);
    console.log('   Mot de passe: Admin123!@#');
    
  } catch (error) {
    console.log('❌ Erreur lors du diagnostic:', error.message);
  }
}

runDiagnostic();