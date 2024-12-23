import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-PgxcsqxVmNPY85vIpGguOY0Cfl_1-3U",
  authDomain: "database-4fbef.firebaseapp.com",
  projectId: "database-4fbef",
  storageBucket: "database-4fbef.firebasestorage.app",
  messagingSenderId: "563207078452",
  appId: "1:563207078452:web:c6bfffa208081ba6b98061"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});

// Function to save auction results with retry logic
export const saveAuctionResults = async (userId: string, teams: any, retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const timestamp = new Date();
      await setDoc(doc(db, 'auctionResults', userId), {
        teams,
        timestamp,
        lastUpdated: timestamp
      });
      return true;
    } catch (error) {
      console.error(`Error saving auction results (attempt ${attempt + 1}/${retries}):`, error);
      if (attempt === retries - 1) return false;
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  return false;
};

// Function to get saved auction results with retry logic
export const getAuctionResults = async (userId: string, retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const docRef = doc(db, 'auctionResults', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.teams;
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting auction results (attempt ${attempt + 1}/${retries}):`, error);
      if (attempt === retries - 1) return null;
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  return null;
};