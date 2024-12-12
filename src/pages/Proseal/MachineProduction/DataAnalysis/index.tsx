// 3rd Party Libraries
import React from 'react';
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { Pill } from 'components';
import AllData from './AllData/AllData';
import RecipeReport from './RecipeReport';
import DowntimeReport from './DowtimeReport';

// Theme
import theme from 'themes';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabsContainer = styled.div`
  position: relative;
  padding: 1rem 3.125rem;
  display: flex;
  gap: 1rem;
`;

const ShowMeContainer = styled.div`
  color: ${theme.colors.mediumBlue};
  line-height: 3rem;
`;

export const SUB_ROUTES = {
  recipeJob: 'recipe-job',
  downtime: 'downtime',
  allData: 'all-data'
};

const DataAnalysis = (): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  const goto = (subRoute: string) => {
    history.push(`${match.url}/${subRoute}`);
  };

  const isActive = (subRoute: string) => location.pathname.includes(`${match.url}/${subRoute}`);

  return (
    <Container>
      <TabsContainer>
        <ShowMeContainer>{t('show_me')}:</ShowMeContainer>
        <Pill onClick={() => goto(SUB_ROUTES.recipeJob)} selected={isActive(SUB_ROUTES.recipeJob)}>
          {t('recipe_job')}
        </Pill>
        <Pill onClick={() => goto(SUB_ROUTES.downtime)} selected={isActive(SUB_ROUTES.downtime)}>
          {t('downtime')}
        </Pill>
        <Pill onClick={() => goto(SUB_ROUTES.allData)} selected={isActive(SUB_ROUTES.allData)}>
          {t('all_data')}
        </Pill>
      </TabsContainer>
      <Switch>
        <Route exact path={`${match.path}/`}>
          <Redirect to={`${match.url}/${SUB_ROUTES.allData}`} />
        </Route>
        <Route path={`${match.path}/${SUB_ROUTES.recipeJob}`}>
          <RecipeReport />
        </Route>
        <Route path={`${match.path}/${SUB_ROUTES.downtime}`}>
          <DowntimeReport />
        </Route>
        <Route path={`${match.path}/${SUB_ROUTES.allData}`}>
          <AllData />
        </Route>
      </Switch>
    </Container>
  );
};

export default DataAnalysis;
