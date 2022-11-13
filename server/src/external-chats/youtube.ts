import { LiveChat } from "youtube-chat";
import { MessageItem, EmojiItem } from 'youtube-chat/dist/types/data';
import { User, Message, SocketResponse, Server } from "../types";

function isEmojiItem(item: MessageItem): item is EmojiItem {
	return (item as EmojiItem).emojiText !== undefined;
}

export default function startYouTubeChat(io: Server, db: any, chatId: string) {
  const liveChat = new LiveChat({ channelId: chatId })
  
  liveChat.on("start", (liveId) => console.log("Live chat started: ", liveId))
  liveChat.on("error", (err) => console.error(err))
  liveChat.on("chat", async (chatItem) => {
    const user: User = {
      id: chatItem.author.channelId,
      name: chatItem.author.name,
      pfp: chatItem.author.thumbnail.url,
      fromTwitch: false,
      fromYoutube: true,
      fromPrattlr: false,
      isMod: chatItem.isModerator,
      isAdmin: chatItem.isOwner,
    }
  
    const chatMessage: Message = {
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
      timestamp: chatItem.timestamp.toISOString(),
    }

    // Save message to database
    const userRef = db.collection("youtube-users").doc(user.id);
    const doc = await userRef.get()
    const docExists = doc.exists;

    if (!docExists) {
      await userRef.set({
        id: user.id,
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
  })
  
  liveChat.start().then((ok) => {
    if (!ok) {
      console.log("Failed to start live chat");
    }
  })
}