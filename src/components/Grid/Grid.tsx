import React from 'react';
import styled from 'styled-components';

export type GridProps = {
  children?: React.ReactNode;
};

const StyledDiv = styled.div``;
const Grid = ({ children }: GridProps): JSX.Element => {
  return <StyledDiv>{children}</StyledDiv>;
};

export default Grid;
