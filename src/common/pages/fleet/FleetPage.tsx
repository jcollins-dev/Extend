import React, { ReactNode, useMemo, useEffect } from 'react';
import { FleetMachinePage } from './machine/FleetMachinePage';
import { FleetLinePage } from './line/FleetLinePage';
import { FleetSitePage } from './site/FleetSitePage';
import { FleetDashboardPage } from './dashboard/FleetDashboardPage';
import { FleetPageContainer } from './FleetPage.elements';

import {
  FleetPageHeader,
  FleetPageHeaderBreadcrumbsProvider,
  FleetPageHeaderMachineStatusProvider
} from './components';

import { UseCustomerInfoProvider } from './hooks/useCustomerInfo';
import { UseCustomerSiteProvider } from './hooks/useCustomerSite';
import { UseCustomerLineProvider } from './hooks/useCustomerLine';
import { UseCustomerMachineProvider } from './hooks/useCustomerMachine';

import { useHistory } from 'react-router';
import { useRouter } from 'common/hooks/useRouter';
import { UseMachineInfoProvider } from './machine/proseal/hooks/useMachineInfo';

//-----------------------------------
// NOTES:
// Look into having a customer info provider that has the customer info and the account info
// and timezone
//-----------------------------------
type FleetPagePropsViews = 'site' | 'line' | 'machine' | 'not-found' | 'dashboard';

interface PageWrapperProps {
  children: ReactNode | ReactNode[];
  // view shouuld be removed when routing is put in place
  view: FleetPagePropsViews;
}

const PageWrapper = ({ children, view }: PageWrapperProps) => {
  // add appropriate class name for styling
  const className = view ? `fleet-page fleet-page--${view}` : `fleet-page`;

  // we add all the providers here so that we can have access to the customer info including BU
  return (
    <UseCustomerInfoProvider>
      <UseMachineInfoProvider>
        <FleetPageContainer {...{ className }}>
          <UseCustomerSiteProvider>
            <UseCustomerLineProvider>
              <UseCustomerMachineProvider>
                <FleetPageHeaderBreadcrumbsProvider>
                  <FleetPageHeaderMachineStatusProvider>
                    <FleetPageHeader />
                    {children}
                  </FleetPageHeaderMachineStatusProvider>
                </FleetPageHeaderBreadcrumbsProvider>
              </UseCustomerMachineProvider>
            </UseCustomerLineProvider>
          </UseCustomerSiteProvider>
        </FleetPageContainer>
      </UseMachineInfoProvider>
    </UseCustomerInfoProvider>
  );
};

// this is the full path and variables for the fleet page view
export const fleetPagePath =
  'sitePage/customerId/pageSub1/siteId/pageSub2/lineId/pageSub3/machineId/mainView/subView';

const Provided = (): JSX.Element => {
  const { siteId, pageSub1, pageSub2, pageSub3 } = useRouter(fleetPagePath);

  // set the default view to 404 and only change if the pages are good to go
  let view: string | undefined = undefined;

  // start at the top and assume the routes are good
  if (pageSub1 === 'site') view = 'site';
  if (pageSub1 === 'dashboard') view = 'dashboard';
  if (pageSub2 === 'line') view = 'line';
  if (pageSub3 === 'machine') view = 'machine';

  // now we need to check for errors in the routes but go in reverse order
  if (pageSub3 && pageSub3 !== 'machine') {
    console.log('url error: error in pageSub3 position of path');
    view = undefined;
  }
  if (pageSub2 && pageSub2 !== 'line') {
    console.log('url error: error in pageSub2 position of path');
    view = undefined;
  }
  if (pageSub1 && pageSub1 !== 'site' && pageSub1 !== 'dashboard') {
    console.log('url error: error in pageSub1 position of path');
    view = undefined;
  }

  if (!siteId) view = 'dashboard';

  const PageView = useMemo(() => {
    switch (view) {
      // machine page has the tabs
      case 'machine': {
        return (
          <PageWrapper {...{ view }}>
            <FleetMachinePage />
          </PageWrapper>
        );
      }

      case 'line': {
        return (
          <PageWrapper {...{ view }}>
            <FleetLinePage />
          </PageWrapper>
        );
      }

      case 'site': {
        return (
          <PageWrapper {...{ view }}>
            <FleetSitePage />
          </PageWrapper>
        );
      }

      case 'dashboard': {
        return (
          <PageWrapper {...{ view }}>
            <FleetDashboardPage />
          </PageWrapper>
        );
      }

      default: {
        return <div>404 page</div>;
      }
    }
  }, [view]);

  return PageView;
};

export const FleetPage = (): JSX.Element => {
  const history = useHistory();
  const currentUrl = useRouter(fleetPagePath);

  // this is for the demo only, remove this when using real data
  useEffect(() => {
    if (!currentUrl?.customerId) {
      history.push(
        '/proseal-demo/afw4345lsdf/site/site1afe94/line/line2r4e698/machine/machine1afe94/machine-production/overview'
      );
    }
  }, [currentUrl]);

  return (
    <UseCustomerInfoProvider>
      <Provided />
    </UseCustomerInfoProvider>
  );
};
