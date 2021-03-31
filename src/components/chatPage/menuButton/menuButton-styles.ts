import styled from 'styled-components';

export const MenuButtonContainer = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  i {
    color: ${props => props.theme.primaryText};
    transition: color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  &:hover {
    background-color: ${props => props.theme.containerHovered};
  }
  &:active {
    i {
      color: ${props => props.theme.buttonBackgroundA};
    }
  }
`;
