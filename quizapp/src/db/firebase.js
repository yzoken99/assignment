import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyAJyP3cx0gXRXopFUyXAlAKWP_NSu911Kk",
  authDomain: "quizapp-6e3cb.firebaseapp.com",
  projectId: "quizapp-6e3cb",
  storageBucket: "quizapp-6e3cb.appspot.com",
  messagingSenderId: "37664473268",
  appId: "1:37664473268:web:d2ce024cd7d80e2c6d97e1",
  measurementId: "G-WF35TP5L7X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;