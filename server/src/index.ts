import adminHandler from './namespaces/admin';
import chatterHandler from './namespaces/chatter';
import modHandler from './namespaces/moderator';
import startYouTubeChat from './external-chats/youtube';
import startTwitchChat from './external-chats/twitch';
import { v4 as uuidv4 } from 'uuid';
import {  
	FIREBASE_SERVICE_ACCOUNT 
} from './credentials';

// Channels to join chat for
const CHANNEL_LIST = {
	youtube: [
		"UC554eY5jNUfDq3yDOJYirOQ"
	],
	twitch: [
		'xqc',
	]
}

// Initialize Socket.IO server
import * as express from 'express';
const app = express();
import * as http from 'http';
const server = http.createServer(app);

import { Server } from 'socket.io';
const port = 3001

app.use(require('cors')());
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

// Initialize Firebase Admin
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth';


initializeApp({
	credential: cert(FIREBASE_SERVICE_ACCOUNT as ServiceAccount),
});

const db: Firestore = getFirestore();

// Handle unprivledged users
io.on('connection', (socket: any) => {
	console.log('a user connected');
	socket.emit('connection established');
});

// Create the admin namespace
const adminNamespace = io.of("/admin");
adminNamespace.use((socket, next) => {
  console.log(socket.request)
  next();
});

import { Ok, Result, Err } from 'ts-results';
import { Socket } from 'socket.io';
import { DecodedIdToken } from 'firebase-admin/auth';
async function decodeToken(accessToken: string): Promise<Result<DecodedIdToken, string>> {
	const auth = getAuth();
	try {
		const decodedToken = await auth.verifyIdToken(accessToken);
		return Ok(decodedToken);
	} catch (error) {
		return Err(error);
	}
}
async function validateSocket(socket: Socket, checkMod: boolean): Promise<Result<Socket, string>> {
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

// Create the moderator namespace
const modNamespace = io.of("/mod");
modNamespace.use(async (socket, next) => {
	const result = await validateSocket(socket, true);
	if (result.err) {
		console.log(result.val);
		next(new Error(result.val));
	} else {
		next();
	}
});


// Create the chatter namespace
const chatterNamespace = io.of("/chatter");
chatterNamespace.use(async (socket, next) => {
	const result = await validateSocket(socket, false);
	if (result.err) {
		console.log(result.val);
		next(new Error(result.val));
	} else {
		next();
	}
});

// Handle the connection event for the admin namespace
adminNamespace.on("connection", socket => adminHandler(socket));

// Handle the connection event for the moderator namespace
modNamespace.on("connection", socket => modHandler(socket, io, db));

// Handle the connection event for the chatter namespace
chatterNamespace.on("connection", (socket) => chatterHandler(socket, io, db));

// Handle the YouTube API for each YouTube channel
CHANNEL_LIST.youtube.forEach((channelId: string) => {
	startYouTubeChat(io, db, channelId);
});
	
// Handle the Twitch API for each Twitch channel
CHANNEL_LIST.twitch.forEach((channelId: string) => {
	startTwitchChat(io, db, channelId);
});

// Start the server
server.listen(port, () => console.log(`API listening at http://localhost:${port}`));
