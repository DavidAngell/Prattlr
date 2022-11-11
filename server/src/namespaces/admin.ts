import { Socket, SocketResponse } from "../types";

export default function adminHandler(socket: Socket) {
  socket.emit("connection established");
  socket.join("admin");

  socket.on("ban-user", (user_id, callback: (i: SocketResponse<any>) => void) => {
    try {
      console.log("Banning user: ", user_id);
      callback({ error: false });
    } catch (error) {
      callback({ error: true, content: error });
    }
  });
}