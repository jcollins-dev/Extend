// 3rd party libs
import React, { ReactElement, useState, useReducer } from 'react';
import styled from 'styled-components';

// Components
import { TabNav } from 'components';
import {
  UserManagementTable,
  UserManagementModal,
  GroupModal
} from 'pages/UserManagement/components';

// Types
import { Id } from 'types';
import { UserManagementTableType } from 'types/user-management';

// Styling
const Container = styled.div`
  width: 100%;
  padding: 1.5rem 3.125rem 0 3.125rem;
  margin-top: 2rem;
`;

// Types
interface FlyoutState {
  isOpen: boolean;
  flyoutType: UserManagementTableType;
  flyoutId?: Id;
}

type FlyoutAction =
  | { type: 'close' }
  | { type: 'open'; flyoutType: UserManagementTableType; flyoutItemId?: Id };

const initialFlyoutState = {
  isOpen: false,
  flyoutType: UserManagementTableType.GROUP,
  flyoutItemId: null
};

const reducer = (state: FlyoutState, action: FlyoutAction) => {
  switch (action.type) {
    case 'close':
      return { ...state, isOpen: false };
    case 'open':
      return {
        ...state,
        isOpen: true,
        flyoutType: action.flyoutType,
        flyoutId: action.flyoutItemId
      };
    default:
      return state;
  }
};

const UserManagement = (): ReactElement => {
  const [currentTab, setCurrentTab] = useState<string>('0');
  const [flyoutState, dispatch] = useReducer(reducer, initialFlyoutState);
  return (
    <>
      {/* mock for now based on mockups, to adjust later according to path and Ids*/}
      <TabNav
        items={[
          {
            label: 'Groups',
            onClick: () => {
              setCurrentTab('0');
            },
            active: currentTab === '0',
            isTabEnabled: true
          },
          {
            label: 'Users',
            onClick: () => {
              setCurrentTab('1');
            },
            active: currentTab === '1',
            isTabEnabled: true
          }
        ]}
      />
      <Container>
        <UserManagementTable
          onClickButton={(flyoutType: UserManagementTableType, flyoutItemId?: Id) => {
            dispatch({ type: 'open', flyoutType, flyoutItemId });
          }}
          tableType={
            currentTab === '0' ? UserManagementTableType.GROUP : UserManagementTableType.USER
          }
        />
        {flyoutState.flyoutType === UserManagementTableType.GROUP ? (
          <GroupModal
            open={flyoutState.isOpen}
            setIsOpenModal={() => {
              dispatch({ type: 'close' });
            }}
            tableItemId={flyoutState.flyoutId}
          />
        ) : (
          <UserManagementModal
            tableType={flyoutState.flyoutType}
            open={flyoutState.isOpen}
            setIsOpenModal={() => dispatch({ type: 'close' })}
            tableItemId={flyoutState.flyoutId}
          />
        )}
      </Container>
    </>
  );
};

export default UserManagement;
