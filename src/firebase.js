import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  increment
} from "firebase/firestore";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-b__vcGxGnpZG_jUrsvR2uIam4monnSU",
  authDomain: "lions-tigers-bears-auth.firebaseapp.com",
  projectId: "lions-tigers-bears-auth",
  storageBucket: "lions-tigers-bears-auth.firebasestorage.app",
  messagingSenderId: "606144190572",
  appId: "1:606144190572:web:06414ce2d9d9a499612049",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google provider
const provider = new GoogleAuthProvider();

// Login function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user to Firestore
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        lastLogin: new Date().toISOString(),
        logins: increment(1),
      },
      { merge: true }
    );

    console.log("Firestore updated for user:", user.uid);
  } catch (error) {
    console.error("Google login failed:", error);
  }
};

// Logout function
export const logout = () => signOut(auth);
