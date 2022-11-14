import { Message } from "../types";
import styles from "./Message.module.css";
import { useEffect, useState } from "react";
import { MenuItem, useMenuState, ControlledMenu } from '@szhsin/react-menu';

interface MessageProps {
	message: Message;
	showTimestamps?: false;
	setAnchorPoint: (point: { x: number, y: number }) => void;
	toggleMenu: (state: boolean) => void;
}

export default function Message({ message, showTimestamps, setAnchorPoint, toggleMenu }: MessageProps) {
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
		<div 
			className={styles["message"]}
			onContextMenu={e => {
						e.preventDefault();
						setAnchorPoint({ x: e.clientX, y: e.clientY });
						toggleMenu(true);
				}}
			>
			{ message.user.fromPrattlr && <img src="/favicon.svg"></img>}
			{/* { showTimestamps && <div className={styles["timestamp"]}>{message.timestamp}</div> } */}
			<span className={`${styles["message-text"]} ${styles[platformClass]}`}>{message.user.name}:</span>
			<span className={styles["message-text"]}>{message.content}</span>
		</div>
	</>
}