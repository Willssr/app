import { initializeApp } from 'firebase/app';
import {
    getAuth,
    User as FirebaseUser,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { User as AppUser } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyCyIo8D4y09Ip53KWdf7D8gULG5L7kf9bQ",
  authDomain: "appnino-fc293.firebaseapp.com",
  projectId: "appnino-fc293",
  storageBucket: "appnino-fc293.appspot.com",
  messagingSenderId: "1023289201912",
  appId: "1:1023289201912:web:631651a5a5e171a541570d",
  measurementId: "G-3GCDJ34NHQ"
};

// Check if the config has been filled out
export const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile
};


/**
 * Checks if a user profile exists in Firestore. If not, creates one.
 * @param {FirebaseUser} user - The user object from Firebase Authentication.
 * @returns {Promise<AppUser>} The user profile from Firestore.
 */
export const getOrCreateUserProfile = async (user: FirebaseUser): Promise<AppUser> => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        // User is new, create a profile document
        const { displayName, photoURL, uid, email } = user;

        // Handle a race condition where updateProfile hasn't finished before this runs.
        // If displayName is null and the email is our custom format, extract the ID from it.
        let profileName = displayName;
        if (!profileName && email && email.endsWith('@ninovisk.app')) {
            profileName = email.split('@')[0];
        }
        
        const newUserProfile: AppUser = {
            id: uid,
            name: profileName || 'New User',
            email: email || undefined,
            avatar: photoURL || `https://picsum.photos/seed/${uid}/100/100`,
            points: 0,
            bio: 'Welcome to NinoVisk!',
            coverPhoto: `https://picsum.photos/seed/${uid}/1200/400`,
            profileMusicUrl: '',
            friends: [],
            blockedUsers: [],
        };
        
        await setDoc(userRef, newUserProfile);
        return newUserProfile;
    } else {
        // User exists, return their profile
        return { id: docSnap.id, ...docSnap.data() } as AppUser;
    }
};