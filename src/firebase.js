// Firebase initialization for Couch Buddies
// Connects to Firebase Realtime Database and Storage for centralized data sync
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

// Firebase client config — these are public keys safe to commit.
// Security is enforced by Firebase database rules, not by hiding these values.
// Environment variables are used as overrides if available (e.g. for local dev).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD3igZadwYVhXW9sjWex60dTKhWS_KQ5oo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "couch-buddies.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://couch-buddies-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "couch-buddies",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "couch-buddies.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "514995835203",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:514995835203:web:d75673f2c40a709a1c1ff6",
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export const storage = getStorage(app)

// Log confirmation (visible in browser console)
console.log(`[Firebase] Connected to project "${firebaseConfig.projectId}" → ${firebaseConfig.databaseURL}`)
