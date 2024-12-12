// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { Route, Switch, useHistory, useRouteMatch, useParams } from 'react-router-dom';

// Theme
import theme from 'themes';

// Types
import { ProteinMachineRouteQueryParams } from 'types/protein';

// Components
// import Templates from './Templates';
// import TemplateDetails from './TemplateDetails';

// Constants
import { JBTRoutes } from 'constants/routes';

// Providers
import { ContainerResizeProvider, OverviewTemplateProvider } from 'providers';
import Templates from 'components/machine-health/Templates';
import TemplateDetails from './TemplateDetails';

// Styling
export const MainViewContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: center;
  background-image: radial-gradient(${theme.colors.darkGrey} 3%, transparent 4%);
  background-color: ${theme.colors.lightGrey1};
  background-position: 0 0, 0.3125rem 0.3125rem;
  background-size: 1.5625rem 1.5625rem;
`;

const DataAnalysis = (): JSX.Element => {
  const match = useRouteMatch();
  const history = useHistory();
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();

  const clickHandler = (selectedTemplateId?: string) => {
    history.push({
      pathname: JBTRoutes.machineHealthDataAnalysisTemplate.replace(':machineId', machineId),
      search: `?templateId=${selectedTemplateId}`
    });
  };

  return (
    <Switch>
      <Route exact path={`${match.path}/`}>
        <Templates onClick={clickHandler}></Templates>
      </Route>
      <Route path={JBTRoutes.machineHealthDataAnalysisTemplate}>
        <OverviewTemplateProvider>
          <ContainerResizeProvider>
            <TemplateDetails />
          </ContainerResizeProvider>
        </OverviewTemplateProvider>
      </Route>
    </Switch>
  );
};

export default DataAnalysis;
