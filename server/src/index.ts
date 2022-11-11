import adminHandler from './namespaces/admin';
import chatterHandler from './namespaces/chatter';
import modHandler from './namespaces/moderator';
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
chatterNamespace.on("connection", (socket) => chatterHandler(socket));

server.listen(port, () => console.log(`API listening at http://localhost:${port}`));