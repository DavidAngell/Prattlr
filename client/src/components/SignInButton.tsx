import useSignedIn from "@hooks/useSignedIn";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import styles from "./SignInButton.module.css"
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

export default function SignInButton() {
  const { loggedIn } = useSignedIn();

  return <>
    {
      (loggedIn)
      ? <button 
        className={styles["sign-in-out-button"]}
        onClick={
          () => {
            const auth = getAuth();
            signOut(auth).then(() => {
              localStorage.removeItem('user');
              window.location.reload();
              console.log("Signed out");
            }).catch((error) => {
              console.log(error);
            });
          }
        }
      >
        Sign Out
      </button>
      : <button
        className={styles["sign-in-out-button"]}
        onClick={
          () => {
            const auth = getAuth();
            signInWithPopup(auth, provider)
              .then((result) => {
                // result.user.getIdToken().then((token) => {
                localStorage.setItem("user", JSON.stringify(result.user));
                window.location.reload();
              }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorCode + ": " + errorMessage);
              });
          }
        }
      >
        Sign In
      </button>
    }
  </>
}

