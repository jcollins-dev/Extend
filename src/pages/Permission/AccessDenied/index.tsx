// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import theme from 'themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAuth, useAuthB2C } from 'hooks';
import { Button, Typography } from 'components';
const b2cflag: boolean = process.env.REACT_APP_ENABLE_B2C == 'true';

// Styling
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.lightGrey1};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
`;

const CardContainer = styled.div`
  position: absolute;
  width: 28.75rem;
  height: 12.5rem;
  background-color: ${theme.colors.background.background1};
  border-radius: 0.625rem;
  top: 50%;
  margin-top: 20%;
`;

const InnerContent = styled.div`
  padding: 1.75rem;
`;

const StyledButton = styled(Button)`
  margin: auto;
  width: 15%;
`;

const AccessDenied = (): JSX.Element => {
  const auth = useAuth();
  const authB2C = useAuthB2C();

  const handleLogout = () => {
    b2cflag ? authB2C.signout() : auth.signout();
  };
  return (
    <>
      <Container>
        <CardContainer>
          <InnerContent>
            <Typography weight="semi-bold" size="1rem">
              <FontAwesomeIcon icon={faKey} /> Access Denied
            </Typography>
            <Typography size="0.875rem" color={theme.colors.darkGrey}>
              We have received your request. We will reach out to your company administrator for
              approval.
            </Typography>
            <StyledButton
              variant="primary"
              size="small"
              width="4rem"
              onClick={() => {
                handleLogout();
              }}
            >
              OK
            </StyledButton>
          </InnerContent>
        </CardContainer>
      </Container>
    </>
  );
};

export default AccessDenied;
