import { useState, useEffect } from 'react';
import { User, FirebaseUserScheme } from 'src/types';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBUfBfWcbf_4yA-l5FBjMiCFa1y25vqPqs",
  authDomain: "prattlr.firebaseapp.com",
  projectId: "prattlr",
  storageBucket: "prattlr.appspot.com",
  messagingSenderId: "1002609473722",
  appId: "1:1002609473722:web:c2ebb312dfcc80a1236a83",
  measurementId: "G-6SE7CVK1PM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

export interface UseSignedIn {
  user: User;
  loggedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

export default function useSignedIn(): UseSignedIn {
  // Get user from local storage
	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
    try {
      if (localStorage) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
          return;
        }

        const validatedUser = FirebaseUserScheme.parse(storedUser);
        setUser({
          id: validatedUser.uid,
          accessToken: validatedUser.stsTokenManager.accessToken,
          name: validatedUser.displayName,
          pfp: validatedUser.photoURL,
          fromTwitch: false,
          fromYoutube: false,
          fromPrattlr: true,
          isMod: false,
          isAdmin: false,
        })
      }
    } catch (error) {
      console.log(error);
    }
	}, [localStorage]);

  return {
    loggedIn: user !== null,
    user,
    signOut: () => {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          localStorage.removeItem('user');
          window.location.reload();
          console.log("Signed out");
        }).catch((error) => {
          console.log(error);
        });
    },
    signIn: () => {
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const validatedUser = FirebaseUserScheme.parse(result.user);
          localStorage.setItem("user", JSON.stringify(validatedUser));
          window.location.reload();
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorCode + ": " + errorMessage);
        });
    }
  }
}