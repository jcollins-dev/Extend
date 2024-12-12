// 3rd party
import React, { ReactElement } from 'react';
import styled from 'styled-components';

// Providers
import { useUser } from 'selectors';

// Theme
import { default as theme } from 'themes';

// Styling
const Root = styled.div`
  display: flex;
  flex-direction: row;
  //width: 11.875rem;
  height: 3.4375rem;
  padding: 0.375rem 0.5625rem;
  border-top: ${theme.colors.borders.nav.border};
  align-items: center;
`;

const UserImageContainer = styled.div`
  border: 0.125rem solid #e5e9ed;
  border-radius: 0.75rem;

  img {
    width: 2.4375rem;
    height: 2.226rem;
    border-radius: 0.75rem;
  }
`;

const UserNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.375rem 0.5625rem;
  font-size: 0.875rem;
  line-height: 1rem;
  color: black;
`;

interface Props {
  toggleContent?: boolean;
}

const SidenavUser = ({ toggleContent }: Props): ReactElement => {
  const user = useUser();

  return (
    <Root>
      <UserImageContainer>
        <img src={theme.logoSmall} alt="User Image" />
      </UserImageContainer>
      {!toggleContent ? (
        <UserNameContainer>
          {user?.firstName} {user?.lastName}
        </UserNameContainer>
      ) : (
        ''
      )}
    </Root>
  );
};

export default SidenavUser;
