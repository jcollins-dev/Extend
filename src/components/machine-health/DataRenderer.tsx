// 3rd party libs
import React from 'react';
import styled from 'styled-components';

// Components
import { Loader, Typography } from 'components';

type Props = {
  error?: string;
  isLoading: boolean;
  children?: React.ReactNode;
  width?: string | number;
  loaderMargin?: string | number;
};

const Container = styled.div<{ width?: string | number }>`
  width: ${({ width }) => (width !== undefined ? width : '100%')};
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/**
 * Simple helper component to display a loading spinner while data is loading,
 * or an error message if there is one present.
 */
export const DataRenderer = ({
  children,
  isLoading,
  error,
  width,
  loaderMargin = 0
}: Props): JSX.Element => {
  return (
    <>
      {isLoading ? (
        <Container width={width}>
          <Loader size={40} margin={loaderMargin} />
        </Container>
      ) : error ? (
        <Container width={width}>
          <Typography color="negativeRed">{error}</Typography>
        </Container>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default DataRenderer;
