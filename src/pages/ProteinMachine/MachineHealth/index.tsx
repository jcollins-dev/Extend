// 3rd party libs
import React, { useState } from 'react';
import styled from 'styled-components';
import { Switch, Route, useRouteMatch, useLocation, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { ActionButton, Flyout, PageLayout } from 'components';
import { ConfiguredSubNav, DataRenderer } from 'components/machine-health';

// Subviews
import Cleaning from './Cleaning';
import DataAnalysis from './DataAnalysis';
import Overview from './Overview';
import ProductProcessing from './ProductProcessing';
import ProductMovement from './ProductMovement';
import { MachineAccountInfo } from 'components/machine-health';
//import { AlarmsView as Alarms } './AlarmsV2/Alarms'
import { SyncZoomProvider } from 'providers';

// Types
import { MachineHealthTabs } from 'types/protein';

// Routes
import { proteinMachineHealthSlugs } from 'constants/routes';

// Hooks
import { useConfiguredSubNav } from 'hooks';
import { AlarmsView } from './AlarmsV2/Alarms';

// Define the slugs used for top level nav within Machine Health
export const SUB_ROUTES = {
  overview: proteinMachineHealthSlugs[MachineHealthTabs.Overview],
  productProcessing: proteinMachineHealthSlugs[MachineHealthTabs.ProductProcessing],
  productMovement: proteinMachineHealthSlugs[MachineHealthTabs.ProductMovement],
  cleaning: proteinMachineHealthSlugs[MachineHealthTabs.Cleaning],
  alarms: proteinMachineHealthSlugs[MachineHealthTabs.Alarms],
  dataAnalysis: proteinMachineHealthSlugs[MachineHealthTabs.DataAnalysis]
};

const TabsContainer = styled.div`
  position: relative;
  padding: 1rem 3.125rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.05);
`;

const ActionsContainer = styled.div`
  margin-left: auto;
`;

const MachineHealth = (): JSX.Element => {
  const match = useRouteMatch();
  const location = useLocation();

  const [flyout, setFlyout] = useState(false);

  const { t } = useTranslation(['mh']);

  const isActive = (subRoute: string) => location.pathname.includes(`${match.url}/${subRoute}`);

  const { isLoading, error, tabs } = useConfiguredSubNav();

  return (
    <PageLayout pageName="machineHealth">
      <DataRenderer isLoading={isLoading} error={error && (t('failed_load_navigation') as string)}>
        <TabsContainer>
          <ConfiguredSubNav baseUrl={match.url} />
          <ActionsContainer>
            {isActive(SUB_ROUTES.overview) && (
              <ActionButton onClick={() => setFlyout(true)} hideArrow>
                {t('account_information')}
              </ActionButton>
            )}
          </ActionsContainer>
        </TabsContainer>
        <Switch>
          <Route exact path={`${match.path}/`}>
            {/* Redirect to the first active tab - this may not necessarily be Overview */}
            <Redirect to={`${match.url}/${tabs && tabs[0].slug}`} />
          </Route>
          <Route path={`${match.path}/${SUB_ROUTES.overview}`}>
            <Overview />
          </Route>
          <Route path={`${match.path}/${SUB_ROUTES.productProcessing}`}>
            <SyncZoomProvider>
              <ProductProcessing />
            </SyncZoomProvider>
          </Route>
          <Route path={`${match.path}/${SUB_ROUTES.productMovement}`}>
            <SyncZoomProvider>
              <ProductMovement />
            </SyncZoomProvider>
          </Route>
          <Route path={`${match.path}/${SUB_ROUTES.cleaning}`}>
            <SyncZoomProvider>
              <Cleaning />
            </SyncZoomProvider>
          </Route>
          <Route path={`${match.path}/${SUB_ROUTES.alarms}`}>
            <AlarmsView />
          </Route>
          <Route path={`${match.path}/${SUB_ROUTES.dataAnalysis}`}>
            <SyncZoomProvider>
              <DataAnalysis />
            </SyncZoomProvider>
          </Route>
        </Switch>
        <Flyout width="28.125rem" visible={flyout} onClose={() => setFlyout(false)}>
          <MachineAccountInfo close={() => setFlyout(false)} />
        </Flyout>
      </DataRenderer>
    </PageLayout>
  );
};

export default MachineHealth;
