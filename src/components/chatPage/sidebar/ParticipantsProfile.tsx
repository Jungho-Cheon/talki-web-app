import React, { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserData } from '../../../features/auth/authSlice';
import { FriendData } from '../../../features/auth/authTypes';
import { getCurrentChatroom } from '../../../features/chatroom/chatroomSlice';

// components
import UserRectAvatar from '../avatar/UserRectAvatar';

// styled-components
import {
  ParticipantsProfileContainer,
  PartnerStatus,
  StatusIndicator,
} from '../../../styles/chatStyles/sidebarStyles/participantsProfile-styles';

const ParticipantsProfile = (): JSX.Element => {
  const { chatroomId, participants } = useSelector(getCurrentChatroom);
  const { email, friendData } = useSelector(getUserData);
  const [opponent, setOpponent] = useState<FriendData>();
  const [online, setOnline] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (chatroomId === '') return;
    const opponentEmail = participants.find(pEmail => pEmail !== email);
    if (opponentEmail) {
      const targetUserData = friendData[opponentEmail];
      setOnline(targetUserData.isLoggin);
      setOpponent(targetUserData);
    }
  }, [friendData, participants]);
  return (
    <ParticipantsProfileContainer>
      {chatroomId && (
        <>
          <div className="participants-profile__profile-picture">
            <img
              className="profile__background"
              src="assets/default-background.jpeg"
            />
            <div className="profile__profile-picture-background">
              <UserRectAvatar
                avatarUrl={opponent?.avatarUrl || ''}
                width="120px"
              />
              {/* <img
                className="profile__profile-picture"
                src={opponent?.avatarUrl || ''}
                alt="participants-profile-picture"
              /> */}
            </div>
            <PartnerStatus isOnline={online}>
              <StatusIndicator isOnline={online} />
              <p>{online ? `Online` : `Offline`}</p>
            </PartnerStatus>
          </div>
          <div className="participants-profile__profile-info">
            <h2>{opponent?.nickname}</h2>
            <h3>Email</h3>
            <p>{opponent?.email}</p>
            <h3>Description</h3>
            <p>{opponent?.description}</p>
          </div>
        </>
      )}
    </ParticipantsProfileContainer>
  );
};

export default ParticipantsProfile;
