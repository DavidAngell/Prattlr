import useUnprivilegedSocket from "@hooks/useUnprivilegedSocket"
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import styles from "./Chat.module.css";
import { Message, User } from "../types";
import { useEffect, useState } from "react";
import useSignedIn from "@hooks/useSignedIn";
import SignInButton from "./SignInButton";

const loadingMessage: Message = {
	user: {
		id: "loading",
		name: "",
	} as User,
	content: "Loading...",
	timestamp: "Loading..."
}

interface ChatBlockProps {
	hideTabs?: true;
	forceScroll?: boolean;
}

enum ChatTab {
	All,
	Prattlr,
	Twitch,
	YouTube,
}

export default function Chat({ hideTabs, forceScroll }: ChatBlockProps) {
	const { 
		messages, 
		isLoading,
		twitchMessages,
		youtubeMessages,
		prattlrMessages,
	} = useUnprivilegedSocket();

	const [tab, setTab] = useState(ChatTab.All);
	const { user, loggedIn } = useSignedIn();

	return <>
		{
			!hideTabs && 
			<div className={styles["chat-tabs"]}>
				<div 
					className={`${styles["chat-tab"]} ${(tab === ChatTab.All) ? styles["chat-tab-focused"] : ""}`} 
					onClick={() => setTab(ChatTab.All)}>
					All
				</div>
				<div
					className={`${styles["chat-tab"]} ${(tab === ChatTab.Prattlr) ? styles["chat-tab-focused"] : ""}`}
					onClick={() => setTab(ChatTab.Prattlr)}>
					Prattlr
				</div>
				<div
					className={`${styles["chat-tab"]} ${(tab === ChatTab.Twitch) ? styles["chat-tab-focused"] : ""}`}
					onClick={() => setTab(ChatTab.Twitch)}>
					Twitch
				</div>
				<div
					className={`${styles["chat-tab"]} ${(tab === ChatTab.YouTube) ? styles["chat-tab-focused"] : ""}`}
					onClick={() => setTab(ChatTab.YouTube)}>
					YouTube
				</div>
				<SignInButton />
			</div>
		}
		<div className={styles["chat"]}>
			{
				(isLoading) 
					? <MessageList messages={[loadingMessage]} />
					: <MessageList forceScroll={forceScroll} messages={
							(() => {
								switch (tab) {
									case ChatTab.All:
										return messages;
									case ChatTab.Prattlr:
										return prattlrMessages;
									case ChatTab.Twitch:
										return twitchMessages;
									case ChatTab.YouTube:
										return youtubeMessages;
								}
							})()
					} />
			}

			{
				(loggedIn) && <ChatInput user={user} /> 
			}
		</div>
	</>
}