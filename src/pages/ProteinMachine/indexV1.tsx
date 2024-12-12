// 3rd party libs
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { useTimeZone } from 'providers';
// Components
import { PageLayout, TabNav, DateRangeProvider, PermissionWrapper, Reports } from 'components';
import { MachineInfo } from 'components/machine-health';
import MachineHealth from './MachineHealth';
import MachineConfig from './MachineConfig';
import ConfiguratorWrapperProtein from './MachineConfig/indexV2';
import MachinePerformance from './MachinePerformance';

// Hooks & Providers
import { useLanguage } from 'providers';

// Types
import { ConfigActiveTab, TopLevelTabs } from 'types/protein';
import { Role, UserScopes } from 'types';
import { PermissionScopeName } from 'types/user-management';

// Constants
import { JBTRoutes } from 'constants/routes';

// API
import {
  useGetAccountInfoQuery,
  useGetMachineByIdQuery,
  useGetMachineConfiguratorDataQuery
} from 'api';
import { FleetBreadCrumbs } from 'components/StyledUi/FleetBreadCrumbs';
import { reportActions } from 'actions';

const HeaderContainer = styled.header`
  padding-bottom: 1.25rem;
  background: linear-gradient(
    0deg,
    ${(props) => props.theme.colors.lightGrey2} 0%,
    rgba(241, 243, 244, 0) 100%
  );
  .bread-crumbs {
    margin-left: 2em;
  }
`;

const HeaderInner = styled.div`
  padding: 0 3.25rem;
`;

const ProteinMachineContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const ProteinMachine = (): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  const { languageId } = useLanguage();

  // Fetch machine widgets, this is used to determine if the
  // copy configuration button should be visible and if the MP tab is enabled
  const { data, isLoading, isFetching } = useGetMachineConfiguratorDataQuery({
    machineId: machineId,
    labels: [], // No labels; this will return all widgets
    languageId: languageId,
    showInactive: true
  });

  const [isMachinePerformanceActive, setIsMachinePerformanceActive] = useState(false);
  const [isLoadingMachinePerformance, setIsLoadingMachinePerformance] = useState(true);

  useEffect(() => {
    setIsLoadingMachinePerformance(true);

    const mpWidget = data?.find((widget) => widget.label === TopLevelTabs.MachinePerformance);
    setIsMachinePerformanceActive(mpWidget?.active || false);

    setIsLoadingMachinePerformance(isLoading);
  }, [data, isLoading, isFetching]);

  return (
    <Switch>
      <Route path={[JBTRoutes.machineHealthConfig, JBTRoutes.machinePerformanceConfig]}>
        <PermissionWrapper
          page={PermissionScopeName.FLEET}
          scope={UserScopes.Write}
          role={Role.Admin}
        >
          <MachineConfig
            isMachinePerformanceActive={isMachinePerformanceActive}
            machineWidgets={data}
          />
        </PermissionWrapper>
      </Route>
      <Route>
        <ProteinMachineView
          isLoading={isLoadingMachinePerformance}
          isMachinePerformanceActive={isMachinePerformanceActive}
        />
      </Route>
    </Switch>
  );
};

const configRouteMap = {
  [ConfigActiveTab.MachineHealth]: JBTRoutes.machineHealthConfig,
  [ConfigActiveTab.MachinePerformance]: JBTRoutes.machinePerformanceConfig,
  [ConfigActiveTab.Alerts]: JBTRoutes.machineAlerts,
  [ConfigActiveTab.Reports]: JBTRoutes.machineReports
};
interface ProteinMachineViewProps {
  isLoading: boolean;
  isMachinePerformanceActive: boolean;
}

