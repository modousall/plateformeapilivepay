/**
 * Configuration Firebase pour LIVEPay
 * 
 * Utilise Firebase Firestore pour le stockage des données
 * et Firebase Authentication pour la gestion des utilisateurs
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyC1rCtbDcbV3slNAw4LSgIGxD1yMfNQ6Lo",
  authDomain: "studio-2004607225-f6a14.firebaseapp.com",
  projectId: "studio-2004607225-f6a14",
  storageBucket: "studio-2004607225-f6a14.firebasestorage.app",
  messagingSenderId: "869931588586",
  appId: "1:869931588586:web:138e7aaff905d5fdf37093"
};

// Initialiser Firebase (éviter la double initialisation)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialiser les services Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Export de l'app pour usage direct
export { app };

export default app;
