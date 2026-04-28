// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnVpG-Hl7n2a1esMO4rZhq9JfqpKd3VUo",
  authDomain: "makarasurici.firebaseapp.com",
  projectId: "makarasurici",
  storageBucket: "makarasurici.firebasestorage.app",
  messagingSenderId: "237735301273",
  appId: "1:237735301273:web:bf62c8f145434df0292808",
  measurementId: "G-WXWWQT92L6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };




