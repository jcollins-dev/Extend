// 3rd party libs
import React, { ReactElement } from 'react';

import { ContainerResizeProvider } from 'providers/containerResizeProvider';
import { OverviewTemplateProvider } from 'providers/overviewTemplateProvider';
import TemplateDetails from 'pages/ProteinMachine/MachineHealth/DataAnalysis/TemplateDetails';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import Templates from 'components/machine-health/Templates';
import { JBTRoutes } from 'constants/routes';
import { ProteinMachineRouteQueryParams } from 'types/protein';

const DataAnalysis = (): ReactElement => {
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
