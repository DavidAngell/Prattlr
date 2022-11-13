import Message from "./Message";
import { Message as MessageType } from "../types";
import useChatScroll from "@hooks/useChatScroll";
import styles from "./MessageList.module.css";

interface MessageListProps {
  messages: MessageType[];
  showTimestamps?: false;
}

export default function MessageList({ messages, showTimestamps }: MessageListProps) {
  const ref = useChatScroll(messages)
  
  return <>
    <div ref={ref} className={styles["message-list"]}>
      {
        messages.map((message, index) => {
          return <Message key={index} message={message} />
        })
      }
    </div>
  </>
}