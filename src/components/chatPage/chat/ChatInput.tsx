import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// emoji
import EmojiPicker, { IEmojiData } from 'emoji-picker-react';

// styled components
import {
  ChatInputContainer,
  UploadFileButton,
  ChatTextInput,
  EmojiButton,
  EmojiPickerWrapper,
  EmojiPickerContainer,
  ChatSendButton,
} from '../../../styles/chatStyles/chatInput-styles';

// redux
import { getUserData, getAccessToken } from '../../../features/auth/authSlice';
import {
  getCurrentChatroomId,
  sendMessage,
} from '../../../features/chatroom/chatroomSlice';
import { nanoid } from '@reduxjs/toolkit';

// socket
import socket from '../../../socket/socket';

// client
import chatClient from '../../../client/chatClient';

// types
import { UrlData } from '../../../features/chatroom/chatroomTypes';

const ChatInput = (): JSX.Element => {
  const dispatch = useDispatch();
  const fileInput = useRef<HTMLInputElement>(null);
  const { email, friendData } = useSelector(getUserData);
  const currentChatroomId = useSelector(getCurrentChatroomId);
  const accessToken = useSelector(getAccessToken);
  const [isEmojiOpened, setIsEmojiOpened] = useState(false);
  const [text, setText] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const textInput = useRef<HTMLInputElement>(null);

  const emojiClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    emojiObject: IEmojiData
  ): void => {
    event.preventDefault();
    setText(text => text + emojiObject.emoji);
  };
  const textChange: React.ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setText(event.target.value);
    if (currentChatroomId && socket.connected) {
      if (!isTyping) {
        socket.emit(
          'CHAT_TYPING',
          JSON.stringify({
            chatroomId: currentChatroomId,
            email,
          })
        );
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
      if (event.target.value === '') {
        setIsTyping(false);
        socket.emit(
          'CHAT_TYPING',
          JSON.stringify({
            chatroomId: currentChatroomId,
            email: '',
          })
        );
      }
    }
  };
  const handleEnterKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      sendMessageHandler();
    }
  };

  const checkMessageType = (text: string) => {
    try {
      new URL(text);
    } catch (err) {
      return 'TEXT';
    }
    return 'URL';
  };

  const sendMessageHandler = async () => {
    if (text.trim() !== '' && currentChatroomId && socket.connected) {
      const messageType = checkMessageType(text);
      const messageId = 'tmp_' + nanoid(); // ?????? ????????? ?????????
      const payload: {
        chatroomId: string;
        email: string;
        message: {
          message: string;
          messageId: string;
          messageType: string;
          urlData?: UrlData;
        };
      } = {
        chatroomId: currentChatroomId,
        email,
        message: {
          message: text,
          messageId,
          messageType,
        },
      };
      const statePayload = {
        ...payload,
        message: {
          ...payload.message,
          readUsers: [email],
          isComplete: false,
        },
      };
      if (messageType === 'URL') {
        const urlData = await chatClient.getLinkPreview(text, accessToken, dispatch);
        if (urlData.hasOwnProperty('message')) {
          payload.message.messageType = 'TEXT';
          statePayload.message.messageType = 'TEXT';
        } else {
          payload.message.urlData = urlData;
          statePayload.message.urlData = urlData;
        }
      }
      // ?????? ???????????? ????????? ??????
      dispatch(sendMessage(statePayload));
      // ?????? ???????????? ??????????????? ????????????????????? ?????? ?????? ??????
      socket.emit('SEND_MESSAGE', JSON.stringify(payload));
      socket.emit(
        'CHAT_TYPING',
        JSON.stringify({
          chatroomId: currentChatroomId,
          email: '',
        })
      );
      setText('');
    }
  };
  const handleFile = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        if (file.size > 5 * 2 ** 20) {
          alert('5MB ????????? ????????? ????????? ??? ????????????.. ????');
          return;
        }
        // ?????? ?????????
        const chatroomId = currentChatroomId;
        const response = await chatClient.uploadFile(
          chatroomId,
          file,
          accessToken,
          dispatch
        );
        const messageId = 'tmp_' + nanoid();
        // ????????? ????????? ??????
        if (file.type.startsWith('image')) {
          dispatch(
            sendMessage({
              chatroomId,
              email,
              message: {
                messageId,
                message: '',
                fileUrl: response.fileUrl,
                messageType: 'IMAGE',
                readUsers: [email],
                // isComplete: false,
              },
            })
          );
          socket.emit(
            'SEND_MESSAGE',
            JSON.stringify({
              chatroomId,
              email,
              message: {
                messageId,
                message: file.name,
                fileUrl: response.fileUrl,
                messageType: 'IMAGE',
              },
            })
          );
        } else {
          // ?????? ????????? ?????? ????????? ??????
          dispatch(
            sendMessage({
              chatroomId,
              email,
              message: {
                messageId,
                message: file.name,
                fileUrl: response.fileUrl,
                messageType: 'FILE',
                readUsers: [email],
                // isComplete: false,
              },
            })
          );
          socket.emit(
            'SEND_MESSAGE',
            JSON.stringify({
              chatroomId,
              email,
              message: {
                messageId,
                message: file.name,
                fileUrl: response.fileUrl,
                messageType: 'FILE',
              },
            })
          );
        }
      }
    }
  };
  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const files = e.target.files;
    if (files) handleFile(files);
  };
  useEffect(() => {
    const chatTypingHandler = async (data: any) => {
      const { chatroomId, email } = JSON.parse(data);
      if (currentChatroomId === chatroomId) {
        if (email) setNickname(friendData[email].nickname);
        else setNickname('');
      }
    };
    socket.on('CHAT_TYPING', chatTypingHandler);
    return () => {
      socket.off('CHAT_TYPING', chatTypingHandler);
    };
  }, []);

  return (
    <ChatInputContainer>
      {nickname && (
        <div className="ChatInput__Typing">
          <div className="wave">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>

          <p>
            <span>{nickname}?????? ??????????????????.</span>
          </p>
        </div>
      )}
      <UploadFileButton onClick={() => fileInput.current?.click()}>
        <i className="fas fa-paperclip"></i>
        <input
          ref={fileInput}
          className="fileSelector"
          type="file"
          style={{ display: `none` }}
          onChange={inputHandler}
        />
      </UploadFileButton>
      <ChatTextInput
        placeholder="Write your message"
        ref={textInput}
        type="text"
        value={text}
        onChange={textChange}
        onKeyPress={handleEnterKeyPress}
      />

      <EmojiButton onClick={() => setIsEmojiOpened(!isEmojiOpened)}>
        <i className="far fa-smile"></i>
      </EmojiButton>
      <EmojiPickerWrapper
        style={{ display: isEmojiOpened ? `block` : `none` }}
        onClick={event => {
          event.preventDefault();
          setIsEmojiOpened(!isEmojiOpened);
        }}
      ></EmojiPickerWrapper>
      <EmojiPickerContainer
        style={{ display: isEmojiOpened ? `block` : `none` }}
        onClick={e => e.stopPropagation()}
      >
        <EmojiPicker onEmojiClick={emojiClick} disableSkinTonePicker={true} />
      </EmojiPickerContainer>
      <ChatSendButton onClick={sendMessageHandler}>
        <i className="fas fa-paper-plane"></i>
      </ChatSendButton>
    </ChatInputContainer>
  );
};

export default React.memo(ChatInput);
