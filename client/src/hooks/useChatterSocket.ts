import { io } from 'socket.io-client'
import { SOCKET_URL } from 'src/globals';
const socket = io(SOCKET_URL + '/chatter');

import { useEffect, useState } from 'react';
import { Message, SocketResponse, User } from '../types';

export interface UseChatterSocket {
  sendMessage: (message: string) => void;
}

export default function useChatterSocket(user: User): UseChatterSocket {
  return { 
    sendMessage: (message: string) => {
      socket.emit('chatter-message', 
        { 
          content: message, 
          user, 
          timestamp: (new Date()).toISOString()
        } as Message, 

        (res: SocketResponse<any>) => {
          if (res.error) {
            console.log(res.errorContent);
          }
        });
    }
   };
}