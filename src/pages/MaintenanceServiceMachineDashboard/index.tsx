// 3rd party libraries
import React, { ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import MaintenanceServiceDashboardContents from '../MaintenanceServiceDashboard/MaintenanceServiceDashboardContents';
import { Button, Loader, Typography } from 'components';
import theme from 'themes';

import { FleetNavigationEntityType, useFleetNavigation } from 'providers';

// Types
import { NAV_ITEMS_TO_ID } from 'constants/nav';

// API
import { useGetMaintenanceEventsQuery } from 'api';
import { JBTRoutes } from 'constants/routes';

// Styling
const Container = styled.div`
  padding: 1.75rem 1.5rem;
`;

const Root = styled.div`
  height: 17rem;
  width: 32rem;
  margin: auto;
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0.125rem solid;
  border-radius: 0.625rem;
  border-color: #e2e2e2;
  h3 {
    padding: 2rem;
  }
`;

const PartsButtons = styled.div`
  display: flex;
  max-width: 21rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  * + * {
    margin-left: 1rem;
  }
`;

export default function MaintenanceServiceMachineDashboard(): ReactElement {
  const { machineId } = useParams<{ machineId: string }>();
  // const { data: machine, isLoading: machineIsLoading } = useGetMachineByIdQuery(machineId);
  const { data: allEvents, isLoading: eventsLoading } = useGetMaintenanceEventsQuery({
    machineIds: machineId ? [machineId] : [],
    limit: 1
  });
  const { t } = useTranslation(['fpns']);
  const history = useHistory();

  const navContext = useFleetNavigation();

  const gotoMaintenanceDashBoard = () => {
    history.push(JBTRoutes.maintenanceService);
  };

  useEffect(() => {
    machineId &&
      navContext.updateEntityIfNeeded({ type: FleetNavigationEntityType.MACHINE, id: machineId });
    navContext.updateNavIdIfNeeded(NAV_ITEMS_TO_ID.maintenance);
  }, [machineId, navContext]);

  return eventsLoading || !allEvents ? (
    <Loader />
  ) : allEvents.total === 0 ? (
    <Container>
      <Root>
        <Typography color={theme.colors.darkGrey} variant="h3">
          {t('no_maintenance_schedule_exists')}
        </Typography>
        <PartsButtons>
          <Button variant="primary" disabled={false} onClick={gotoMaintenanceDashBoard}>
            {t('go_to_maintenance')}
          </Button>
        </PartsButtons>
      </Root>
    </Container>
  ) : (
    <MaintenanceServiceDashboardContents machineId={machineId} />
  );
}
