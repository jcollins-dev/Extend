// 3rd party
import React, { ReactElement, useRef, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

// Constants
import breakpoint from 'constants/breakpoints';

// Components
import { SidenavItem, PermissionWrapper, SidenavUser } from 'components';

// Types
import { Role, SidenavItemProps, UserScopes } from 'types';

// Theme
import theme from 'themes';
import NavFlyout from './NavFlyout';
import { includes, isEqual } from 'lodash';
import { PermissionScopeName } from 'types/user-management';
import { useFleetNavigation } from 'providers';
import { useReport } from 'selectors';

// Icons
import expandIcon from 'icons/expand.svg';
import expandBlue from 'icons/expand-blue.svg';
import collapseBlue from 'icons/collapse-blue.svg';

import { useGetUserQuery } from 'api';

const Root = styled.div`
  position: fixed;
  overflow: hidden;
  z-index: 900;
  height: -webkit-fill-available;
  width: 12vw;
  background-color: ${theme.colors.lightGrey3};
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: space-between;
  transition: width 0.5s;
  transition: overflow 0.5s;

  @media ${breakpoint.device.lg} {
    width: 4.675rem;
    overflow: visible;
  }

  &:hover {
    width: 4.675rem;
    overflow: visible;
  }

  &:last-child {
    border-bottom: 0.0625rem solid gray;
  }
`;

const Icon = styled.div`
  cursor: pointer;
  width: 100%;
  height: 56px;
  padding: 21px 1.5rem 0 1.25rem;
`;

interface SidebarNavProps {
  items: SidenavItemProps[];
  role?: Role.Admin | Role.User;
  toggleContent?: boolean;
  setToggleContent?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarNav = ({
  items,
  role,
  toggleContent,
  setToggleContent
}: SidebarNavProps): ReactElement => {
  const history = useHistory();
  const navContext = useFleetNavigation();
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [open, setOpen] = useState(0);
  const [isHover, setIsHover] = useState(false);

  const navBaseRef = useRef<HTMLDivElement>(null);
  const toggle = (id: number) => setOpen(id);
  const reportInfo = useReport();

  const { data: user } = useGetUserQuery();
  const getModifiedItems = (items: SidenavItemProps[], role?: string) => {
    switch (role) {
      case 'user':
        if (user) {
          const machineId = user?.machines[0];
          const reportObjIdx = items.findIndex((item: SidenavItemProps) => item?.id === 19);
          items[reportObjIdx].visible = true;
          const newLink = items[reportObjIdx].link?.replace('fleet/machine/:machineId', machineId);
          items[reportObjIdx].link = newLink;
        }
        return items;
      case 'admin':
        if (reportInfo?.isReportValid) {
          const reportObjIdx = items.findIndex((item: SidenavItemProps) => item?.id === 19);
          items[reportObjIdx].visible = true;
          let newLink = items[reportObjIdx].link?.replace(':machineId', reportInfo.machineId);
          const regex = /machine.*reports/;
          if (!newLink?.includes(reportInfo.machineId)) {
            newLink = newLink?.replace(regex, `machine/${reportInfo.machineId}/reports`);
          }
          items[reportObjIdx].link = newLink;
        } else {
          items = items.filter((item: SidenavItemProps) => item?.id !== 19);
        }
        return items;
      default:
        return items;
    }
  };

  items = getModifiedItems(items, role);

  const handleBarClick = () => {
    if (setToggleContent) {
      setToggleContent(!toggleContent);
    }
  };

  const handleHover = () => {
    setIsHover(true);
  };
  const removeHover = () => {
    setIsHover(false);
  };
  return (
    <Root
      style={{ width: !toggleContent ? '16.325rem' : '4.325rem' }}
      onMouseEnter={() => {
        setExpanded(true);
      }}
      onMouseLeave={() => {
        setExpanded(false);
      }}
      ref={navBaseRef}
    >
      <div className="nav-wrapper">
        {!toggleContent ? (
          <div onClick={handleBarClick}>
            <Icon onMouseEnter={handleHover} onMouseLeave={removeHover}>
              <img src={isHover ? expandBlue : expandIcon} />

              {/* (icon.iconElement as (color?: string) => JSX.Element)(getIconColor()) */}
            </Icon>
          </div>
        ) : (
          <Icon onMouseEnter={handleHover} onMouseLeave={removeHover}>
            {isHover ? (
              <div onClick={handleBarClick}>
                <img src={collapseBlue} />
              </div>
            ) : (
              <div onClick={handleBarClick}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_2292_415)">
                    <path
                      d="M21 5L3 5"
                      stroke="#323130"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 12H11"
                      stroke="#323130"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 19L3 19"
                      stroke="#323130"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 9L7 12L4 15"
                      stroke="#323130"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2292_415">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            )}
          </Icon>
        )}
        {items.map((item, i: number) => {
          if (item.authorisedGroups && !includes(item.authorisedGroups, role)) return;
          if (item.visible !== undefined && !item.visible) return;
          // manually override the behavior of the fleet route
          if (item.useFleetMenu) {
            return (
              <PermissionWrapper page={item.name} key={`nav-${item.label}`} scope={UserScopes.Read}>
                <SidenavItem
                  id={item.id}
                  icon={item.icon}
                  label={item.label}
                  link={item.link}
                  isLast={i === items.length - 1}
                  isExpanded={isExpanded}
                  setExpanded={setExpanded}
                  toggleContent={toggleContent}
                  clickOverride={() => {
                    item.fleetLinks &&
                      !isEqual(item.fleetLinks, navContext.entityLinks) &&
                      navContext.setEntityLinks(item.fleetLinks);
                    if (
                      parseFloat(process.env.REACT_APP_NAV_VERSION as string) >= 2 &&
                      navContext.navId !== item.id
                    ) {
                      navContext.setNavId(item.id);
                      navContext.setNavFlyoutType(item.label);
                      if (navContext.entity) {
                        const etype = navContext.entity.type;
                        const link = etype && item.fleetLinks?.[etype];
                        const idvar = `:${etype}Id`;
                        history.push(link?.replace(idvar, navContext.entity.id) ?? '');
                      }
                      navContext.setShowFlyout(true);
                    } else {
                      navContext.setShowFlyout(!navContext.showFlyout);
                    }
                  }}
                  currentOpenSubMenu={open}
                  toggleSubMenu={toggle}
                />
              </PermissionWrapper>
            );
          } else {
            return (
              <PermissionWrapper
                page={item.name}
                key={`nav-${item.label}`}
                scope={UserScopes.Read}
                role={
                  item.name === PermissionScopeName.USER_MANAGEMENT ||
                  item.name === PermissionScopeName.MACHINE_MANAGEMENT
                    ? Role.Admin
                    : Role.User
                }
              >
                <SidenavItem
                  id={item.id}
                  icon={item.icon}
                  label={item.label}
                  link={item.link}
                  subItems={item.subItems}
                  isLast={i === items.length - 1}
                  isExpanded={isExpanded}
                  setExpanded={setExpanded}
                  currentOpenSubMenu={open}
                  toggleSubMenu={toggle}
                  toggleContent={toggleContent}
                />
              </PermissionWrapper>
            );
          }
        })}
      </div>
      <div>
        {navContext.showFlyout && (
          <NavFlyout
            parentRef={navBaseRef}
            showing={navContext.showFlyout}
            setShow={navContext.setShowFlyout}
          />
        )}
        {/* Disabling the Link to settings as logout would be in profile section in header */}
        {/* <SidenavItem
          id={100}
          icon={{ iconElement: faCog, iconType: 'fa' }}
          label={NavFlyoutType.Settings}
          link={JBTRoutes.settings}
          setExpanded={setExpanded}
          currentOpenSubMenu={open}
          toggleSubMenu={toggle}
          toggleContent={toggleContent}
        /> */}
        <SidenavUser toggleContent={toggleContent} />
      </div>
    </Root>
  );
};

export default SidebarNav;
