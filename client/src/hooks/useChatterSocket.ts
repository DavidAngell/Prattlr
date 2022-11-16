import { io } from 'socket.io-client'
import { SOCKET_URL } from 'src/globals';
import { useEffect, useState } from 'react';
import { Message, SocketResponse, User, UserScheme } from '../types';

export interface UseChatterSocket {
  success: boolean;
  sendMessage: (message: string) => void;
}

export default function useChatterSocket(user: User): UseChatterSocket {
  // Validate the user
  const { success } = UserScheme.safeParse(user);

  // Create the socket
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Create the socket if the user is valid
    if (success) {
      // Initialize the socket
      const socket = io(SOCKET_URL + '/chatter', {
        auth: { accessToken: user.accessToken}
      });

      // Set the socket state to the initialized socket
      setSocket(socket);
    }
  }, [user]);

  if (success) {
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
  } else {
    // Return a default object if the user is not valid
    return { 
      success: false,
      sendMessage: (message: string) => {},
    };
  }
}