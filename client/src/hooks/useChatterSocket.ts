import { SOCKET_URL } from 'src/globals';
import { useEffect, useState } from 'react';
import { Message, SocketResponse, User, UserScheme } from '../types';
import createSocket from 'src/utils/createSocket';

export interface UseChatterSocket {
  success: boolean;
  sendMessage: (message: string) => void;
}

export default function useChatterSocket(user: User): UseChatterSocket {
  // Validate the user
  const { success: validUser } = UserScheme.safeParse(user);

  // Create the socket
  const [socket, setSocket] = useState<any>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // Create the socket if the user is valid
    if (validUser) {
      const socketResult = createSocket(
        SOCKET_URL + '/chatter',
        { accessToken: user.accessToken },
        () => setSocketConnected(true),
        (error: string) => setSocketConnected(false),
      );

      if (socketResult.ok) {
        setSocket(socketResult.val);
      }
    }

    return () => {
      // Clean up the socket listeners on component unmount
      if (socket) socket.removeAllListeners();
    }
  }, [user]);

  if (socketConnected) {
    // Return the socket and the sendMessage function if the user is valid
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
  }

  return {
    success: socketConnected,
    sendMessage: (socketConnected)
      ? (message: string) => {
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
          }

        );
      }
      : () => {},
  }
}