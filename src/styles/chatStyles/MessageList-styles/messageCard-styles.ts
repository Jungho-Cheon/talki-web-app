import styled from 'styled-components';

interface messageProps {
  unread: boolean;
  isSelected: boolean;
}

export const MessageCardAvatar = styled.div`
  margin: 20px;
`;
export const MessagePreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
export const MessageUser = styled.div`
  color: ${props => props.theme.primaryText};
  font-weight: 600;
  margin-bottom: 5px;
`;
export const MessagePreview = styled.div`
  font-weight: 400;
  font-size: 0.8rem;
  word-break: break-all;
  white-space: initial;
  color: ${props => props.theme.secondaryText};
`;
export const MessageInfoContainer = styled.div`
  width: 65px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 15px 0 5px;
`;
export const TimeAgo = styled.div`
  font-weight: 400;
  font-size: 0.68rem;
  padding-bottom: 5px;
  color: ${props => props.theme.secondaryText};
`;
interface UnreadCountProps {
  isUnread: boolean;
}
export const UnreadCount = styled.div<UnreadCountProps>`
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props =>
    props.isUnread ? props.theme.notification : `transparent`};
  color: white;
  font-weight: 400;
  font-size: 0.68rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MessageCardContainer = styled.div<messageProps>`
  position: relative;
  width: 100%;
  height: 70px;
  background: ${props => props.theme.containerBackground};
  margin-bottom: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border-left: ${props =>
    props.isSelected ? `5px solid ${props.theme.buttonBackgroundA}` : ``};
  cursor: pointer;
  transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  &:hover {
    transform: scale(1.02);
    background-color: ${props => props.theme.buttonHoveredA};
    /* ${MessageUser}, ${MessagePreview}, ${TimeAgo} {
      color: ${props => props.theme.containerBackground};
    } */
  }
`;
