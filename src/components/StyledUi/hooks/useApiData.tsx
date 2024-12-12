import React, { ReactNode, createContext, useContext } from 'react';

export interface UseApiDataProps {
  data?: Record<string, unknown>[];
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
}

const DataContext = createContext<UseApiDataProps>({
  isLoading: true
});

export const useApiData = (): UseApiDataProps => useContext(DataContext);

interface Props extends UseApiDataProps {
  children?: ReactNode | ReactNode[];
}

export const UseApiDataProvider = ({
  children,
  data,
  isLoading,
  hasMessage,
  hasError
}: Props): JSX.Element => {
  return (
    <DataContext.Provider value={{ data, hasMessage, isLoading, hasError }}>
      {children}
    </DataContext.Provider>
  );
};
