import React, { useEffect, useRef, useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import { useFleetMachineAccountData } from 'pages/FleetMachineDetail/hooks';
import CreateAlertPage from '../CreateAlert';
import { useTranslation } from 'react-i18next';
import AlertsTable from './AlertsTable';
import { Nav, NavMenu, NavSubMenu, SubTab, Tab } from '../CreateAlert/index.elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useHistory, useLocation } from 'react-router-dom';
import { themeColors } from 'themes';
import { BellIcon } from 'icons';
import TagCalculated from '../TagCalculated';

// This is global wrapper for ALL BUs, for all machines.
// This compoenet goes into Alerts tab for each machine layout.
// Right now we have 6 BUs with 5 different layouts

// BU:      Layout used:
// ______________________________
// pemea:   <ProteinMachine />
// pna:     <ProteinMachine />
// avure:   <FleetMachineDetail />
// aseptic: <Aseptic />
// dsi:     <DSI />
// proseal: <Proseal />

//Possible props:
//  data?: BaseType[] //this will change one we know the data we are getting from API
//  custom tabs if needed

export const AlertTabGlobal = (): JSX.Element => {
  const match = useRouteMatch();
  return (
    <>
      <AlertTabHeader />
      <Switch>
        <Route exact path={`${match.path}/`}>
          <Redirect to={`${match.url}/manage-alerts`} />
        </Route>
        <Route path={`${match.path}/manage-alerts`}>
          <AlertsTable />
        </Route>
        <Route path={`${match.path}/historical-alerts`}>
          <p>Historical Alerts</p>
        </Route>
        <Route path={`${match.path}/create-alert`}>
          <CreateAlertPage />
        </Route>
        <Route path={`${match.path}/:alertId/update-alert`}>
          <CreateAlertPage />
        </Route>
        <Route path={`${match.path}/tags-calculated`}>
          <TagCalculated />
        </Route>
        <Route path={`${match.path}/tags-aggregated`}>
          <div>tags_aggregated</div>
        </Route>
      </Switch>
    </>
  );
};

const AlertTabHeader = (): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const history = useHistory();
  const location = useLocation();
  const [isSelectedDropdown, setIsSelectedDropdown] = useState('tags_calculated');
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const { machineId } = useFleetMachineAccountData();
  const pageBasePath = `/fleet/machine/${machineId}`;

  const onTagDropdown = (path: string) => {
    setIsSelectedDropdown(path);
    history.push(pageBasePath + '/alerts/' + path.replace(/_/g, '-'));
  };

  const Tabs = [
    {
      label: 'tags_calculated',
      value: 'tags_calculated'
    },
    {
      label: 'tags_aggregated',
      value: 'tags_aggregated'
    }
  ];

  return (
    <Nav>
      <NavMenu ref={ref}>
        <li className="nav__menu-item">
          <Tab
            onClick={() => history.push(pageBasePath + '/alerts/manage-alerts')}
            $isSelected={location.pathname.split('/')[5] === 'manage-alerts'}
          >
            <BellIcon
              width="48"
              color={
                location.pathname.split('/')[5] === 'manage-alerts'
                  ? themeColors.primaryBlue5
                  : themeColors.lightGrey8
              }
            />
            <span>{t('manage_alerts') as string}</span>
          </Tab>
        </li>
        <li className="nav__menu-item" onClick={() => setIsComponentVisible(!isComponentVisible)}>
          <SubTab
            $isSelected={
              location.pathname.split('/')[5] === 'tags-calculated' ||
              location.pathname.split('/')[5] === 'tags-aggregated'
            }
          >
            {t(isSelectedDropdown) as string}
          </SubTab>
          <FontAwesomeIcon
            className="icon"
            color={themeColors.lightGrey8}
            icon={isComponentVisible ? faChevronUp : faChevronDown}
          />
          {isComponentVisible && (
            <NavSubMenu>
              {Tabs.map((tab) => {
                return (
                  <SubTab
                    key={tab.value}
                    className="nav__submenu-item"
                    onClick={() => {
                      onTagDropdown(tab.value);
                    }}
                    $isSelected={isSelectedDropdown === tab.value}
                  >
                    <a>{t(tab.value) as string}</a>
                  </SubTab>
                );
              })}
            </NavSubMenu>
          )}
        </li>
      </NavMenu>
    </Nav>
  );
};

function useComponentVisible(initialIsVisible: boolean) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);

  /*eslint-disable-next-line*/
  const ref = useRef<any>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current?.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}
