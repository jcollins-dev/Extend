import React from 'react';
import {
  AlertsWelcomeMsgContainer,
  StyledButton,
  AlertBoardIcon,
  ImageWrapper
} from './AlertCreatorStyledComponents';
import { Typography } from 'components';
import theme from 'themes';
import { JBTRoutes } from 'constants/routes';
import { useHistory } from 'react-router-dom';

export const AlertCreator = (): JSX.Element => {
  const history = useHistory();
  return (
    <AlertsWelcomeMsgContainer>
      <Typography size="2rem" weight="medium" color={theme.colors.primaryBlue5}>
        We are building a new solution for everyone!
      </Typography>
      <ImageWrapper>
        <AlertBoardIcon
          src="/assets/imgs/icons/connecting_tiles_blue.svg"
          alt="tiles logo"
          swidth="4.75rem"
          sheight="4.905rem"
        />
      </ImageWrapper>
      <Typography size="1rem" weight="bold">
        Please stay tuned
      </Typography>
      <StyledButton
        width="9.625"
        height="2rem"
        bgColor={theme.colors.primaryBlue5}
        color={theme.colors.white}
        onClick={() => {
          history.push(JBTRoutes.dashboard);
        }}
      >
        Go back Home
      </StyledButton>
    </AlertsWelcomeMsgContainer>
  );
};
