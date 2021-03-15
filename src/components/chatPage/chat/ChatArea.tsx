import React, { useEffect, useRef } from 'react';

// redux
import { useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { chatdataSelector } from '../../../features/chatData/chatDataSlice';

// components
import ChatMessage from './ChatMessage';

// styled-components
import {
  ChatPaneContainer,
  ChatPaneWrapper,
} from '../../../styles/chatStyles/chatArea-styles';

const ChatArea = (): JSX.Element => {
  const chatData = useSelector(chatdataSelector);
  const chatPaneContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll to bottom
    if (chatPaneContainer.current !== null)
      chatPaneContainer.current.scrollTop =
        chatPaneContainer.current.scrollHeight;
  }, [chatData]);

  const createChatMessage = () => {
    const { chatdata, participants } = chatData.data[
      chatData.currentChatRoomId as string
    ];
    return chatdata.map(message => (
      <ChatMessage
        chatData={message}
        participants={participants}
        key={nanoid()}
      />
    ));
  };
  return (
    <ChatPaneContainer ref={chatPaneContainer}>
      <ChatPaneWrapper>{createChatMessage()}</ChatPaneWrapper>
    </ChatPaneContainer>
  );
};

export default React.memo(ChatArea);