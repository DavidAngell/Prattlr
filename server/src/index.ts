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
		'channel1',
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
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

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
modNamespace.use((socket, next) => {
  // ensure the user has sufficient rights
  next();
});


// Create the chatter namespace
const chatterNamespace = io.of("/chatter");
chatterNamespace.use((socket, next) => {
	// ensure the user has sufficient rights
	next();
});

// Handle the connection event for the admin namespace
adminNamespace.on("connection", socket => adminHandler(socket));

// Handle the connection event for the moderator namespace
modNamespace.on("connection", socket => modHandler(socket));

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