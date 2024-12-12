// 3rd party libraries
import React from 'react';
import styled from 'styled-components';
import { default as LoaderBase } from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

interface Props {
  size?: number; // pixels
  margin?: string | number;
}

const Container = styled.div<{ margin?: string | number }>`
  display: flex;
  margin: ${({ margin }) => (margin !== undefined ? margin : '2rem')};
  justify-content: center;
  align-content: center;
`;

export default function Loader({ size = 80, margin }: Props): React.ReactElement {
  return (
    <Container margin={margin}>
      <LoaderBase type="TailSpin" color="#d0d0d0" height={size} width={size} />
    </Container>
  );
}
