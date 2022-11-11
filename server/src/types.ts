import { Socket as TempSocket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type Socket = TempSocket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
export type UUID = string;
export interface SocketResponse<T> {
	error: boolean,
	errorContent?: string,
	content?: T
}

export interface User {
  id: string;
  name: string;
  pfp: string;
  fromTwitch: boolean;
  fromYoutube: boolean;
  fromPrattlr: boolean;
  isMod: boolean;
  isAdmin: boolean;
}

export interface Message {
  content: string;
  user: User;
  timestamp: number;
}