const ProteinMachineView = ({
  isLoading,
  isMachinePerformanceActive
}: ProteinMachineViewProps): JSX.Element => {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const { timeZone } = useTimeZone();
  const dispatch = useDispatch();
  const { t } = useTranslation(['mh']);
  const { languageId } = useLanguage();
  const { machineId } = useParams<{ machineId: string }>();
  const { data: accountData } = useGetAccountInfoQuery({ machineId });
  const { data: machineData } = useGetMachineByIdQuery(machineId);

  if (accountData?.reportId && accountData?.workspaceId) {
    dispatch({ type: reportActions.SHOW_REPORT, machineId: machineId });
  } else {
    dispatch({ type: reportActions.HIDE_REPORT, machineId: machineId });
  }

  const [activeTab, setActiveTab] = useState<ConfigActiveTab>(ConfigActiveTab.MachineHealth);

  const goto = (route: string) => {
    history.push(route.replace(':machineId', machineId));
  };

  const isActive = (route: string) =>
    location.pathname.includes(route.replace(':machineId', machineId));

  const breadCrumbSettings = {
    paths: {
      customer: {
        label: accountData?.companyName,
        isLoading: !accountData
      },
      site: {
        label: accountData?.siteName,
        slug: !accountData?.plantId ? undefined : `/fleet/site/${accountData.plantId}`,
        isLoading: !accountData
      },
      line: {
        label: accountData?.lineName,
        isLoading: !accountData,
        slug: !machineData?.lineId ? undefined : `/fleet/line/${machineData.lineId}`
      },
      machine: {
        label: accountData?.description,
        isLoading: !accountData,
        slug: !machineId ? undefined : `/fleet/machine/${machineId}/machine-health/overview`
      }
    },
    machineStatus: {
      machineStatus: accountData?.connectionStatus?.watchdog,
      dataStatus: accountData?.connectionStatus?.gateway,
      lastConnected: accountData?.connectionStatus?.lastKnownConnected,
      isLoading: !accountData,
      productionState: accountData?.currProdState
    },
    handleEdit: () => history.push(configRouteMap[activeTab].replace(':machineId', machineId))
  };

  const navItems = useMemo(() => {
    return [
      {
        label: t('machine_health'),
        onClick: () => {
          goto(JBTRoutes.machineHealth);
          setActiveTab(ConfigActiveTab.MachineHealth);
        },
        active: isActive(JBTRoutes.machineHealth),
        isTabEnabled: true
      },
      {
        label: t('machine_performance'),
        onClick: () => {
          goto(JBTRoutes.machinePerformance);
          setActiveTab(ConfigActiveTab.MachinePerformance);
        },
        active: isActive(JBTRoutes.machinePerformance),
        isTabEnabled: isMachinePerformanceActive
      },
      {
        label: t('alerts'),
        onClick: () => {
          console.log('to be implemented');
        },
        active: isActive(JBTRoutes.machineAlerts),
        isTabEnabled: false
        // TODO - replace with below props for future use
        // onClick: () => {
        //   goto(JBTRoutes.machineAlerts);
        //   setActiveTab(ConfigActiveTab.Alerts);
        // },
        // isTabEnabled: true,
      }
    ];
  }, [isMachinePerformanceActive, location, languageId]);

  return (
    <>
      {/* TODO - Uncomment MachineHealthBar once there is an available API to connect to  */}
      {/* <MachineHealthBar width={240} indicatorPosition={30} /> */}
      <ProteinMachineContainer>
        <HeaderContainer>
          <FleetBreadCrumbs {...breadCrumbSettings} needsPadding />

          <HeaderInner>{/* <MachineInfo /> */}</HeaderInner>
        </HeaderContainer>
        <TabNav items={navItems} />
        <Switch>
          <Route exact path={`${match.path}/`}>
            <Redirect to={JBTRoutes.machineHealth.replace(':machineId', machineId)} />
          </Route>
          <Route path={JBTRoutes.machineHealth}>
            <DateRangeProvider {...{ timeZone }}>
              <MachineHealth />
            </DateRangeProvider>
          </Route>
          <Route path={JBTRoutes.machinePerformance}>
            {!isLoading && !isMachinePerformanceActive ? (
              <Redirect to={JBTRoutes.machineHealth.replace(':machineId', machineId)} />
            ) : (
              // MP is one nav-level collapsed, so we need to use PageLayout here
              <PageLayout pageName="machinePerformance">
                <DateRangeProvider {...{ timeZone }}>
                  <MachinePerformance />
                </DateRangeProvider>
              </PageLayout>
            )}
          </Route>
          <Route path={JBTRoutes.machineAlerts}>
            <DateRangeProvider {...{ timeZone }}>
              <h3>Alerts</h3>
            </DateRangeProvider>
          </Route>

          <Route path={JBTRoutes.machineReports}>
            <Reports
              // uuIDs={{ reportId: accountData?.reportId, workspaceId: accountData?.workspaceId }}
              powerBiList={accountData?.powerBiList}
            />
          </Route>
        </Switch>
      </ProteinMachineContainer>
    </>
  );
};

export default ProteinMachine;
