import React, { ReactNode } from 'react';
import { Types, Styled } from './';
import { default as LoaderBase } from 'react-loader-spinner';

interface Props extends Types.StatusProps {
  children?: ReactNode | ReactNode[];
  useMessage?: boolean;
}

export const Message = ({ hasError }: { hasError?: string }): JSX.Element => {
  return (
    <Styled.MessageContainer hasError={hasError}>
      <Styled.IconHolder>{hasError && <Styled.ErrorIcon />}</Styled.IconHolder>
      <Styled.Label>Error:</Styled.Label>
      <Styled.Message>{hasError || 'there has been an error'}</Styled.Message>
    </Styled.MessageContainer>
  );
};

export const StatusLoader = ({ isLoading, hasError, children, useMessage }: Props): JSX.Element => {
  return (
    <>
      {hasError ? (
        useMessage ? (
          <Message {...{ hasError }} />
        ) : (
          <>
            {hasError || 'unknown error'}
          </>
        )
      ) : isLoading ? (
        <LoaderBase type="TailSpin" color="#d0d0d0" height={40} width={40} />
      ) : (
        children
      )}
    </>
  );
};
