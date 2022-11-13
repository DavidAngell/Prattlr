import { io } from 'socket.io-client'
import { SOCKET_URL } from 'src/globals';
const socket = io(SOCKET_URL);

import { useEffect, useState } from 'react';
import { Message, SocketResponse } from '../types';

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
      if (res.error) {
        console.log(res.errorContent);
      } else {
        setMessages((messages) => [...messages, res.content]);

        if (res.content.user.fromTwitch) {
          setTwitchMessages((twitchMessages) => [...twitchMessages, res.content]);
        } else if (res.content.user.fromYoutube) {
          setYoutubeMessages((youtubeMessages) => [...youtubeMessages, res.content]);
        } else if (res.content.user.fromPrattlr) {
          setPrattlrMessages((prattlrMessages) => [...prattlrMessages, res.content]);
        }
      }
    });

    return () => {
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