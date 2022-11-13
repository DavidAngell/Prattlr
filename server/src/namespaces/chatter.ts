import { Socket, SocketResponse, Message } from "../types";

export default function chatterHandler(socket: Socket, io: any, db: any) {
  socket.emit("connection established");
  socket.join("chatter");

  socket.on("chatter-message", async (message, callback: (i: SocketResponse<Message>) => void) => {
    try {
      console.log("Chatter message: ", message);

      // Save message to database
      const userRef = db.collection("prattlr-users").doc(message.user.id);
      const doc = await userRef.get()
      const docExists = doc.exists;

      if (!docExists) {
        await userRef.set({
          id: message.user.id,
          name: message.user.name,
          pfp: message.user.pfp,
          fromTwitch: false,
          fromYoutube: false,
          fromPrattlr: true,
          isMod: false,
          isAdmin: false,
          logs: [message],
        });
      } else {
        await userRef.update({
          logs: [...doc.data().logs, message],
        });
      }

      // Send message to all clients
      io.emit("message", { error: false, content: message } as SocketResponse<Message>);
      callback({ error: false });
    } catch (error) {
      callback({ error: true, content: error });
    }
  });
}