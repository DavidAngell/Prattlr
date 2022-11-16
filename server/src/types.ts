import { Socket as TempSocket, Server as TempServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { z } from 'zod';

export type Socket = TempSocket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
export type Server = TempServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
export type UUID = string;

export const SocketResponseSchema = z.object({
  error: z.boolean(),
  errorContent: z.string().optional(),
  content: z.any().optional()
});

export type SocketResponse<T> = z.infer<typeof SocketResponseSchema>;

export const UserScheme = z.object({
  id: z.string(),
  accessToken: z.string(),
  name: z.string(),
  pfp: z.string(),
  fromTwitch: z.boolean(),
  fromYoutube: z.boolean(),
  fromPrattlr: z.boolean(),
  isMod: z.boolean(),
  isAdmin: z.boolean(),
});

export type User = z.infer<typeof UserScheme>;

export const MessageScheme = z.object({
  content: z.string(),
  user: UserScheme,
  timestamp: z.string(),
});

export type Message = z.infer<typeof MessageScheme>;