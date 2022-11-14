import { useState, useEffect } from 'react';
import { User } from 'src/types';

export interface UseSignedIn {
  user: User;
  loggedIn: boolean;
}

export default function useSignedIn() {
  // Get user from local storage
	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		if (localStorage) {
			const storedUser = JSON.parse(localStorage.getItem('user'));
			if (storedUser) {
				setUser({
					id: storedUser.uid,
					name: storedUser.displayName,
					pfp: storedUser.photoURL,
					fromTwitch: false,
					fromYoutube: false,
					fromPrattlr: true,
					isMod: false,
					isAdmin: false,
				})
			}
		}
	}, [localStorage]);

  return {
    loggedIn: user !== null,
    user,
  }
}