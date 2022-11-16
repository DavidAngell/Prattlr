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
const app = require('express')();
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
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

initializeApp({
	credential: cert(FIREBASE_SERVICE_ACCOUNT),
});

const db = getFirestore();

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

// Create the moderator namespace
const modNamespace = io.of("/mod");
modNamespace.use(async (socket, next) => {
  try {
		// Ensure the user has a valid
		const { accessToken } = socket.handshake.auth;
		if (!accessToken) {
			throw new Error("No access token provided");
		}

		// Ensure the user exists in the database
		const decodedToken = await getAuth().verifyIdToken(accessToken);
		if (!decodedToken) {
			throw new Error("User does not exist");
		}

		// Ensure the user is a moderator
		const userRef = db.collection("prattlr-users").doc(decodedToken.uid);
		const doc = await userRef.get();
		const docExists = doc.exists;

		if (!docExists) {
			throw new Error("User does not exist");
		} else {
			const userData = doc.data();
			if (!userData.isMod) {
				throw new Error("User is not a moderator");
			}
		}

		next();
	} catch (error) {
		console.log(error);
		next(new Error(error));
	}
  next();
});


// Create the chatter namespace
const chatterNamespace = io.of("/chatter");
chatterNamespace.use(async (socket, next) => {
	try {
		// Ensure the user has a valid
		const { accessToken } = socket.handshake.auth;
		if (!accessToken) {
			throw new Error("No access token provided");
		}

		// Ensure the user exists in the database
		const authToken = await getAuth().verifyIdToken(accessToken);
		if (!authToken) {
			throw new Error("User does not exist");
		}

		next();
	} catch (error) {
		console.log(error);
		next(new Error(error));
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