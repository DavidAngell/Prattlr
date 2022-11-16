import { LiveChat } from "youtube-chat";
import { MessageItem, EmojiItem } from 'youtube-chat/dist/types/data';
import { UserScheme, MessageScheme, Message, SocketResponse, Server } from "../types";

function isEmojiItem(item: MessageItem): item is EmojiItem {
	return (item as EmojiItem).emojiText !== undefined;
}

export default function startYouTubeChat(io: Server, db: any, chatId: string) {
  const liveChat = new LiveChat({ channelId: chatId })
  liveChat.on("start", (liveId) => console.log("Live chat started: ", liveId))
  liveChat.on("error", (err) => console.error(err))
  liveChat.on("chat", async (chatItem) => {
    try {
      // Create user object for YouTube user
      const user = UserScheme.parse({
        id: chatItem.author.channelId,
        accessToken: "youtube",
        name: chatItem.author.name,
        pfp: chatItem.author.thumbnail.url,
        fromTwitch: false,
        fromYoutube: true,
        fromPrattlr: false,
        isMod: chatItem.isModerator,
        isAdmin: chatItem.isOwner,
      });
    
      // Create message object for YouTube message
      const chatMessage = MessageScheme.parse({
        content: (() => {
          return chatItem.message.reduce((content, messageItem) => {
            if (isEmojiItem(messageItem)) {
              return content + messageItem.emojiText;
            } else {
              return content + messageItem.text;
            }
          }, "")
        })(),
        user: user,
        timestamp: chatItem.timestamp.toUTCString(),
      });
  
      // Save message to database
      const userRef = db.collection("youtube-users").doc(user.id);
      const doc = await userRef.get()
      const docExists = doc.exists;
  
      if (!docExists) {
        await userRef.set({
          id: user.id,
          accessToken: "youtube",
          name: user.name,
          pfp: user.pfp,
          fromTwitch: false,
          fromYoutube: true,
          fromPrattlr: false,
          isMod: user.isMod,
          isAdmin: user.isAdmin,
          logs: [chatMessage],
        });
      } else {
        await userRef.update({
          logs: [...doc.data().logs, chatMessage],
        });
      }
  
      // Send message to all clients
      console.log(`[${chatItem.timestamp.toISOString()}] ${chatItem.author.name}: ${chatMessage.content}`);
      io.emit("message", { error: false, content: chatMessage } as SocketResponse<Message>);
    } catch (error) {
      console.error(error);
    }
  })
  
  liveChat.start();
}