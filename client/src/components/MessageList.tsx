import Message from "./Message";
import { Message as MessageType } from "../types";
import useChatScroll from "@hooks/useChatScroll";
import styles from "./MessageList.module.css";
import { useEffect, useState } from "react";
import { MenuItem, useMenuState, ControlledMenu } from '@szhsin/react-menu';

interface MessageListProps {
  messages: MessageType[];
  showTimestamps?: false;
  forceScroll?: boolean;
}

export default function MessageList({ messages, showTimestamps, forceScroll }: MessageListProps) {
  const ref = useChatScroll(messages);
  const [menuProps, toggleMenu] = useMenuState();
	const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  
  return <>
    <div ref={(forceScroll) ? ref : null} className={styles["message-list"]}>
      {
        messages.map((message, index) => {
          return <Message 
              key={index} 
              message={message} 
              setAnchorPoint={setAnchorPoint}
              toggleMenu={toggleMenu}
            />
        })
      }
      <div id={styles["anchor"]}></div>
      <ControlledMenu {...menuProps} anchorPoint={anchorPoint}
					direction="right" onClose={() => toggleMenu(false)}
			>
					<MenuItem>Cut</MenuItem>
					<MenuItem>Copy</MenuItem>
					<MenuItem>Paste</MenuItem>
			</ControlledMenu>
    </div>
  </>
}