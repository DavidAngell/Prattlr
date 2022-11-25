import { Message } from "../types";
import styles from "./Message.module.css";
import { useEffect, useState } from "react";
import { MenuItem, useMenuState, ControlledMenu } from '@szhsin/react-menu';

interface MessageProps {
	message: Message;
	showTimestamps?: false;
}

export default function Message({ message, showTimestamps, }: MessageProps) {
	const platformClass = (() => {
		if (message.user.fromPrattlr) {
			return "prattlr";
		} else if (message.user.fromTwitch) {
			return "twitch";
		} else if (message.user.fromYoutube) {
			return "youtube";
		}
	})();

	return <>
		<div className={styles["message"]}>
			{ message.user.fromPrattlr && <img src="/favicon.svg"></img>}
			{/* { showTimestamps && <div className={styles["timestamp"]}>{message.timestamp}</div> } */}
			<a href={`/user/${message.user.id}`} className={`${styles["message-text"]} ${styles[platformClass]}`}>
				<span className={`${styles["message-text"]} ${styles[platformClass]}`}>{message.user.name}:</span>
			</a>
			<span className={styles["message-text"]}>{message.content}</span>
		</div>
	</>
}