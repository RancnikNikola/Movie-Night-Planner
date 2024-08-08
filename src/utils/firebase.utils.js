import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { FIREBASE_API, FIREBASE_REALTIME_DB_URL } from '../../apis';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: FIREBASE_API,
    authDomain: "movie-night-planner-a1b6f.firebaseapp.com",
    projectId: "movie-night-planner-a1b6f",
    storageBucket: "movie-night-planner-a1b6f.appspot.com",
    messagingSenderId: "401275922571",
    appId: "1:401275922571:web:5e95d0c022f9f15293cc8e",
    databaseURL: FIREBASE_REALTIME_DB_URL
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);