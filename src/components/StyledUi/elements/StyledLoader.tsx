import React from 'react';
import Loader from 'react-loader-spinner';
import { default as theme } from 'themes';

export const StyledLoader = (): JSX.Element => (
  <Loader type="TailSpin" color={theme.colors.loader.main} height={40} width={40} />
);
