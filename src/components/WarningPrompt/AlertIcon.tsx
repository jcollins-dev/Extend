// 3rd party libs
import React from 'react';
import styled, { css, keyframes, useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle as faCircleOutline } from '@fortawesome/free-regular-svg-icons';

const StyledLayeredIconContainer = styled.div`
  height: 1.125rem;
  position: relative;
  width: 1.125rem;
`;

const pulseAnimation = (opacity?: string) => keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: ${opacity || '0.5'};
  }
  100% {
    opacity: 0;
  }
`;

const animationHelper = (opacity?: string) => css`
  ${pulseAnimation(opacity)} 3s ease-in-out infinite;
`;

const StyledIconWrapper = styled.div<{ animation?: boolean; opacity?: string }>`
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);

  animation: ${({ animation, opacity }) => (animation ? animationHelper(opacity) : 'none')};
`;

const AlertIcon = (): JSX.Element => {
  const theme = useTheme();

  return (
    <StyledLayeredIconContainer>
      <StyledIconWrapper>
        <FontAwesomeIcon
          color={theme.colors.buttons.danger.fill}
          fontSize="0.75rem"
          icon={faExclamation}
        />
      </StyledIconWrapper>
      <StyledIconWrapper>
        <FontAwesomeIcon
          color={theme.colors.buttons.danger.fill}
          fontSize="1.25rem"
          icon={faCircleOutline}
        />
      </StyledIconWrapper>
      <StyledIconWrapper animation opacity="0.2">
        <FontAwesomeIcon color={theme.colors.buttons.danger.fill} fontSize="2rem" icon={faCircle} />
      </StyledIconWrapper>
      <StyledIconWrapper animation opacity="0.1">
        <FontAwesomeIcon
          color={theme.colors.buttons.danger.fill}
          fontSize="2.75rem"
          icon={faCircle}
        />
      </StyledIconWrapper>
    </StyledLayeredIconContainer>
  );
};

export default AlertIcon;
