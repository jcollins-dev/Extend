import React, { ReactNode, createContext, useContext } from 'react';
import { useRouter } from 'common/hooks/useRouter';
import { fleetPagePath } from '../FleetPage';
import { machinesData } from './demoData';

export interface UseCustomerMachineProps {
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
  id?: string;
  name?: string;
  description?: string;
  connectionStatus?: string;
  productionStatus?: string;
  serialNumber?: string;
  orderNumber?: string;
}

const CustomerMachineContext = createContext<UseCustomerMachineProps>({
  isLoading: true
});

export const useCustomerMachine = (): UseCustomerMachineProps => useContext(CustomerMachineContext);

interface Props extends UseCustomerMachineProps {
  children?: ReactNode | ReactNode[];
}

export const UseCustomerMachineProvider = ({ children }: Props): JSX.Element => {
  const { pageSub3, machineId } = useRouter(fleetPagePath);

  if (pageSub3 && !machineId) return <div>machine provider 404</div>;

  const customerMachine = machinesData[machineId as string];

  if (pageSub3 && !customerMachine) return <div>Error loading machine</div>;

  return (
    <CustomerMachineContext.Provider value={customerMachine as UseCustomerMachineProps}>
      {children}
    </CustomerMachineContext.Provider>
  );
};
