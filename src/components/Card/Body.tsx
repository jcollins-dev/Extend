// 3rd party libs
import React from 'react';
import styled from 'styled-components';

interface Props {
  children?: React.ReactNode;
  pb?: string | number;
  pl?: string | number;
  pr?: string | number;
  pt?: string | number;
}

const Container = styled.div<Props>`
  padding: 1.125rem;
  padding-bottom: ${({ pb }) => (pb !== undefined ? pb : '')};
  padding-left: ${({ pl }) => (pl !== undefined ? pl : '')};
  padding-right: ${({ pr }) => (pr !== undefined ? pr: '')};
  padding-top: ${({ pt }) => (pt !== undefined ? pt : '1.125rem')};
`;

const Body = ({ children, pt, pb, pl, pr }: Props): JSX.Element => (
  <Container pt={pt} pb={pb} pl={pl} pr={pr}>
    {children}
  </Container>
);

export default Body;
