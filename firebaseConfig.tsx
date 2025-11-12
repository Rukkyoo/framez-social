// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserSessionPersistence, browserLocalPersistence } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvLu16iXCqnVDBbpn9j7x3Ou860yOAU9Q",
  authDomain: "framez-bf400.firebaseapp.com",
  projectId: "framez-bf400",
  storageBucket: "framez-bf400.firebasestorage.app",
  messagingSenderId: "512047161921",
  appId: "1:512047161921:web:cd309df546a45fc059dcc0",
  measurementId: "G-7FFVW0M9P1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

// Set persistence to local (will persist across app restarts and browser sessions)
// This provides persistent user sessions as requested
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});