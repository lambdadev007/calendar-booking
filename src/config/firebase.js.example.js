import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  // apiKey: "AIzaSyCtrTXoGWZzYaMDQdOKMprAnc_iUtYrH3g",
  // authDomain: "energy-plus-3a6bb.firebaseapp.com",
  // projectId: "energy-plus-3a6bb",
  // storageBucket: "energy-plus-3a6bb.appspot.com",
  // messagingSenderId: "585371762946",
  // appId: "1:585371762946:web:57e4b0cb1bd8b75aea821b",
  // measurementId: "G-8QGYGJR9T7",

};

const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Get a list of cities from your database
export default db;
