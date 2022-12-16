import { User, Message, SocketResponse, Server, UserScheme } from "../types";
import { ChatClient } from '@twurple/chat';

export default async function startTwitchChat(io: Server, db: any, channelName: string) {
  const liveChat = new ChatClient({ channels: [channelName] });
  await liveChat.connect();
  console.log("Connected to Twitch");

  liveChat.onMessage(async (channel, user, text) => {
    try {
      console.log({
        channel,
        user,
        text
      })

      const userObj = UserScheme.parse({
          id: user,
          accessToken: "twitch",
          name: user,
          pfp: "https://twitch.tv/favicon.ico",
          fromTwitch: true,
          fromYoutube: false,
          fromPrattlr: false,
          isMod: false,
          isAdmin: false,
      });
  
      const chatMessage: Message = {
        content: text,
        user: userObj,
        timestamp: (new Date()).toUTCString(),
      }
  
      // Save message to database
      const userRef = db.collection("twitch-users").doc(user);
      const doc = await userRef.get()
      const docExists = doc.exists;
  
      if (!docExists) {
        await userRef.set({
          id: userObj.id,
          accessToken: "twitch",
          name: userObj.name,
          pfp: userObj.pfp,
          fromTwitch: userObj.fromTwitch,
          fromYoutube: userObj.fromYoutube,
          fromPrattlr: userObj.fromPrattlr,
          isMod: userObj.isMod,
          isAdmin: userObj.isAdmin,
          logs: [chatMessage],
        });
      } else {
        await userRef.update({
          logs: [...doc.data().logs, chatMessage],
        });
      }
      
      // Send message to client
      io.emit("message", { error: false, content: chatMessage } as SocketResponse<Message>);
    } catch (error) {
      console.log(error)
    }
  });
}
