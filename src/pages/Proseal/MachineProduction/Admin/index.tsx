// 3rd Party Libraries
import React, { useEffect, useRef, useState } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { faGear, faCube, faChartColumn, faBars } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

// Components
import { Pill, WarningPrompt } from 'components';

// Theme
import theme from 'themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Recipes from './Recipes';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  flex: 1;
`;

const SubContainer = styled.div`
  display: flex;
  height: 100%;
  flex: 4;
`;

const SideNavContainer = styled.div`
  max-width: 12rem;
  border-right: 1px solid ${theme.colors.lightGrey2};
  height: 100%;
`;

const SideNavListContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

interface SideNavListItemProps {
  selected?: boolean;
}

const SideNavItem = styled(Pill)<SideNavListItemProps>`
  border-bottom: ${({ selected, theme }) =>
    selected ? 'transparent' : `1px solid ${theme.colors.lightGrey2}`};
  height: 3.75rem;
  padding-left: 1rem;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.mediumBlue3 : theme.colors.white};
  border-color: ${({ selected, theme }) => (selected ? 'transparent' : theme.colors.lightGrey2)};
  align-items: center;
  padding: 1.3rem;
`;

const Icon = styled(FontAwesomeIcon)`
  padding-right: 0.68rem;
`;

export const SUB_ROUTES = {
  machineInfo: 'machine-information',
  platformSettings: 'platform-settings',
  configuration: 'configuration',
  recipes: 'recipes'
};

interface Props {
  setIsDirtyParent: (bottleneck: boolean) => void;
}

const Admin = ({ setIsDirtyParent }: Props): JSX.Element => {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const previousLocation = useRef('');
  const { t } = useTranslation(['mh']);

  const goto = (subRoute: string) => {
    history.push(`${match.url}/${subRoute}`);
  };

  const isActive = (subRoute: string) => location.pathname.includes(`${match.url}/${subRoute}`);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (previousLocation.current !== location.pathname) {
      setIsDirty(false);
      setIsDirtyParent(false);
      previousLocation.current = location.pathname;
    }
  }, [location]);

  return (
    <>
      <WarningPrompt
        helperText={t('not_saved_warning')}
        isVisible={isDirty}
        title={t('unsaved_changes')}
      />
      <Container>
        <SideNavContainer>
          <SideNavListContainer>
            <SideNavItem
              onClick={() => goto(SUB_ROUTES.machineInfo)}
              selected={isActive(SUB_ROUTES.machineInfo)}
            >
              <Icon icon={faCube} size="sm" />
              {t('machine_information')}
            </SideNavItem>
            <SideNavItem
              onClick={() => goto(SUB_ROUTES.platformSettings)}
              selected={isActive(SUB_ROUTES.platformSettings)}
            >
              <Icon icon={faGear} size="sm" />
              {t('platform_settings')}
            </SideNavItem>
            <SideNavItem
              onClick={() => goto(SUB_ROUTES.configuration)}
              selected={isActive(SUB_ROUTES.configuration)}
            >
              <Icon icon={faChartColumn} size="sm" />
              {t('configuration')}
            </SideNavItem>
            <SideNavItem
              onClick={() => goto(SUB_ROUTES.recipes)}
              selected={isActive(SUB_ROUTES.recipes)}
            >
              <Icon icon={faBars} size="sm" />
              {t('recipes')}
            </SideNavItem>
          </SideNavListContainer>
        </SideNavContainer>
        <SubContainer>
          <Switch>
            <Route exact path={`${match.path}/`}>
              <Redirect to={`${match.url}/${SUB_ROUTES.machineInfo}`} />
            </Route>
            <Route path={`${match.path}/${SUB_ROUTES.machineInfo}`}></Route>
            <Route path={`${match.path}/${SUB_ROUTES.platformSettings}`}></Route>
            <Route path={`${match.path}/${SUB_ROUTES.configuration}`}></Route>
            <Route path={`${match.path}/${SUB_ROUTES.recipes}`}>
              <Recipes setIsDirty={setIsDirty} isDirty={isDirty} />
            </Route>
          </Switch>
        </SubContainer>
      </Container>
    </>
  );
};

export default Admin;
