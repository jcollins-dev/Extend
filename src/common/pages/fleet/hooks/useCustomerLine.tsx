import React, { ReactNode, createContext, useContext } from 'react';
import { useRouter } from 'common/hooks/useRouter';
import { fleetPagePath } from '../FleetPage';
import { linesData } from './demoData';

export interface UseCustomerLineProps {
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
  id?: string;
  name?: string;
  description?: string;
  machines?: string[];
}

const CustomerLineContext = createContext<UseCustomerLineProps>({
  isLoading: true
});

export const useCustomerLine = (): UseCustomerLineProps => useContext(CustomerLineContext);

interface Props extends UseCustomerLineProps {
  children?: ReactNode | ReactNode[];
}

export const UseCustomerLineProvider = ({ children }: Props): JSX.Element => {
  const { pageSub2, lineId } = useRouter(fleetPagePath);

  if (pageSub2 && !lineId) return <div>line provider 404</div>;

  const customerLine = linesData[lineId as string];

  if (pageSub2 && !customerLine) return <div>Error loading line</div>;

  return (
    <CustomerLineContext.Provider value={customerLine as UseCustomerLineProps}>
      {children}
    </CustomerLineContext.Provider>
  );
};
