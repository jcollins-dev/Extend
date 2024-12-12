import React, { ReactElement, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import { NavFlyoutType, SidenavItemProps } from 'types';
import { default as theme } from 'themes';
import { useFleetNavigation } from 'providers';
import { useTranslation } from 'react-i18next';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

interface NavItemProps {
  isSubItem?: boolean;
  isLast?: boolean;
  backgroundColor: string;
}

const NavItem = styled.div<NavItemProps>`
  background-color: ${(props) => props.backgroundColor};
  width: 100%;
  height: 3.375rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: ${(props) => props.theme.colors.borders.nav.border};
  border-bottom: ${(props) => (props.isLast ? props.theme.colors.borders.nav.border : 'none')};
  padding: ${(props) => (props.isSubItem ? '0.875rem 1.25rem 0.875rem 1.25rem' : '0 1.25rem')};
`;

const Item = styled.div`
  width: 16.25rem;
  display: flex;
  flex-direction: row;

  &:hover {
    cursor: pointer;
  }
`;

interface IconProps {
  iconColor: string;
}

interface LabelProps {
  fontColor: string;
}

const ItemIcon = styled.div<IconProps>`
  width: 2.675rem;
  font-size: 1.25rem;
  line-height: 2rem;
  color: ${(props) => props.iconColor};
  padding-right: 1rem;
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

const DrawerControl = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
`;

const IconContainer = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.2);

  &:hover {
    cursor: pointer;
  }
`;

const SubItemContainer = styled.div`
  z-index: 10;
  padding: 0;
  height: 0;
  position: relative;
  top: -3.375rem;
  left: 11.875rem;
`;

const SidenavItem = ({
  id,
  icon,
  label,
  link,
  subItems,
  isSubItem,
  isLast,
  isExpanded,
  setExpanded,
  currentOpenSubMenu,
  toggleSubMenu,
  clickOverride,
  toggleContent
}: SidenavItemProps): ReactElement => {
  // Get the hooks to change page and to
  const history = useHistory();
  const location = useLocation();
  const navContext = useFleetNavigation();
  const { t } = useTranslation(['common']);
  const isActive = link ? location.pathname.includes(link) : false;
  const [isOpen, setOpen] = useState<boolean>(false);
  const showHighlight =
    (isActive && navContext.entityPath?.machine === null && !navContext.showFlyout) ||
    (label === navContext.navFlyoutType && navContext.showFlyout) ||
    (label === navContext.navFlyoutType && navContext.entityPath?.machine !== null);
  const getFontColor = () => {
    return showHighlight ? theme.colors.text.white : theme.colors.text.darkgray;
  };
  const getIconColor = () => {
    return showHighlight ? theme.colors.text.white : theme.colors.icons.sidenav.fill;
  };
  const getMenuColor = () => {
    const navFlyoutHighlight = navContext.getFlyoutHighlight();
    let highlightColor = navFlyoutHighlight[
      navFlyoutHighlight.type as
        | NavFlyoutType.Fleet
        | NavFlyoutType.Parts
        | NavFlyoutType.Maintenance
    ] as string;
    highlightColor = highlightColor && !isActive ? highlightColor : theme.colors.text.active;
    return showHighlight ? highlightColor : theme.colors.lightGrey3;
  };

  useEffect(() => {
    if (!isExpanded) {
      setOpen(false);
    }
  }, [isExpanded]);

  const clickFunction =
    clickOverride !== undefined
      ? clickOverride
      : () => {
          navContext.setShowFlyout(false);
          if (link) {
            history.push(link);
          }
        };
  const checkItemFlyoutStatus = () => {
    const flyoutEnabledMenu: string[] = ['fleet', 'parts', 'maintenance'];
    if (!flyoutEnabledMenu.includes(label)) {
      navContext.setShowFlyout(false);
    }
  };
  return (
    <Root>
      <NavItem backgroundColor={getMenuColor()} isSubItem={isSubItem} isLast={isLast}>
        <Item
          role="link"
          onMouseEnter={() => {
            navContext.setNavFlyoutType(label);
            checkItemFlyoutStatus();
            if (toggleSubMenu) {
              toggleSubMenu(id);
            }
          }}
          onMouseLeave={() => {
            if (!navContext.showFlyout) {
              navContext.setNavFlyoutType(undefined);
            }
          }}
          onClick={() => clickFunction()}
        >
          <ItemIcon iconColor={getIconColor()}>
            {icon ? (
              icon.iconType === 'fa' ? (
                <FontAwesomeIcon icon={icon.iconElement as IconProp} />
              ) : (
                (icon.iconElement as (color?: string) => JSX.Element)(getIconColor())
              )
            ) : null}
          </ItemIcon>
          {!toggleContent && (
            <ItemLabel fontColor={getFontColor()}>{t(label, { ns: ['common'] })}</ItemLabel>
          )}
        </Item>
        {subItems ? (
          <DrawerControl
            className="drawer-control"
            onClick={() => {
              if (toggleSubMenu) {
                toggleSubMenu(id);
              }
              setOpen(!isOpen);
            }}
          >
            <IconContainer>
              <FontAwesomeIcon
                icon={currentOpenSubMenu === id && isOpen ? faCaretLeft : faCaretRight}
              />
            </IconContainer>
          </DrawerControl>
        ) : null}
      </NavItem>
      {currentOpenSubMenu && currentOpenSubMenu === id && isOpen && subItems ? (
        <SubItemContainer
          onMouseLeave={() => {
            if (toggleSubMenu) {
              toggleSubMenu(0);
            }
            setOpen(false);
          }}
        >
          {subItems.map((subItem, i) => {
            return (
              <SidenavItem
                id={subItem.id}
                key={`nav-${subItem.label}`}
                icon={subItem.icon}
                label={t(subItem.label, { ns: ['common'] })}
                link={subItem.link}
                subItems={subItem.subItems}
                isSubItem={true}
                isLast={i === subItems.length - 1}
                isExpanded={isExpanded}
                setExpanded={setExpanded}
              />
            );
          })}
        </SubItemContainer>
      ) : null}
    </Root>
  );
};

export default SidenavItem;
