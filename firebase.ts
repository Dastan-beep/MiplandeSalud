import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { UserProfile, FoodItem, PlateItem } from '../types/nutrition';

// Client-side Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if all essential keys are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'TU_API_KEY_AQUI'
);

// Initialize Firebase only if config is valid
const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
export const db = app ? getFirestore(app) : null;

/**
 * Save user health profile to Firestore
 */
export async function syncProfileToFirestore(userId: string, profile: UserProfile) {
  if (!db || !userId) return false;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { profile, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error syncing profile to Firestore:', error);
    return false;
  }
}

/**
 * Retrieve user profile from Firestore
 */
export async function fetchProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  if (!db || !userId) return null;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists() && snap.data()?.profile) {
      return snap.data().profile as UserProfile;
    }
  } catch (error) {
    console.error('Error fetching profile from Firestore:', error);
  }
  return null;
}

/**
 * Save custom food to Firestore collection
 */
export async function saveCustomFoodToCloud(userId: string, food: FoodItem) {
  if (!db || !userId) return false;
  try {
    const foodsCol = collection(db, 'users', userId, 'custom_foods');
    await addDoc(foodsCol, {
      ...food,
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error saving custom food to Cloud:', error);
    return false;
  }
}
