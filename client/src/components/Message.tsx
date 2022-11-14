import { Message } from "../types";
import styles from "./Message.module.css";

interface ChatInputProps {
	message: Message;
	showTimestamps?: false;
}

export default function Message({ message, showTimestamps }: ChatInputProps) {
	return <>
		<div className={styles["message"]}>
			{ message.user.fromPrattlr && <img src="/favicon.svg"></img>}
			{ showTimestamps && <div className={styles["timestamp"]}>{message.timestamp}</div> }
			<span className={styles["message-text"]}>{message.user.name}:</span>
			<span className={styles["message-text"]}>{message.content}</span>
		</div>
	</>
}