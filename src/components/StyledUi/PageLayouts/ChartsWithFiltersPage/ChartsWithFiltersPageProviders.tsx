import React, { ReactNode } from 'react';
import { FilterSelectedProvider } from 'components/StyledUi/FilterSelected';
import { SettingsProvider, DataProvider } from './hooks';
import { ChartsWithFiltersPageProps } from './ChartsWithFiltersPage';

interface Props extends ChartsWithFiltersPageProps {
  children?: ReactNode | ReactNode[];
}

export const ChartsWithFiltersPageProviders = ({
  children,
  data,
  isLoading,
  hasError,
  hasMessage,
  ...settings
}: Props): JSX.Element => {
  return (
    <SettingsProvider {...settings}>
      <DataProvider {...{ data, isLoading, hasError, hasMessage }}>
        <FilterSelectedProvider>{children}</FilterSelectedProvider>
      </DataProvider>
    </SettingsProvider>
  );
};
