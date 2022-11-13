import { Socket, SocketResponse, Message } from "../types";

export default function chatterHandler(socket: Socket, io: any) {
  socket.emit("connection established");
  socket.join("chatter");

  socket.on("chatter-message", (message, callback: (i: SocketResponse<Message>) => void) => {
    try {
      console.log("Chatter message: ", message);
      io.emit("message", { error: false, content: message } as SocketResponse<Message>);
      callback({ error: false });
    } catch (error) {
      callback({ error: true, content: error });
    }
  });
}