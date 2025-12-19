// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdf-c13e0wCafRYHXhIls1epJgD1RjPUA",
  authDomain: "makara-16344.firebaseapp.com",
  projectId: "makara-16344",
  messagingSenderId: "216769654742",
  appId: "1:216769654742:web:16792742d4613f4269be77",
  measurementId: "G-K4XZHP11MM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };




