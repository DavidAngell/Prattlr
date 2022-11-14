import { User, Message, SocketResponse, Server } from "../types";
import { ChatClient } from '@twurple/chat';

export default function startTwitchChat(io: Server, db: any, channelName: string) {
  const liveChat = new ChatClient({ channels: [channelName] });
  liveChat.connect().then(() => {
    console.log("Connected to Twitch");
    liveChat.onMessage(async (channel, user, text) => {
      console.log({
        channel,
        user,
        text
      })

      const userObj: User = {
          id: null,
          accessToken: "twitch",
          name: user,
          pfp: null,
          fromTwitch: true,
          fromYoutube: false,
          fromPrattlr: false,
          isMod: false,
          isAdmin: false,
      }
  
      const chatMessage: Message = {
        content: text,
        user: userObj,
        timestamp: new Date().toISOString(),
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
    });
  });
}
