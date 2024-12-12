import { Typography } from 'components';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const ButtonBarContainer = styled.div<{ columnGap?: string; padding: string }>`
  align-items: center;
  background-color: ${(props) => props.theme.colors.white};
  width: 100%;
  height: 5.25rem;
  padding: ${({ padding }) => padding};
  display: flex;
  column-gap: ${({ columnGap }) => columnGap || '0.625rem'};
`;

const ButtonBarSpacer = styled.div`
  flex-grow: 1;
`;

interface ButtonBarProps {
  columnGap?: string;
  title: string;
  children?: ReactNode;
  padding?: string;
}

const ButtonBar = ({
  columnGap,
  title,
  children,
  padding = '1.375rem 1.25rem'
}: ButtonBarProps): JSX.Element => {
  return (
    <ButtonBarContainer columnGap={columnGap} padding={padding}>
      <Typography variant="h2">{title}</Typography>
      <ButtonBarSpacer />
      {children}
    </ButtonBarContainer>
  );
};

export default ButtonBar;
