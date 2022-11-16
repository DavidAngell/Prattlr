import { io } from 'socket.io-client'
import { SOCKET_URL } from 'src/globals';
const socket = io(SOCKET_URL);

import { useEffect, useState } from 'react';
import { Message, SocketResponse, MessageScheme, SocketResponseSchema } from '../types';
import { validateConfig } from 'astro/dist/core/config';

export interface UseUnprivilegedSocket {
  messages: Message[];
  isLoading: boolean;
  twitchMessages: Message[];
  youtubeMessages: Message[];
  prattlrMessages: Message[];
}

export default function useUnprivilegedSocket(): UseUnprivilegedSocket {
  const [messages, setMessages] = useState<Message[]>([]);
  const [twitchMessages, setTwitchMessages] = useState<Message[]>([]);
  const [youtubeMessages, setYoutubeMessages] = useState<Message[]>([]);
  const [prattlrMessages, setPrattlrMessages] = useState<Message[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.on('connection established', () => {
      console.log('connection established');
      setIsLoading(false);
    });

    socket.on('message', (res: SocketResponse<Message>) => {
      try {
        // Validate the response
        const validatedResponse = SocketResponseSchema.parse(res);
        if (res.error) throw new Error(validatedResponse.errorContent);
        
        // Validate the message
        const validatedMessage = MessageScheme.parse(res.content);

        // Add message to the messages array
        setMessages((messages) => [...messages, validatedMessage]);

        // Add message to the correct array 
        if (validatedMessage.user.fromTwitch) {
          setTwitchMessages((twitchMessages) => [...twitchMessages, validatedMessage]);
        } else if (validatedMessage.user.fromYoutube) {
          setYoutubeMessages((youtubeMessages) => [...youtubeMessages, validatedMessage]);
        } else if (validatedMessage.user.fromPrattlr) {
          setPrattlrMessages((prattlrMessages) => [...prattlrMessages, validatedMessage]);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    });

    return () => {
      // Clean up the socket listeners on component unmount
      socket.off('connection established');
      socket.off('message');
    }
  }, [socket]);

  return { 
    messages, 
    isLoading,
    twitchMessages,
    youtubeMessages,
    prattlrMessages
  };
}