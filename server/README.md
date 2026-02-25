# Scripts de Gestion Admin - Locagram

Ce dossier contient des scripts utilitaires pour gérer les comptes administrateurs Firebase.

## 📋 Prérequis

1. **Service Account Key**: Téléchargez le fichier `serviceAccountKey.json` depuis Firebase Console
   - Allez dans Firebase Console > Paramètres du projet > Comptes de service
   - Cliquez sur "Générer une nouvelle clé privée"
   - Sauvegardez le fichier comme `serviceAccountKey.json` dans ce dossier

2. **Dependencies**: Installez les dépendances Node.js
   ```bash
   npm install firebase-admin
   ```

## 🛠️ Scripts Disponibles

### 1. `seed-admin.js` - Création du compte admin
Crée ou vérifie le compte administrateur par défaut.

**Usage**:
```bash
node seed-admin.js
```

**Ce que ça fait**:
- Crée l'utilisateur `admin@demarcheur.com` dans Firebase Auth
- Définit le mot de passe à `Admin123!@#`
- Ajoute les custom claims `{ admin: true }`
- Crée le document utilisateur dans Firestore avec `role: "admin"`

### 2. `admin-diagnostic.js` - Diagnostic du compte admin
Vérifie l'état du compte admin et diagnostique les problèmes.

**Usage**:
```bash
node admin-diagnostic.js
```

**Ce que ça vérifie**:
- ✅ Existence de l'utilisateur dans Firebase Auth
- ✅ Présence du document dans Firestore
- ✅ Custom claims admin
- ✅ Structure des données

### 3. `admin-cleanup.js` - Nettoyage du compte admin
Nettoie et recrée le compte admin en cas de problème.

**Usage**:
```bash
node admin-cleanup.js
```

**Ce que ça fait**:
- 🗑️ Supprime l'utilisateur existant de Firebase Auth
- 🗑️ Supprime le document Firestore
- 🔄 Recrée un compte admin propre
- ✅ Configure correctement tous les paramètres

## 🚨 Résolution des Erreurs Communes

### Erreur "auth/email-already-in-use"
```bash
# 1. Diagnostiquer le problème
node admin-diagnostic.js

# 2. Si nécessaire, nettoyer et recréer
node admin-cleanup.js
```

### Utilisateur existe mais pas de document Firestore
```bash
# Le diagnostic va automatiquement créer le document manquant
node admin-diagnostic.js
```

### Custom claims manquants
```bash
# Le diagnostic va automatiquement ajouter les claims
node admin-diagnostic.js
```

## 📝 Configuration par Défaut

- **Email**: `admin@demarcheur.com`
- **Mot de passe**: `Admin123!@#`
- **Rôle**: `admin`
- **Status**: `actif`
- **Custom Claims**: `{ admin: true }`

## 🔒 Sécurité

⚠️ **Important**: 
- Ne commitez jamais le fichier `serviceAccountKey.json`
- Changez le mot de passe par défaut après la première connexion
- Ces scripts ne doivent être exécutés que par les administrateurs

## 📞 Support

Si vous rencontrez des problèmes:

1. Vérifiez que `serviceAccountKey.json` est présent
2. Exécutez `admin-diagnostic.js` pour identifier le problème
3. Utilisez `admin-cleanup.js` en dernier recours

## 🔗 Firestore Rules

Les règles Firestore dans `../firestore.rules` sont configurées pour:
- Permettre l'accès admin avec `role: "admin"`
- Autoriser `admin@demarcheur.com` comme admin de secours
- Sécuriser l'accès aux collections selon les rôles

---
**Version**: 1.0  
**Dernière mise à jour**: 25 Février 2025