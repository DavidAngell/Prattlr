export interface User {
  id: string;
  accessToken: string;
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
  timestamp: string;
}

export interface SocketResponse<T> {
  error: boolean,
  errorContent?: string,
  content?: T
}