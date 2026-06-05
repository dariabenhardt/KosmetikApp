import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAz27t474kcDfMdOrAIkZfk3yLXSKM68Gg",
  authDomain: "kosmetikapp-36ca6.firebaseapp.com",
  projectId: "kosmetikapp-36ca6",
  storageBucket: "kosmetikapp-36ca6.firebasestorage.app",
  messagingSenderId: "377416414347",
  appId: "1:377416414347:web:4c1d4e1fd20bd3c4f1508e",
  measurementId: "G-6ZK58GLB58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);