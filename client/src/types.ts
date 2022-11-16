import { z } from 'zod';


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
  pfp: z.string().url(),
  fromTwitch: z.boolean(),
  fromYoutube: z.boolean(),
  fromPrattlr: z.boolean(),
  isMod: z.boolean(),
  isAdmin: z.boolean(),
});

export type User = z.infer<typeof UserScheme>;

export const FirebaseUserScheme = z.object({
  uid: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().optional(),
  displayName: z.string(),
  photoURL: z.string().url(),
  isAnonymous: z.boolean().optional(),
  stsTokenManager: z.object({
    refreshToken: z.string(),
    accessToken: z.string(),
    expirationTime: z.number(),
  }),
  createdAt: z.string().optional(),
  lastLoginAt: z.string().optional(),
  apiKey: z.string().optional(),
  appName: z.string().optional(),
});
  
export type FirebaseUser = z.infer<typeof FirebaseUserScheme>;

export const MessageScheme = z.object({
  content: z.string(),
  user: UserScheme,
  timestamp: z.string(),
});

export type Message = z.infer<typeof MessageScheme>;