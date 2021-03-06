import styled from 'styled-components';

export const ChatAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px 0;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  background-color: ${props => props.theme.containerBackground};
`;
export const ChatPaneContainer = styled.div`
  width: 100%;
  height: 0;
  flex: 1 1 auto;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: ${props => props.theme.secondaryText};
      border-radius: 50px;
    }
  }
  div.ChatPane__typing {
    position: absolute;
    bottom: 20px;
    left: 100px;

    p {
      color: red;
    }
  }
  div.wrapper {
    div.chatmessage__start {
      h1 {
        font-size: 0.8rem;
        color: ${props => props.theme.secondaryText};
      }
    }
  }
`;

interface ChatMessageContainerProps {
  isNextDay: boolean;
}
export const ChatMessageContainer = styled.div<ChatMessageContainerProps>`
  position: relative;
  ${props => props.isNextDay && `margin-top: 20px;`}
  .message__dateDivider {
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: -20px;
    .message__dateDivider__line {
      z-index: 0;
      position: absolute;
      padding: 0 60px;
      width: 20%;
      height: 1px;
      background-color: ${props => props.theme.divider};
    }
    .message__dateDivider__date {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 30px;
      z-index: 1;
      font-size: 0.8rem;
      color: ${props => props.theme.secondaryText};
      background-color: ${props => props.theme.containerBackground};
    }
  }
`;
export const ChatPaneNewMessageContainer = styled.div`
  position: absolute;
  z-index: 200;
  bottom: 118px;
  left: 50%;
  transform: translateX(-50%);
  height: 33px;
  width: 200px;
  text-align: center;
  border-radius: 20px;
  background-color: ${props => props.theme.buttonBackgroundA};
  color: white;
  font-size: 0.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  i {
    padding-top: 2px;
    padding-right: 7px;
  }
  &:hover {
    background-color: ${props => props.theme.buttonHoveredA};
  }
  &:active {
    background-color: ${props => props.theme.buttonActiveA};
  }
`;

export const ChatPaneAddFileModelContainer = styled.section`
  position: absolute;
  z-index: 200;
  bottom: 40%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img.ChatPane__AddFile {
    z-index: 200;
    width: 100px;
    height: 100px;
  }
`;

export const ChatPaneClickedIamge = styled.img`
  z-index: 500;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  max-height: 60%;
  object-fit: contain;
`;
