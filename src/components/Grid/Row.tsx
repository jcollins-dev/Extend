import React from 'react';
import styled from 'styled-components';

interface RowProps {
  children?: React.ReactNode;
  marginBottom?: string;
}

const StyledDiv = styled.div<{ marginBottom: string }>`
  display: flex;
  grid-gap: 1.25rem;
  flex-wrap: wrap;
  margin-bottom: ${({ marginBottom }) => marginBottom};
`;
const Row = ({ children, marginBottom = '1.25rem' }: RowProps): JSX.Element => {
  return <StyledDiv marginBottom={marginBottom}>{children}</StyledDiv>;
};

export default Row;
