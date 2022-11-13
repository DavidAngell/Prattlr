import { useState } from 'react';
import useChatterSocket from '@hooks/useChatterSocket';
import { User } from 'src/types';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  user: User;
}

export default function ChatInput({ user }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { sendMessage } = useChatterSocket(user);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message != "") {
      sendMessage(message);
      setMessage("");
    }
  }

  return <div className={styles["chat-input-outer"]}>
    <form className={styles["chat-form"]} onSubmit={handleSubmit}>
      <input 
        className={styles["chat-input"]} 
        type="text"  
        value={message} 
        placeholder="Type a message..."
        onChange={e => setMessage(e.target.value)}
      />
      <button className={styles["chat-button"]} type="submit">Send</button>
    </form>
  </div>
}