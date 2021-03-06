import styled from 'styled-components';

interface isOnlineProp {
  isOnline: boolean;
}

export const ChatHeaderContainer = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  padding: 10px 20px;
`;
export const PartnerInfo = styled.div`
  display: flex;
  width: 60%;
  height: 100%;
`;

export const PartnerStatusContainer = styled.div<isOnlineProp>`
  margin: auto 20px;
  color: ${props => props.theme.secondaryText};
  h2 {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${props => props.isOnline && props.theme.primaryText};
  }
  p.description {
    font-weight: 400;
    font-size: 0.8rem;
    padding-top: 10px;
  }
`;

export const PartnerStatus = styled.div<isOnlineProp>`
  display: flex;
  p {
    color: ${props => props.isOnline && props.theme.primaryText};
  }
`;

export const StatusIndicator = styled.div<isOnlineProp>`
  width: 10px;
  height: 10px;
  background: ${props =>
    props.isOnline ? `rgb(68, 207, 114)` : props.theme.secondaryText};
  border-radius: 50%;
  margin: 4px;
`;

export const ChatMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
`;

export const ChatMenuIcons = styled.div`
  height: 100%;
  display: flex;
  align-items: flex-start;
  padding-top: 30px;
`;

export const DropdownContents = styled.div`
  display: none;
  position: absolute;
  width: 240px;
  left: -220px;
  ul {
    position: relative;
    background-color: ${props => props.theme.background};
    min-width: 160px;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    z-index: 1;
    border-radius: 3px;
    padding: 20px 10px;
    &:after,
    &:before {
      bottom: 100%;
      right: 10px;
      border: solid transparent;
      content: '  ';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }

    &:after {
      border-color: rgba(255, 255, 255, 0);
      border-bottom-color: ${props => props.theme.background};
      border-width: 5px;
      background-clip: padding-box;
    }

    &:before {
      border-color: rgba(184, 184, 184, 0);
      border-bottom-color: ${props => props.theme.background};
      border-width: 6px;
      background-clip: padding-box;
    }
    li {
      padding: 8px 12px;
      font-size: 0.75rem;
      font-weight: 600;
      color: ${props => props.theme.secondaryText};
      &:hover {
        color: ${props => props.theme.buttonBackgroundA};
        cursor: pointer;
      }
      i {
        padding-right: 10px;
      }
    }
  }
  div {
    height: 20px;
    width: 100%;
    position: relative;
    background: rgba(0, 0, 0, 0);
  }
`;
export const ChatMenuIcon = styled.div`
  width: 16px;
  margin: 0 10px;
  color: ${props => props.theme.secondaryText};
  &:hover {
    color: ${props => props.theme.buttonBackgroundA};
  }
  &:nth-child(4):hover {
    position: relative;
    display: inline-block;
    &:hover ${DropdownContents} {
      display: block;
    }
  }
`;
