import { Socket, SocketResponse, Message, MessageScheme } from "../types";
import { getAuth } from "firebase-admin/auth";
import { Firestore } from 'firebase-admin/firestore'

export default function chatterHandler(socket: Socket, io: any, db: Firestore) {
  socket.emit("connection established");
  socket.join("chatter");

  socket.on("chatter-message", async (message, callback: (i: SocketResponse<Message>) => void) => {
    try {
      // Validate message
      const validatedMessage = MessageScheme.parse(message);

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

      // Save message to database
      const userRef = db.collection("prattlr-users").doc(decodedToken.uid);
      const doc = await userRef.get()
      const docExists = doc.exists;

      if (!docExists) {
        await userRef.set({
          id: decodedToken.uid,
          authToken: accessToken,
          name: validatedMessage.user.name,
          pfp: validatedMessage.user.pfp,
          fromTwitch: false,
          fromYoutube: false,
          fromPrattlr: true,
          isMod: false,
          isAdmin: false,
          logs: [validatedMessage],
        });
      } else {
        await userRef.update({
          logs: [...doc.data().logs, validatedMessage],
        });
      }

      // Send message to all clients
      io.emit("message", { error: false, content: validatedMessage } as SocketResponse<Message>);
      callback({ error: false });
    } catch (error) {
      console.log(error);
      callback({ error: true, content: error });
    }
  });
}