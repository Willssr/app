import { initializeApp, FirebaseApp } from 'firebase/app';
import {
    getAuth,
    User as FirebaseUser,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    Auth
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { User as AppUser } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyAKHqe7l-FdXjwYlOeWNoEmQfahRQfcb4A",
  authDomain: "ninoviskapp.firebaseapp.com",
  projectId: "ninoviskapp",
  storageBucket: "ninoviskapp.appspot.com",
  messagingSenderId: "178779435730",
  appId: "1:178779435730:web:a4aa9dc18b8761010c330b",
  measurementId: "G-4MJNBQBW9W"
};

// Check if the config has been filled out
export const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
}


export {
    auth,
    db,
    storage,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile
};

/**
 * Signs in the user with Google.
 * @returns {Promise<FirebaseUser>} The signed-in user.
 */
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth!, provider);
        // The onAuthStateChanged listener will handle the user profile creation.
        return result.user;
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        throw error;
    }
};


/**
 * Checks if a user profile exists in Firestore. If not, creates one.
 * Also ensures the Firebase Auth profile's displayName is set.
 * @param {FirebaseUser} user - The user object from Firebase Authentication.
 * @returns {Promise<AppUser>} The user profile from Firestore.
 */
export const getOrCreateUserProfile = async (user: FirebaseUser): Promise<AppUser> => {
    const userRef = doc(db!, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        // User is new, create a profile document
        const { displayName, photoURL, uid, email } = user;

        // If displayName is null (e.g., email/password signup), create one from the email.
        let profileName = displayName;
        if (!profileName && email) {
            profileName = email.split('@')[0];
        }
        
        const finalName = profileName || 'New User';

        const newUserProfile: AppUser = {
            id: uid,
            name: finalName,
            email: email || undefined,
            avatar: photoURL || `https://picsum.photos/seed/${uid}/100/100`,
            points: 0,
            bio: 'Welcome to NinoVisk!',
            coverPhoto: `https://picsum.photos/seed/${uid}/1200/400`,
            profileMusicUrl: '',
            friends: [],
            blockedUsers: [],
        };
        
        // Create the Firestore doc and update the Auth profile concurrently.
        await Promise.all([
            setDoc(userRef, newUserProfile),
            // Only update the auth profile if the displayName isn't already set to the correct name.
            (!displayName || displayName !== finalName) && finalName !== 'New User' 
                ? updateProfile(user, { displayName: finalName }) 
                : Promise.resolve()
        ]);
        
        return newUserProfile;
    } else {
        // User exists, return their profile, ensuring required arrays are present.
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            friends: data.friends || [],
            blockedUsers: data.blockedUsers || [],
        } as AppUser;
    }
};