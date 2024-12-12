import React, { ReactNode } from 'react';
import { Types } from '.';
import { StatusLoader } from '../StatusLoader';

interface Props extends Types.Props, Types.RefProps {
  children?: ReactNode | ReactNode[];
  width?: number;
  height?: number;
}

export const WidgetMain = ({
  children,
  Main,
  isLoading,
  hasError,
  Load,
  width,
  height
}: Props): JSX.Element => {
  width = width || 0;
  height = height || 0;

  return (
    <StatusLoader {...{ isLoading, hasError }}>
      {Load ? <Load {...{ width, height }} /> : Main || children}
    </StatusLoader>
  );
};
