import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// JBS Agri Hub Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsMRCYIysPM2nTUeft8NK2LvH0TCI15Es",
  authDomain: "jbs-agri-hub.firebaseapp.com",
  projectId: "jbs-agri-hub",
  storageBucket: "jbs-agri-hub.firebasestorage.app",
  messagingSenderId: "1023501778868",
  appId: "1:1023501778868:web:76e48390f5cf28baccfce1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
const auth = getAuth(app);

// Cloud Firestore
const db = getFirestore(app);

// Export
export { app, auth, db };

