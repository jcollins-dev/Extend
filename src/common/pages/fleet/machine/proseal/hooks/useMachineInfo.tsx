import { useGetAccountInfoQuery } from 'api';
import React, { ReactNode, createContext, useContext } from 'react';
import { AccountInfo } from 'types/protein';

export interface UseMachineInfoProps {
  data?: AccountInfo;
  isLoading?: boolean;
}

const DataContext = createContext<UseMachineInfoProps>({
  isLoading: true
});

export const useMachineInfo = (): UseMachineInfoProps => useContext(DataContext);

interface Props extends UseMachineInfoProps {
  children?: ReactNode | ReactNode[];
}

export const UseMachineInfoProvider = ({ children }: Props): JSX.Element => {
  const { data, isLoading } = useGetAccountInfoQuery({
    machineId: '997be3d3-5200-46cb-b9b5-4ff35c0149fe'
  });

  const value = {
    data,
    isLoading
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
