// 3rd party libs
import React, { ReactElement, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

// Components
import OrganizationCollapse from './OrganizationCollapse';
import { Typography } from 'components';

// Api
import { useGetOrganizationsQuery, useGetPlantsQuery } from 'api';

// Hooks
import { useKeypress } from 'hooks';
import PlantNameCollapse from './PlantNameCollapse';
import { FleetNavigationEntityType, useFleetNavigation } from 'providers';

import { NavFlyoutType } from 'types';
import { default as theme } from 'themes';
import { JBTRoutes } from 'constants/routes';
import { sideNavItems } from 'constants/nav';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface NavFlyoutProps {
  showing: boolean;
  setShow: (show: boolean) => void;
  parentRef: React.MutableRefObject<HTMLDivElement | null>;
}

interface SubItemsRootProps {
  backgroundColor: string;
}
interface IconProps {
  iconColor: string;
}

interface LabelProps {
  fontColor: string;
}

const Root = styled.div`
  display: flex;
  flex-grow: 1;
  z-index: 0;
  min-height: 100vh;
  flex-direction: column;
  position: absolute;
  width: 20rem;
  background-color: ${({ theme }) => theme.colors.lightGrey1};
  box-shadow: 10px 14px 25px rgba(0, 43, 104, 0.2);
  clip-path: inset(0px -50px 0px 0px);
`;

const Header = styled.div<{ highlightColor: string; color: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 3.563rem;
  background-color: ${({ highlightColor }) => highlightColor};
  color: ${({ color }) => color};
  padding-left: 1.375rem;
  justify-content: space-between;
`;

const HeaderText = styled.div`
  line-height: 1.344rem;
`;

const IconContainer = styled.div`
  padding-right: 1rem;
  cursor: pointer;
  font-size: 0.875rem;
`;

const FlyoutBody = styled.div`
  overflow: scroll;
  height: 92vh;
  padding-top: 1.438rem;
  padding-bottom: 4rem;
  padding-left: 1.375rem;
  padding-right: 1.813rem;
  overflow-x: hidden;
`;

const SubItemsRowRoot = styled.div<SubItemsRootProps>`
  display: flex;
  padding: 0.875rem 0.5rem 0.875rem 1.25rem;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${(props) => props.backgroundColor};
  padding-bottom: 0.688rem;
  cursor: pointer;
`;

const SubItem = styled.div`
  display: flex;
  flex-direction: row;
  &:hover {
    cursor: pointer;
  }
`;

const ItemIcon = styled.div<IconProps>`
  width: 1.675rem;
  font-size: 0.875rem;
  line-height: 2rem;
  color: ${(props) => props.iconColor};
  padding-right: 1.4rem;
  display: flex;
  align-items: center;
`;

const ItemLabel = styled.div<LabelProps>`
  font-family: ${(props) => props.theme.typography.family};
  font-size: ${(props) => props.theme.typography.components.tableColumn.size};
  line-height: ${(props) => props.theme.typography.components.tableColumn.lineHeight};
  font-weight: ${(props) => props.theme.typography.components.tableColumn.weight};
  color: ${(props) => props.fontColor};
  display: flex;
  align-items: center;
`;

const NavFlyout = ({ showing, setShow, parentRef }: NavFlyoutProps): ReactElement => {
  useKeypress('Escape', () => setShow(false));
  const { data: plants, isFetching: plantsLoading } = useGetPlantsQuery();
  const { data: organizations, isFetching: organizationsLoading } = useGetOrganizationsQuery();
  const [left, setLeft] = useState<number>(0);
  const { t } = useTranslation(['mh']);
  const navContext = useFleetNavigation();
  const history = useHistory();
  const [scrolled, setScrolled] = useState<boolean>(false);

  const navFlyoutHighlight = navContext.getFlyoutHighlight();
  let highlightColor = navFlyoutHighlight[
    navFlyoutHighlight.type as NavFlyoutType.Fleet | NavFlyoutType.Parts | NavFlyoutType.Maintenance
  ] as string;
  highlightColor = highlightColor ? highlightColor : theme.colors.lightGrey2;

  const subItems = sideNavItems?.filter((item) => item.label === navContext.navFlyoutType)[0]
    ?.subItems;
  const subItemHighlightColor = navFlyoutHighlight[FleetNavigationEntityType.MACHINE] as string;
  const getBackgroundColor = () => {
    return subItemHighlightColor ? (subItemHighlightColor as string) : '';
  };

  useEffect(() => {
    // set the flyout to appear at the edge of the nav, which is its parent
    if (parentRef && parentRef.current) {
      setLeft(parentRef.current.clientWidth);
    }
    // add a listener so we can handle closing on an outside click
    if (showing) document.addEventListener('mousedown', handleClickOutside);
    if (navContext.scrollRef?.current && !scrolled) {
      navContext.scrollRef.current.style.scrollMargin = '15.625rem';
      navContext.scrollRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
      setScrolled(!scrolled);
    }
    // if the history changes, close the flyout
    // const unlisten = history.listen(() => {
    //   setShow(false);
    // });
    // what to do when the flyout is destroyed
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // unlisten();
    };
  });

  const handleClickOutside = (e: Event) => {
    if (parentRef.current && parentRef.current.contains(e.target as Element)) {
      return;
    }
    // Outside click
    setShow(false);
  };

  const handleClick = () => {
    switch (navContext.navFlyoutType) {
      case NavFlyoutType.Fleet:
        history.push(JBTRoutes.fleet);
        break;
      case NavFlyoutType.Maintenance:
        history.push(JBTRoutes.maintenanceService);
        break;
      case NavFlyoutType.Parts:
        history.push(JBTRoutes.parts);
        break;
      default:
        break;
    }
  };

  const sortedPlantsByName = plants ? [...plants].sort((a, b) => a.name.localeCompare(b.name)) : [];
  const sortedOrganizationsByName = organizations
    ? [...organizations].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return ReactDOM.createPortal(
    <Root
      style={{
        top: 0,
        left: left
      }}
      tabIndex={0}
    >
      <Header highlightColor={highlightColor} color={navFlyoutHighlight.fontColor as string}>
        <HeaderText>
          <Typography variant="h2">
            {t(navContext.navFlyoutType as string, { ns: ['common'] })}
          </Typography>
        </HeaderText>
        <IconContainer>
          <FontAwesomeIcon
            color={theme.colors.white}
            icon={faChevronCircleRight}
            onClick={handleClick}
          />
        </IconContainer>
      </Header>
      {subItems?.map((item) => {
        if (item.useFleetMenu) {
          return (
            <SubItemsRowRoot
              backgroundColor={getBackgroundColor()}
              key={item.id}
              onClick={() => {
                history.push(item.link as string);
                navContext.setShowFlyout(false);
              }}
            >
              <SubItem>
                <ItemIcon iconColor={theme.colors.icons.sidenav.fill}>
                  {item.icon ? (
                    item.icon.iconType === 'fa' ? (
                      <FontAwesomeIcon icon={item.icon.iconElement as IconProp} />
                    ) : (
                      (item.icon.iconElement as (color?: string) => JSX.Element)(
                        theme.colors.icons.sidenav.fill
                      )
                    )
                  ) : null}
                </ItemIcon>
                <ItemLabel fontColor={theme.colors.text.darkgray}>
                  {t(item.label, { ns: ['common'] })}
                </ItemLabel>
              </SubItem>
            </SubItemsRowRoot>
          );
        }
      })}
      <FlyoutBody>
        {process.env.REACT_APP_SIDENAV_ENABLE_ORG_LEVEL === 'true' ? (
          <OrganizationCollapse
            organizations={sortedOrganizationsByName}
            isLoading={organizationsLoading}
          />
        ) : (
          <PlantNameCollapse plants={sortedPlantsByName} isLoading={plantsLoading} />
        )}
      </FlyoutBody>
    </Root>,
    parentRef?.current || document.body
  );
};

export default NavFlyout;
