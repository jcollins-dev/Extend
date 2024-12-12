import React, { ReactNode, createContext, useContext } from 'react';
import { useRouter } from 'common/hooks/useRouter';
import { fleetPagePath } from '../FleetPage';
import { sitesData } from './demoData';

export interface UseCustomerSiteProps {
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
  id?: string;
  name?: string;
  description?: string;
  timeZone?: string;
  lines?: string[];
}

const CustomerSiteContext = createContext<UseCustomerSiteProps>({
  isLoading: true
});

export const useCustomerSite = (): UseCustomerSiteProps => useContext(CustomerSiteContext);

interface Props extends UseCustomerSiteProps {
  children?: ReactNode | ReactNode[];
}

export const UseCustomerSiteProvider = ({ children }: Props): JSX.Element => {
  const { pageSub1, siteId } = useRouter(fleetPagePath);

  if (pageSub1 !== 'dashboard' && !siteId) return <div>site provider 404</div>;

  const customerSite = sitesData[siteId as string];

  if (siteId && pageSub1 && !customerSite) return <div>Error loading site</div>;

  return (
    <CustomerSiteContext.Provider value={customerSite as UseCustomerSiteProps}>
      {children}
    </CustomerSiteContext.Provider>
  );
};
