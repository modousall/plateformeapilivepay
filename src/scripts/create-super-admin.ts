/**
 * Script d'initialisation - Créer le Super Admin dans Firebase Auth
 * 
 * Usage : npx tsx src/scripts/create-super-admin.ts
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBBXjKwvVNovBFwE92OsThtn0zwCgbmvYI",
  authDomain: "api-live-pay.firebaseapp.com",
  projectId: "api-live-pay",
  storageBucket: "api-live-pay.firebasestorage.app",
  messagingSenderId: "643595999695",
  appId: "1:643595999695:web:4390d63335ce5245c29aba",
  measurementId: "G-ZWNNP3K6FV"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createSuperAdmin() {
  const email = 'modousall1@gmail.com';
  const password = 'Passer123@';
  const displayName = 'Super Admin';

  try {
    console.log('🚀 Création du Super Admin dans Firebase Auth...');
    console.log(`Email: ${email}`);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Mettre à jour le profil
    await updateProfile(userCredential.user, {
      displayName
    });

    console.log('✅ Super Admin créé avec succès !');
    console.log(`UID: ${userCredential.user.uid}`);
    console.log(`Email: ${userCredential.user.email}`);
    console.log(`DisplayName: ${userCredential.user.displayName}`);
    console.log('\n🎯 Vous pouvez maintenant vous connecter avec :');
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${password}`);
    
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️  Cet email est déjà utilisé dans Firebase Auth');
      console.log('ℹ️  L\'utilisateur existe déjà, vous pouvez vous connecter directement');
    } else {
      console.error('❌ Erreur lors de la création:', error.message);
    }
  }
}

createSuperAdmin();
