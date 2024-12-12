import React from 'react';
import styled from 'styled-components';
import { Typography } from 'components';
import { TabShape } from 'types';
import theme from 'themes';

interface BaseTab {
  active?: boolean;
  rounded?: boolean;
}

interface Props extends BaseTab {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  controls: string;
  type?: TabShape;
}

const StyledTab = styled.div<BaseTab>`
  background-color: ${({ theme, active }) =>
    active ? theme.colors.mediumBlue : theme.colors.lightGrey1};
  transition: background-color 0.2s;
  padding: 0.5rem 1rem;
  border-radius: ${({ rounded }) => (rounded ? '999px' : '2px')};
  cursor: pointer;
`;

const StyledSquareTab = styled.div<BaseTab>`
  background-color: ${({ theme, active }) => (active ? theme.colors.mediumBlue4 : 'transparent')};
  transition: background-color 0.2s;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  box-shadow: ${({ theme, active }) =>
    active
      ? `inset 0 -0.0625rem 0 ${theme.colors.mediumBlue}`
      : `inset 0 -0.0625rem 0 ${theme.colors.lightGrey4}`};
`;

const Tab = ({ children, onClick, active, controls, type, rounded }: Props): JSX.Element => {
  const inActiveColor = rounded ? theme.colors.mediumGrey1 : theme.colors.black;
  return type === TabShape.SQUARE ? (
    <StyledSquareTab onClick={onClick} role="tab" aria-controls={controls} active={active}>
      <Typography
        weight="bold"
        mb="0"
        color={active ? 'mediumBlue' : 'darkGrey'}
        as="span"
        size="0.875rem"
      >
        {children}
      </Typography>
    </StyledSquareTab>
  ) : (
    <StyledTab
      onClick={onClick}
      role="tab"
      aria-controls={controls}
      active={active}
      rounded={rounded}
    >
      <Typography
        weight={rounded ? 'bold' : 'normal'}
        mb="0"
        color={active ? 'white' : inActiveColor}
        as="span"
        size="0.875rem"
      >
        {children}
      </Typography>
    </StyledTab>
  );
};

export default Tab;
