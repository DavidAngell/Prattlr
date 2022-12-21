import { adminHandler, modHandler, chatterHandler } from './namespaces/namespaces';
import { startTwitchChat, startYouTubeChat } from './external-chats/externalChats';
import { validateSocket } from './validation/validators';
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


// Create the moderator namespace
const modNamespace = io.of("/mod");
modNamespace.use(async (socket, next) => {
	const result = await validateSocket(db, socket, true);
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
	const result = await validateSocket(db, socket, false);
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
server.listen(port, () => console.log(`Socket listening at http://localhost:${port}`));
