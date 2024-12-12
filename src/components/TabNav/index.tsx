// 3rd party libs
import React from 'react';
import styled from 'styled-components';

// Components
import { Typography } from 'components';

export interface TabNavItem {
  label: string;
  active?: boolean;
  isTabEnabled: boolean;
  onClick: () => void;
}

interface Props {
  items: TabNavItem[];
  isFlyoutNav?: boolean;
}

const List = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li<{ active?: boolean; isTabEnabled?: boolean }>`
  flex: 1;
  padding: 1rem;
  cursor: pointer;
  text-align: center;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.mediumBlue4 : `${theme.colors.mediumBlue4}50`};
  border-bottom: ${({ active, theme }) =>
    active ? `0.125rem solid ${theme.colors.mediumBlue}` : 'none'};
  cursor: ${({ isTabEnabled }) => (isTabEnabled ? 'pointer' : 'not-allowed')};

  span {
    opacity: ${({ isTabEnabled }) => (isTabEnabled ? 1 : 0.4)};
  }
`;

const FlyoutNavItem = styled.li<{ active?: boolean }>`
  flex: 1;
  padding: 1rem;
  cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};
  text-align: center;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.white : theme.colors.lightGrey1};
  border-bottom: ${({ active, theme }) =>
    active ? 'none' : `0.06125rem solid ${theme.colors.mediumGrey1}`};
  border-top: ${({ active, theme }) =>
    active
      ? `0.125rem solid ${theme.colors.mediumBlue}`
      : `0.06125rem solid ${theme.colors.mediumGrey1}`};
`;

const TabNav = ({ items, isFlyoutNav = false }: Props): JSX.Element => {
  return (
    <nav>
      <List>
        {items.map((item) =>
          isFlyoutNav ? (
            <FlyoutNavItem active={item.active} onClick={item.onClick} key={item.label}>
              <Typography
                as="span"
                weight="bold"
                mb={0}
                color={item.active ? 'mediumBlue' : 'darkGrey'}
              >
                {item.label}
              </Typography>
            </FlyoutNavItem>
          ) : (
            <NavItem
              active={item.active}
              isTabEnabled={item.isTabEnabled}
              onClick={item.onClick}
              key={item.label}
            >
              <Typography
                as="span"
                weight="bold"
                mb={0}
                color={item.active ? 'mediumBlue' : 'darkGrey'}
              >
                {item.label}
              </Typography>
            </NavItem>
          )
        )}
      </List>
    </nav>
  );
};

export default TabNav;
