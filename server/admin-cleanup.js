#!/usr/bin/env node

/**
 * Script de nettoyage du compte admin Firebase
 * Usage: node admin-cleanup.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const readline = require('readline');

const credPath = './serviceAccountKey.json';
const adminEmail = 'admin@demarcheur.com';

// Interface pour les questions utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function cleanupAdmin() {
  try {
    console.log('🧹 Nettoyage du compte admin Firebase\n');

    // Vérifier credentials
    if (!fs.existsSync(credPath)) {
      console.log('❌ Fichier credentials manquant:', credPath);
      rl.close();
      return;
    }

    // Initialiser Firebase
    const app = initializeApp({
      credential: cert(credPath),
      projectId: 'locagram-f08b9'
    });

    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('✅ Connexion Firebase établie');

    // Confirmation utilisateur
    const confirm = await askQuestion('⚠️ Voulez-vous vraiment nettoyer le compte admin? (oui/NON): ');
    
    if (confirm.toLowerCase() !== 'oui') {
      console.log('❌ Opération annulée');
      rl.close();
      return;
    }

    try {
      // 1. Trouver l'utilisateur
      const userRecord = await auth.getUserByEmail(adminEmail);
      console.log('🔍 Utilisateur trouvé:', userRecord.uid);

      // 2. Supprimer le document Firestore
      console.log('🗑️ Suppression du document Firestore...');
      await db.collection('users').doc(userRecord.uid).delete();
      console.log('✅ Document Firestore supprimé');

      // 3. Supprimer l'utilisateur Auth
      console.log('🗑️ Suppression de l\'utilisateur Auth...');
      await auth.deleteUser(userRecord.uid);
      console.log('✅ Utilisateur Auth supprimé');

      // 4. Recréer l'utilisateur
      const recreate = await askQuestion('🔄 Recréer le compte admin maintenant? (oui/NON): ');
      
      if (recreate.toLowerCase() === 'oui') {
        console.log('👤 Création du nouveau compte admin...');
        
        const newUser = await auth.createUser({
          email: adminEmail,
          password: 'Admin123!@#',
          displayName: 'Administrateur'
        });

        console.log('✅ Nouveau compte créé:', newUser.uid);

        // Ajouter custom claims
        await auth.setCustomUserClaims(newUser.uid, { admin: true });
        console.log('✅ Custom claims ajoutés');

        // Créer le document Firestore
        await db.collection('users').doc(newUser.uid).set({
          email: adminEmail,
          name: 'Administrateur',
          role: 'admin',
          status: 'actif',
          createdAt: new Date(),
          updatedAt: new Date()
        });

        console.log('✅ Document Firestore créé');
        console.log('\n🎉 Compte admin nettoyé et recréé avec succès!');
        console.log('📝 Credentials:');
        console.log('   Email:', adminEmail);
        console.log('   Mot de passe: Admin123!@#');
      }

    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log('ℹ️ Aucun utilisateur à supprimer');
      } else {
        console.log('❌ Erreur:', error.message);
      }
    }

  } catch (error) {
    console.log('❌ Erreur lors du nettoyage:', error.message);
  } finally {
    rl.close();
  }
}

cleanupAdmin();