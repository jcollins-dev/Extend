import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { TabNav } from 'components';
import { JBTRoutes } from 'constants/routes';
import { useMachine } from 'hooks';
import { FleetBreadCrumbs } from 'components/StyledUi/FleetBreadCrumbs';

import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import styled from 'styled-components';

import MachineProduction from './MachineProduction';
import { AlertTabGlobal } from 'pages/AlertsPage/AlertsTab';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const HeaderContainer = styled.header`
  padding-bottom: 1.25rem;
  background: linear-gradient(
    0deg,
    ${(props) => props.theme.colors.lightGrey2} 0%,
    rgba(241, 243, 244, 0) 100%
  );
`;

const Proseal = (): ReactElement => {
  const data = useMachine();
  const { machineId } = useParams<{ machineId: string }>();
  const { t } = useTranslation(['mh']);
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  const goto = (route: string) => {
    history.push(route.replace(':machineId', machineId));
  };

  const isActive = (route: string) => {
    return location.pathname.includes(route.replace(':machineId', machineId));
  };

  const breadCrumbSettings = {
    paths: {
      machine: {
        label: data?.machine?.description,
        isLoading: !data
      }
    }
  };

  return (
    <Container>
      <HeaderContainer>
        <FleetBreadCrumbs {...breadCrumbSettings} />
      </HeaderContainer>
      <TabNav
        items={[
          {
            label: t('machine_health'),
            onClick: () => goto(JBTRoutes.machineHealth),
            active: isActive(JBTRoutes.machineHealth),
            isTabEnabled: true
          },
          {
            label: t('machine_production'),
            onClick: () => goto(JBTRoutes.machineProduction),
            active: isActive(JBTRoutes.machineProduction),
            isTabEnabled: true
          },
          {
            label: t('alerts'),
            onClick: () =>
              process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true'
                ? goto(JBTRoutes.machineAlerts)
                : undefined,
            active:
              process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true'
                ? isActive(JBTRoutes.machineAlerts)
                : undefined,
            isTabEnabled: process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true' ? true : false
          }
        ]}
      />
      <Switch>
        <Route exact path={`${match.path}/`}>
          <Redirect to={JBTRoutes.machineProduction.replace(':machineId', machineId)} />
        </Route>
        <Route path={JBTRoutes.machineHealth}>
          {/* placeholder */}
          <h3>{t('machine_health')}</h3>
        </Route>
        <Route path={JBTRoutes.machineProduction}>
          <MachineProduction />
        </Route>

        {process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true' && (
          <Route path={JBTRoutes.machineAlerts}>
            <AlertTabGlobal />
          </Route>
        )}
      </Switch>
    </Container>
  );
};

export default Proseal;
