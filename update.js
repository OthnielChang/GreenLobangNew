const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAeRLlwfPdDPC5oiQYSBI7TqWo7ncEh0bY",
    authDomain: "greenlobang-673cf.firebaseapp.com",
    projectId: "greenlobang-673cf",
    storageBucket: "greenlobang-673cf.appspot.com",
    messagingSenderId: "1040850733593",
    appId: "1:1040850733593:web:a2ab6e2e5fc0021f7df888",
    measurementId: "G-377N4PZ4DN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const updateUsersWithPoints = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);

    usersSnapshot.forEach(async (userDoc) => {
      const userRef = doc(db, 'users', userDoc.id);
      await updateDoc(userRef, {
        points: 0, // Default points value
      });
      console.log(`Updated user: ${userDoc.id}`);
    });

    console.log('All users updated with points field.');
  } catch (error) {
    console.error('Error updating users with points field:', error);
  }
};

updateUsersWithPoints();
