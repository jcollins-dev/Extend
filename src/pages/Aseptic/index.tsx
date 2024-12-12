// 3rd party libs
import React, { ReactElement, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { includes, isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import { TabNav, Tabs, Reports } from 'components';
import { MachineAccountInfoQueryParams } from 'types/protein';
import { MachineInfo } from 'components/machine-health';
import { useGetTopAsepticMachineHealthChangeoverQuery } from 'api';
import { AsepticChangeoverType } from 'types/machine-health/aseptic';
import { useGetAccountInfoQuery } from 'api';
import { FleetBreadCrumbs } from 'components/StyledUi/FleetBreadCrumbs';

// Routes
import { JBTRoutes } from 'constants/routes';
import { Switch, Redirect, Route, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import {
  Alarms,
  ChangeOver,
  FoilPress,
  KPIs,
  LaneStatus,
  Overview
} from 'pages/Aseptic/MachineHealth';

//themes
import theme from 'themes';

import { reportActions } from 'actions';
import { AlertTabGlobal } from 'pages/AlertsPage/AlertsTab';
import { FleetMachineAccountDataProvider } from 'pages/FleetMachineDetail/hooks';

// Styling
const TabsContainer = styled.div`
  position: relative;
  padding: 1rem 3.125rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.05);
  background-color: ${theme.colors.white};
`;

// const ActionsContainer = styled.div`
//   margin-left: auto;
// `;

const HeaderInner = styled.div`
  padding: 0 3.25rem;
`;

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

const Aseptic = (): ReactElement => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { machineId } = useParams<MachineAccountInfoQueryParams>();
  const { data: accountData } = useGetAccountInfoQuery({ machineId });
  const { t } = useTranslation(['mh']);
  const history = useHistory();
  const goto = (subRoute: string) => {
    const path = subRoute.replace(':machineId', machineId);
    history.push(path);
  };
  const [currentTab, setCurrentTab] = useState<string>('0');

  if (accountData?.reportId && accountData?.workspaceId) {
    dispatch({ type: reportActions.SHOW_REPORT, machineId: machineId });
  } else {
    dispatch({ type: reportActions.HIDE_REPORT, machineId: machineId });
  }

  const tabData = [
    { label: t('overview'), panel: '0', route: JBTRoutes.machineHealthOverview },
    { label: t('foil_press'), panel: '1', route: JBTRoutes.machineHealthFoilPress },
    { label: t('changeover'), panel: '2', route: JBTRoutes.machineHealthChangeOver },
    { label: t('lane_status'), panel: '3', route: JBTRoutes.machineHealthLaneStatus },
    { label: t('alarms'), panel: '4', route: JBTRoutes.machineHealthAlarms },
    { label: t('kpis'), panel: '5', route: JBTRoutes.machineHealthKPIs }
  ];
  const currentTabPanel = tabData.filter(
    (tabItem: { label: string; panel: string; route: string }) => {
      const subRoute = location.pathname.split('/')[5];
      return includes(tabItem.route, subRoute);
    }
  );

  const getModalTabs = () => {
    return tabData.map((tab) => {
      return {
        label: tab.label,
        panel: tab.panel
      };
    });
  };

  const {
    data: topChangeover,
    isFetching: isTopChangeoverFetching,
    isLoading: isTopChangeoverLoading,
    error: topChangeoverError
  } = useGetTopAsepticMachineHealthChangeoverQuery(
    { machineId },
    { skip: !machineId, pollingInterval: 30000 }
  );

  useEffect(() => {
    const path = location.pathname.split('/')[4];
    if (path === 'machine-health') {
      setCurrentTab('0');
    } else if (path === 'alerts') {
      setCurrentTab('1');
    } else {
      setCurrentTab('2');
    }
  }, []);

  const navItems = useMemo(() => {
    return [
      {
        label: t('machine_health'),
        onClick: () => {
          setCurrentTab('0');
          goto(JBTRoutes.machineHealthOverview);
        },
        active: currentTab === '0',
        isTabEnabled: true
      },
      {
        label: t('alerts'),
        onClick: () => {
          if (process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true') {
            setCurrentTab('1');
            goto(JBTRoutes.machineAlerts);
          }
        },
        active: currentTab === '1',
        isTabEnabled: process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true' ? true : false
      }
    ];
  }, [currentTab]);

  const breadCrumbSettings = {
    paths: {
      customer: {
        isLoading: !accountData,
        slug: accountData ? `/fleet/site/${accountData.plantId}` : undefined,
        label: accountData?.companyName
      },
      site: {
        isLoading: !accountData,
        label: accountData?.siteName
      },
      line: {
        isLoading: !accountData,
        label: accountData?.lineName
      },
      machine: {
        isLoading: !accountData,
        label: accountData?.description
      }
    },
    machineStatus: {
      productionState: accountData?.currProdState,
      isLoading: !accountData
    }
  };

  return (
    <FleetMachineAccountDataProvider>
      {/* mock for now based on mockups, to adjust later according to path and Ids*/}
      <HeaderContainer>
        <FleetBreadCrumbs {...breadCrumbSettings} needsPadding />
        <HeaderInner>
          <MachineInfo />
        </HeaderInner>
      </HeaderContainer>
      <TabNav items={navItems} />
      {currentTab === '0' && (
        <>
          <TabsContainer>
            <Tabs
              rounded={false}
              setTabPanel={(tabNumber) => {
                const tabItemFiltered = tabData.filter(
                  (tabItem: { label: string; panel: string; route: string }) => {
                    return tabItem.panel === tabNumber;
                  }
                );
                goto(`${tabItemFiltered[0].route}`);
              }}
              currentTabPanel={!isEmpty(currentTabPanel) ? currentTabPanel[0].panel : '0'}
              items={getModalTabs()}
            />
            {/* {Commented if it's needed in the future just uncomment it} 
            <ActionsContainer>
              <ActionButton hideArrow>
                Account information
              </ActionButton>
            </ActionsContainer> */}
          </TabsContainer>
        </>
      )}
      <Switch>
        <Route exact path={`${match.path}/`}>
          <Redirect to={JBTRoutes.machineHealthOverview.replace(':machineId', machineId)} />
        </Route>
        <Route path={JBTRoutes.machineHealthOverview}>
          <Overview
            currentChangeoverSummary={topChangeover as AsepticChangeoverType}
            isChangeoverLoading={isTopChangeoverLoading}
            changeoverError={topChangeoverError}
          />
        </Route>

        <Route path={JBTRoutes.machineHealthFoilPress}>
          <FoilPress />
        </Route>

        <Route path={JBTRoutes.machineHealthChangeOver}>
          <ChangeOver
            selectedChangeover={topChangeover as AsepticChangeoverType}
            isLoading={isTopChangeoverFetching}
            error={topChangeoverError}
          />
        </Route>

        <Route path={JBTRoutes.machineHealthLaneStatus}>
          <LaneStatus />
        </Route>

        <Route path={JBTRoutes.machineHealthAlarms}>
          <Alarms />
        </Route>

        <Route path={JBTRoutes.machineHealthKPIs}>
          <KPIs />
        </Route>

        <Route path={JBTRoutes.machineAlerts}>
          <AlertTabGlobal />
        </Route>

        <Route path={JBTRoutes.machineReports}>
          <Reports
            // uuIDs={{ reportId: accountData?.reportId, workspaceId: accountData?.workspaceId }}
            powerBiList={accountData?.powerBiList}
          />
        </Route>
      </Switch>
    </FleetMachineAccountDataProvider>
  );
};

export default Aseptic;

/*
<Breadcrumbs
          items={[
            {
              label: accountData ? accountData.companyName : t('retrieving_customer'),
              link: JBTRoutes.machineHealthOverview.replace(':machineId', machineId)
            },
            {
              label: accountData ? accountData.siteName : t('retrieving_plant'),
              link: JBTRoutes.machineHealthOverview.replace(':machineId', machineId)
            },
            {
              label: accountData ? accountData.description : t('retrieving_machine_name')
            }
          ]}
        />
        */
