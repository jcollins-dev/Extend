import React, { ReactNode, createContext, useContext } from 'react';

export interface DataProviderProps {
  data?: Record<string, unknown>[];
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
}

const DataContext = createContext<DataProviderProps>({
  isLoading: true
});

export const useData = (): DataProviderProps => useContext(DataContext);

interface Props extends DataProviderProps {
  children?: ReactNode | ReactNode[];
}

export const DataProvider = ({
  children,
  data,
  isLoading,
  hasMessage,
  ...rest
}: Props): JSX.Element => {
  if (!isLoading && data && data?.length < 1) hasMessage = `no data within range`;

  return (
    <DataContext.Provider value={{ data, hasMessage, isLoading, ...rest }}>
      {children}
    </DataContext.Provider>
  );
};
