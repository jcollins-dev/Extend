import React from 'react';
import styled from 'styled-components';
import { Typography } from 'components';

interface TabProps {
  selected?: boolean;
  disabled?: boolean;
}

interface Props extends TabProps, React.HTMLAttributes<HTMLButtonElement> {
  children?: string | React.ReactNode;
  count?: number | string;
}

const Container = styled.span<TabProps>`
  display: inline-block;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 0.6875rem;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.mediumBlue4 : theme.colors.lightGrey1};

  border: 1px solid;
  border-radius: 2px;
  border-color: ${({ selected, theme }) => (selected ? theme.colors.mediumBlue : 'transparent')};

  :hover {
    background-color: ${({ theme }) => theme.colors.mediumBlue4};
  }
`;

const Count = styled.span`
  color: ${({ theme }) => theme.colors.negativeRed};
  margin-left: 0.5rem;
`;

const Pill = ({ children, count, selected, disabled, ...rest }: Props): JSX.Element => (
  <Container as="button" role="button" selected={selected} disabled={disabled} {...rest}>
    <Typography as="span" mb={0} color={disabled ? 'mediumGrey1' : 'darkGrey'} size="0.8125rem">
      {children}
      {count !== undefined && count !== null && <Count>({count})</Count>}
    </Typography>
  </Container>
);

export default Pill;
