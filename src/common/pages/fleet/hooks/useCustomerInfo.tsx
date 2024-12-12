import React, { ReactNode, createContext, useContext } from 'react';
import { useRouter } from 'common/hooks/useRouter';
import { customerData } from './demoData';
import { fleetPagePath } from '../FleetPage';

export interface UseCustomerInfoProps {
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
  id?: string;
  name?: string;
  sites?: string[];
  bu?: number;
}

const CustomerInfoContext = createContext<UseCustomerInfoProps>({
  isLoading: true
});

export const useCustomerInfo = (): UseCustomerInfoProps => useContext(CustomerInfoContext);

interface Props extends UseCustomerInfoProps {
  children?: ReactNode | ReactNode[];
}

export const UseCustomerInfoProvider = ({ children }: Props): JSX.Element => {
  const { customerId } = useRouter(fleetPagePath);

  const customerInfo = customerData[customerId as string];

  return (
    <CustomerInfoContext.Provider value={customerInfo as UseCustomerInfoProps}>
      {children}
    </CustomerInfoContext.Provider>
  );
};
