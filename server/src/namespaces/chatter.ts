import { Socket, SocketResponse } from "../types";

export default function chatterHandler(socket: Socket) {
  socket.emit("connection established");
  socket.join("chatter");

  socket.on("get-sessions", (callback: (i: SocketResponse<any>) => void) => {
    console.log("Getting sessions");
    callback({ error: false, content: "test" });
  });
}