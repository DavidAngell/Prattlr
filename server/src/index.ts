import adminHandler from './namespaces/admin';
import chatterHandler from './namespaces/chatter';
import modHandler from './namespaces/moderator';
import { YouTubeChatMessage, Message, User, SocketResponse } from './types';
import { YOUTUBE_API, YOUTUBE_CHANNEL_ID, TWITCH_AUTH_PROVIDER } from './credentials';
import { v4 as uuidv4 } from 'uuid';

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
chatterNamespace.on("connection", (socket) => chatterHandler(socket, io));


// Handle the YouTube API
// const YouTube = require('youtube-live-chat');
// const yt = new YouTube(YOUTUBE_CHANNEL_ID, YOUTUBE_API);

// yt.on('ready', () => yt.listen(500))
// yt.on('error', error => console.error(error))
// yt.on('message', (data: YouTubeChatMessage) => {
// 	const user: User = {
// 		id: data.authorDetails.channelId,
// 		name: data.authorDetails.displayName,
// 		pfp: data.authorDetails.profileImageUrl,
// 		fromTwitch: false,
// 		fromYoutube: true,
// 		fromPrattlr: false,
// 		isMod: data.authorDetails.isChatModerator,
// 		isAdmin: data.authorDetails.isChatOwner,
// 	}

// 	const chatMessage: Message = {
// 		content: data.snippet.displayMessage,
// 		user: user,
// 		timestamp: data.snippet.publishedAt,
// 	}

//   console.log(`[${data.snippet.publishedAt}] ${data.authorDetails.displayName}: ${data.snippet.displayMessage}`);
// 	io.emit("message", chatMessage);
// })

// Handle the Twitch API
import { ChatClient } from '@twurple/chat';
const twitchClient = new ChatClient({ channels: ['moistcr1tikal'] });
twitchClient.connect().then(() => {
	console.log("Connected to Twitch");
	twitchClient.onMessage((channel, user, text) => {
		console.log({
			channel,
			user,
			text
		})

		const chatMessage: Message = {
			content: text,
			user: {
				id: "test",
				name: user,
				pfp: "test",
				fromTwitch: true,
				fromYoutube: false,
				fromPrattlr: false,
				isMod: false,
				isAdmin: false,
			},
			timestamp: new Date().toISOString(),
		}

		io.emit("message", { error: false, content: chatMessage } as SocketResponse<Message>);
	});
});

server.listen(port, () => console.log(`API listening at http://localhost:${port}`));