import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useGetAccountInfoQuery } from 'api';
import { AccountInfo, PowerBiItem } from 'types/protein';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { reportActions } from 'actions';
import { useTimeZone } from 'providers';
import { avureCustomerTimeZones } from './avureCustomerTimeZones';

const FleetMachineAccountDataContext = createContext<FleetMachineAccountDataContextReturnProps>({
  accountData: undefined,
  reportsIds: {},
  powerBiList: []
});

export const useFleetMachineAccountData = (): FleetMachineAccountDataContextReturnProps => {
  return useContext(FleetMachineAccountDataContext);
};

interface Props {
  children?: ReactNode | ReactNode[];
}

export interface FleetMachineAccountDataContextReturnProps {
  accountData?: AccountInfo;
  isLoading?: boolean;
  hasError?: string;
  curCustomer?: Record<string, boolean> | undefined;
  machineId?: string;
  reportsIds?: {
    machineId?: string;
    workspaceId?: string;
    reportId?: string;
  };
  powerBiList?: PowerBiItem[];
  timeZone?: string;
  hasSkids?: number[];
}

export const FleetMachineAccountDataProvider = ({ children }: Props): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  const { data: accountData, isLoading, isError } = useGetAccountInfoQuery({ machineId });
  const { timeZone } = useTimeZone();

  let autoTz = timeZone;

  const companyName: string | undefined = (accountData?.companyName as string) || undefined;

  if (!timeZone && companyName && avureCustomerTimeZones[companyName as string])
    autoTz = avureCustomerTimeZones[companyName as string];

  const dispatch = useDispatch();

  const value: FleetMachineAccountDataContextReturnProps = {
    accountData,
    isLoading,
    hasError: isError ? 'error getting account info' : undefined,
    curCustomer: companyName?.includes('PASCAL')
      ? { isPascal: true }
      : { [`is${companyName}`]: true },
    machineId,
    reportsIds: {
      reportId: accountData?.reportId,
      workspaceId: accountData?.workspaceId
    },
    powerBiList: accountData?.powerBiList,
    timeZone: autoTz,
    hasSkids: [1]
  };

  if (companyName?.includes('pascal')) value.timeZone = `Europe/Amsterdam`;

  useEffect(() => {
    if (accountData?.reportId && accountData?.workspaceId) {
      dispatch({ type: reportActions.SHOW_REPORT, machineId: machineId });
    } else {
      dispatch({ type: reportActions.HIDE_REPORT, machineId: machineId });
    }
  }, [accountData]);

  return (
    <FleetMachineAccountDataContext.Provider {...{ value }}>
      {children}
    </FleetMachineAccountDataContext.Provider>
  );
};
