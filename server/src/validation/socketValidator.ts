import { Ok, Result, Err } from 'ts-results';
import { Socket } from 'socket.io';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { Firestore } from 'firebase-admin/firestore'

async function decodeToken(accessToken: string): Promise<Result<DecodedIdToken, string>> {
	const auth = getAuth();
	try {
		const decodedToken = await auth.verifyIdToken(accessToken);
		return Ok(decodedToken);
	} catch (error) {
		return Err(error);
	}
}

export async function validateSocket(db: Firestore, socket: Socket, checkMod: boolean): Promise<Result<Socket, string>> {
	// Check if the socket has a token
	const { accessToken } = socket.handshake.auth;
	if (!accessToken) {
		Err("No access token provided");
	}

	// Ensure the user exists in the database
	const decodedToken = await decodeToken(accessToken);
	if (!decodedToken.ok) {
		return Err("Invalid access token");
	}

	// Check if the user is a mod if needed
	if (checkMod) {
		const userRef = db.collection("prattlr-users").doc(decodedToken.val.uid);
		const doc = await userRef.get();
		const docExists = doc.exists;

		if (!docExists) {
			Err("User does not exist");
		} else {
			const userData = doc.data();
			if (!userData.isMod) {
				Err("User is not a moderator");
			}
		}
	}

	return Ok(socket);
}
