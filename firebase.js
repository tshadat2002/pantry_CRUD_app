// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRpbhAX3B7iiDX1quE5Yw5OK_gLcZbb6w",
  authDomain: "inventory-management-4b295.firebaseapp.com",
  projectId: "inventory-management-4b295",
  storageBucket: "inventory-management-4b295.appspot.com",
  messagingSenderId: "831146948182",
  appId: "1:831146948182:web:3127107c3e4c8cae246df7",
  measurementId: "G-CKVVXCNWVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
