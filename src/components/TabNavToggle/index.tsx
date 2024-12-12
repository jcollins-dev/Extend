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

const TabNavToggleList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  margin: 0.5rem;
  border: 1px solid #9dcaeb;
  border-radius: 4px;
  li:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  li:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

const TabNavToggleItem = styled.li<{ active?: boolean; isTabEnabled?: boolean }>`
  flex: 1;
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-align: center;
  margin: ${({ active }) => (active ? '-1px' : `0`)};
  background-color: ${({ active, theme }) => (active ? theme.colors.primaryBlue5 : `transparent`)};
  border-radius: 4px;
  cursor: ${({ isTabEnabled }) => (isTabEnabled ? 'pointer' : 'not-allowed')};
  span {
    opacity: ${({ isTabEnabled }) => (isTabEnabled ? 1 : 0.4)};
    color: ${({ active, theme }) => (active ? theme.colors.white : theme.colors.black)};
    font-weight: 500;
  }
`;

const FlyoutNavItem = styled.li<{ active?: boolean }>`
  flex: 1;
  padding: 0.5rem 1rem;
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

// Toggle navbar for Alert Logic's ValueEditor component
const TabNavToggle = ({ items, isFlyoutNav = false }: Props): JSX.Element => {
  return (
    <nav>
      <TabNavToggleList>
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
            <TabNavToggleItem
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
            </TabNavToggleItem>
          )
        )}
      </TabNavToggleList>
    </nav>
  );
};

export default TabNavToggle;
