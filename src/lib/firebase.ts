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
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBBXjKwvVNovBFwE92OsThtn0zwCgbmvYI",
  authDomain: "api-live-pay.firebaseapp.com",
  projectId: "api-live-pay",
  storageBucket: "api-live-pay.firebasestorage.app",
  messagingSenderId: "643595999695",
  appId: "1:643595999695:web:4390d63335ce5245c29aba",
  measurementId: "G-ZWNNP3K6FV"
};

// Initialiser Firebase (éviter la double initialisation)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialiser les services Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Analytics (seulement côté client)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Export de l'app pour usage direct
export { app };

export default app;
