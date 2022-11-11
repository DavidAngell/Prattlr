import { Socket, SocketResponse } from "../types";

export default function modHandler(socket: Socket) {
  socket.emit("connection established");
  socket.join("moderator");
}