import { io } from 'socket.io-client'
import { SOCKET_URL } from 'src/globals';
import { useEffect, useState } from 'react';
import { Message, SocketResponse, User, UserScheme } from '../types';

export interface UseChatterSocket {
  success: boolean;
  sendMessage?: (message: string) => void;
}

export default function useChatterSocket(user: User): UseChatterSocket {
  const { success } = UserScheme.safeParse(user);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (success) {
      console.log(user.accessToken)
      const socket = io(SOCKET_URL + '/chatter', {
        auth: {
          accessToken: user.accessToken,
        }
      });
      setSocket(socket);
    }
  }, [user]);

  if (success) {
    return {
      success: true,
      sendMessage: (message: string) => {
        socket.emit('chatter-message', 
          { 
            content: message, 
            user, 
            timestamp: new Date().toUTCString()
          } as Message, 
  
          (res: SocketResponse<any>) => {
            if (res.error) {
              console.log(res.errorContent);
            }
          });
      }
     };
  } else {
    return { success: false };
  }
}