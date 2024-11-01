import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyABYLq8OhTtlXNAFp_jdV8p1mAw8dYmSnA",
  authDomain: "safinder-86c3c.firebaseapp.com",
  projectId: "safinder-86c3c",
  storageBucket: "safinder-86c3c.firebasestorage.app",
  messagingSenderId: "673674171046",
  appId: "1:673674171046:web:58049f77a71d6ec46b9a67",
  measurementId: "G-BWSZ8W3C7N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, db, auth, storage, googleProvider };