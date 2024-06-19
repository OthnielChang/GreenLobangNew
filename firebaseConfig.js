import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAeRLlwfPdDPC5oiQYSBI7TqWo7ncEh0bY",
    authDomain: "greenlobang-673cf.firebaseapp.com",
    projectId: "greenlobang-673cf",
    storageBucket: "greenlobang-673cf.appspot.com",
    messagingSenderId: "1040850733593",
    appId: "1:1040850733593:web:a2ab6e2e5fc0021f7df888",
    measurementId: "G-377N4PZ4DN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };