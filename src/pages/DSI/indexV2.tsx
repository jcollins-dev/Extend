// 3rd party libs
import React, { ReactElement, ReactNode } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch
} from 'react-router-dom';

// Components
import {
  DateRangeProvider,
  PermissionWrapper,
  SitePage,
  SitePageView,
  SitePageViewProps
} from 'components';
import { JBTRoutes } from 'constants/routes';

// Hooks
import {
  FleetMachineAccountDataProvider,
  useFleetMachineAccountData
} from 'pages/FleetMachineDetail/hooks';

// Providers
import { useTimeZone } from 'providers';
import { PageViewMachineHealth } from './MainViews';
import { usePageSettingsDSI } from './usePageSettingsDSI';
import { PermissionScopeName } from 'types/user-management';
import { Role, UserScopes } from 'types';
import { ConfiguratorWrapperDSI } from './Configurator/ConfiguratorWrapperDSI';
import { AlertTabGlobal } from 'pages/AlertsPage/AlertsTab';

const DSI = (): ReactElement => {
  const { timeZone } = useTimeZone();
  const { machineId } = useParams<{ machineId: string }>();
  const match = useRouteMatch();

  return (
    <FleetMachineAccountDataProvider>
      <DateRangeProvider timeZone={timeZone} subtractDaysCount={14}>
        <Switch>
          <Route exact path={`${match.path}/`}>
            <Redirect to={JBTRoutes.machineHealth.replace(':machineId', machineId)} />
          </Route>
          <Route path={JBTRoutes.machineHealth}>
            <FleetMachinePageDSI>
              <PageViewMachineHealth />
            </FleetMachinePageDSI>
          </Route>

          {process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true' && (
            <Route path={JBTRoutes.machineAlerts}>
              <FleetMachinePageDSI>
                <AlertTabGlobal />
              </FleetMachinePageDSI>
            </Route>
          )}

          <Route path={[JBTRoutes.machineHealthConfig, JBTRoutes.machineAlertsConfig]}>
            <PermissionWrapper
              page={PermissionScopeName.FLEET}
              scope={UserScopes.Write}
              role={Role.Admin}
            >
              <ConfiguratorWrapperDSI />
            </PermissionWrapper>
          </Route>
        </Switch>
      </DateRangeProvider>
    </FleetMachineAccountDataProvider>
  );
};

export default DSI;

interface Props {
  children?: ReactNode | ReactNode[];
}

const FleetMachinePageDSI = ({ children }: Props): JSX.Element => {
  const { machineId, isLoading, hasError, accountData } = useFleetMachineAccountData();

  if (!machineId) return <></>;

  const { breadCrumbs, pageTabs, configTabs } = usePageSettingsDSI();

  const { pathname } = useLocation();
  const history = useHistory();

  const pageSettings = {
    className: 'dsi',
    hasBackground: true,
    breadCrumbs: {
      ...breadCrumbs,
      handleEdit: () => {
        const activeTab = configTabs && configTabs.filter(({ slug }) => pathname.includes(slug));
        activeTab && activeTab.length > 0
          ? history.push(activeTab[0].path as unknown as string)
          : undefined;
      }
    },
    machineDetails: {
      serialNumber: accountData?.serialNumber,
      productionState: accountData?.currProdState,
      businessUnit: 'dsi',
      machineId,
      isLoading
    },
    businessUnit: 'dsi',
    pageTabs
  };

  if (!machineId && !isLoading && !hasError) {
    return <SitePage {...pageSettings}>Error loading machine info</SitePage>;
  } else {
    return <SitePage {...pageSettings}>{children}</SitePage>;
  }
};

export const FleetMachinePageView = ({
  children,
  pageViewSlug,
  ...rest
}: SitePageViewProps): JSX.Element => {
  const { pageViewTabs } = usePageSettingsDSI();

  const pageViewSettings = {
    pageViewSlug,
    pageViewTabs: pageViewTabs?.[pageViewSlug],
    ...rest
  };

  return <SitePageView {...pageViewSettings}>{children}</SitePageView>;
};
