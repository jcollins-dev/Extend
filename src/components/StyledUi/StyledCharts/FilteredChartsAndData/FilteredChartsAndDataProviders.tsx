import React, { ReactNode } from 'react';
import { FilterSelectedProvider } from 'components/StyledUi/FilterSelected';
import { DataProvider, DataProviderProps } from '../_hooks';

interface Props extends DataProviderProps {
  children?: ReactNode | ReactNode[];
}

export const FilteredChartsAndDataProviders = ({
  children,
  data,
  isLoading,
  hasError,
  hasMessage
}: Props): JSX.Element => {
  return (
    <DataProvider {...{ data, isLoading, hasError, hasMessage }}>
      <FilterSelectedProvider>{children}</FilterSelectedProvider>
    </DataProvider>
  );
};
