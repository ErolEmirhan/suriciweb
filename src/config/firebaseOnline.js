// Firebase config for online orders only
// This is separate from the main Firebase config
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration for online orders
const firebaseOnlineConfig = {
  apiKey: "AIzaSyAucyGoXwmQ5nrQLfk5zL5-73ir7u9vbI8",
  authDomain: "makaraonline-5464e.firebaseapp.com",
  projectId: "makaraonline-5464e",
  storageBucket: "makaraonline-5464e.firebasestorage.app",
  messagingSenderId: "1041589485836",
  appId: "1:1041589485836:web:06119973a19da0a14f0929",
  measurementId: "G-MKPPB635ZZ"
};

// Initialize Firebase for online orders
const appOnline = initializeApp(firebaseOnlineConfig, "onlineOrders");
const analyticsOnline = getAnalytics(appOnline);
const dbOnline = getFirestore(appOnline);

export { appOnline, analyticsOnline, dbOnline };
