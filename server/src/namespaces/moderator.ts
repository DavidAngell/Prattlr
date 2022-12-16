import { Socket, SocketResponse, Message, MessageScheme } from "../types";
import { getAuth } from "firebase-admin/auth";
import { Firestore } from 'firebase-admin/firestore'

interface ValidateUser {
  isValid: boolean;
  error?: string;
  userRef?: any;
  doc?: any;
}

async function validateUser(socket: Socket, db: Firestore): Promise<ValidateUser> {
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
    }

    if (!doc.data().isMod) {
      throw new Error("User is not a moderator");
    }

    return {
      isValid: true,
      userRef,
      doc,
    };

  } catch (error) {
    return {
      isValid: false,
      error: error.message,
    };
  }
}

export default function modHandler(socket: Socket, io: any, db: Firestore) {
  socket.emit("connection established");
  socket.join("moderator");

  socket.on("moderator-message", async (message, callback: (i: SocketResponse<Message>) => void) => {
    try {
      // Validate message
      const validatedMessage = MessageScheme.parse(message);

      // Validate the user
      const { 
        isValid, 
        error, 
        userRef, 
        doc 
      } = await validateUser(socket, db);

      if (!isValid) {
        throw new Error(error);
      }

      // Save message to database
      await userRef.update({
        logs: [...doc.data().logs, validatedMessage],
      });

      // Send message to all clients
      io.emit("message", { error: false, content: validatedMessage } as SocketResponse<Message>);
      callback({ error: false });
    } catch (error) {
      console.log(error);
      callback({ error: true, content: error });
    }
  });
}