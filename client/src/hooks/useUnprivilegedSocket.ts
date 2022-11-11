import { io } from 'socket.io-client'
import { SOCKET_URL } from 'src/globals';
const socket = io(SOCKET_URL);

import { useEffect, useState } from 'react';
import { Message, SocketResponse } from '../types';

export interface UseUnprivilegedSocket {
  messages: Message[];
  isLoading: boolean;
}

export default function useUnprivilegedSocket() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.on('connection established', () => {
      console.log('connection established');
      setIsLoading(false);
    });

    socket.on('message', (res: SocketResponse<Message>) => {
      if (res.error) {
        console.log(res.content);
      } else {
        setMessages((messages) => [...messages, res.content]);
      }
    });

    return () => {
      socket.off('connection established');
      socket.off('message');
    }
  }, [socket]);

  return { messages, isLoading };
}