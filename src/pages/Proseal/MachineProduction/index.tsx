// 3rd party libs
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Switch, Route, useRouteMatch, useHistory, useLocation, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { Flyout, Pill, WarningPrompt } from 'components';

// Subviews
import Admin from './Admin';
import DataAnalysis from './DataAnalysis';
import Overview from './Overview';
import HistoricView from './HistoricView';
import { MachineAccountInfo } from 'components/machine-health';

export const SUB_ROUTES = {
  overview: 'overview',
  historicView: 'historic-view',
  dataAnalysis: 'data-analysis',
  prosealAdmin: 'proseal-admin'
};

const MachineHealthContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const TabsContainer = styled.div`
  position: relative;
  padding: 1rem 3.125rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.05);
`;

const MachineProduction = (): JSX.Element => {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const previousLocation = useRef('');
  const [flyout, setFlyout] = useState(false);
  const [isDirtyParent, setIsDirtyParent] = useState(false);
  const { t } = useTranslation(['mh']);

  const goto = (subRoute: string) => {
    history.push(`${match.url}/${subRoute}`);
  };

  const isActive = (subRoute: string) => location.pathname.includes(`${match.url}/${subRoute}`);

  useEffect(() => {
    if (previousLocation.current !== location.pathname) {
      setIsDirtyParent(false);
      previousLocation.current = location.pathname;
    }
  }, [location]);

  return (
    <>
      <WarningPrompt
        helperText={t('not_saved_warning')}
        isVisible={isDirtyParent}
        title={t('unsaved_changes')}
      />
      <MachineHealthContainer>
        <TabsContainer>
          <Pill onClick={() => goto(SUB_ROUTES.overview)} selected={isActive(SUB_ROUTES.overview)}>
            {t('overview')}
          </Pill>
          <Pill
            onClick={() => goto(SUB_ROUTES.historicView)}
            selected={isActive(SUB_ROUTES.historicView)}
          >
            {t('historic_view')}
          </Pill>
          <Pill
            onClick={() => goto(SUB_ROUTES.dataAnalysis)}
            selected={isActive(SUB_ROUTES.dataAnalysis)}
          >
            {t('data_analysis')}
          </Pill>
          <Pill
            onClick={() => goto(SUB_ROUTES.prosealAdmin)}
            selected={isActive(SUB_ROUTES.prosealAdmin)}
          >
            {t('admin')}
          </Pill>
        </TabsContainer>
        <Switch>
          <Route exact path={`${match.path}/`}>
            <Redirect to={`${match.url}/${SUB_ROUTES.overview}`} />
          </Route>
          <Route path={`${match.path}/${SUB_ROUTES.overview}`}>
            <Overview />
          </Route>
          <Route path={`${match.path}/${SUB_ROUTES.historicView}`}>
            <HistoricView />
          </Route>
          <Route path={`${match.path}/${SUB_ROUTES.dataAnalysis}`}>
            <DataAnalysis />
          </Route>
          <Route path={`${match.path}/${SUB_ROUTES.prosealAdmin}`}>
            <Admin setIsDirtyParent={setIsDirtyParent} />
          </Route>
        </Switch>
        <Flyout width="28.125rem" visible={flyout} onClose={() => setFlyout(false)}>
          <MachineAccountInfo close={() => setFlyout(false)} />
        </Flyout>
      </MachineHealthContainer>
    </>
  );
};

export default MachineProduction;
