import useSignedIn from "@hooks/useSignedIn";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import styles from "./SignInButton.module.css"


export default function SignInButton() {
  const { loggedIn, signOut, signIn } = useSignedIn();

  return <>
    {
      (loggedIn)
        ? <button 
          className={styles["sign-in-out-button"]}
          onClick={signOut}
        >
          Sign Out
        </button>
        : <button
          className={styles["sign-in-out-button"]}
          onClick={signIn}
        >
          Sign In
        </button>
    }
  </>
}

