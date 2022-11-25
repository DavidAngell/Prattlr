import { Result, Ok, Err } from 'ts-results';
import { io } from 'socket.io-client'

export default function createSocket(
  url: string, 
  auth: { accessToken: string }, 
  onSuccessfulConnection: () => any,
  onFailedConnection: (error: string) => any,
): Result<any, string> 
{
  const socket = io(url, { auth, });
  let connectionFailed = false;

  socket.on('connection established', () => {
    console.log('Connected to socket');
    onSuccessfulConnection();
  });

  socket.on('connect_error', (error: any) => {
    console.log('Failed to connect to socket');
    onFailedConnection(error);
  });

  if (connectionFailed) {
    return Err("Failed to connect to socket");
  } else {
    return Ok(socket);
  }  
}