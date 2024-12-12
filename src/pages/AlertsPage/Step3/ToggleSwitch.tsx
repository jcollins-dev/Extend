import React, { useState } from 'react';
import { CheckboxWrapper, ToggleInput } from './index.elements';
import { useTranslation } from 'react-i18next';
import {
  DropDownItem,
  GroupedOption
} from 'pages/ProteinMachine/MachineConfig/Common/Alerts/FormElementsTypes';
import { DropdownSubOptions } from './DropdownSubOptions';
import Asterisk from './Asterisk ';
import { Switch } from 'components';
import { useTheme } from 'styled-components';

const TestGroupUsers = [
  {
    label: 'Admin1',
    value: 'admin1'
  },
  {
    label: 'Admin2',
    value: 'admin2'
  },
  {
    label: 'Admin3',
    value: 'admin3'
  },
  {
    label: 'Admin4',
    value: 'admin4'
  }
];

export const usersOptions = [
  { value: 'user1', label: 'user1', color: '#00B8D9' },
  { value: 'user2', label: 'user2', color: '#0052CC' },
  { value: 'user3', label: 'user3', color: '#5243AA' },
  { value: 'user4', label: 'user4', color: '#FF5630' },
  { value: 'user5', label: 'user5', color: '#FF8B00' },
  { value: 'user6', label: 'user6', color: '#FFC400' },
  { value: 'user7', label: 'user7', color: '#36B37E' },
  { value: 'user8', label: 'user8', color: '#00875A' },
  { value: 'user9', label: 'user9', color: '#253858' },
  { value: 'user10', label: 'user10', color: '#666666' }
];

export const groupedOptions: GroupedOption[] = [
  {
    label: 'User',
    options: usersOptions
  },
  {
    label: 'Admins',
    options: TestGroupUsers
  }
];

interface Props {
  selected: boolean;
  toggleSelected: () => void;
}

export const ToggleButton = ({ selected, toggleSelected }: Props): JSX.Element => {
  return (
    <div className={`toggle-container ${selected ? '' : 'disabled'}`} onClick={toggleSelected}>
      <div className={`dialog-button ${selected ? '' : 'disabled'}`}></div>
    </div>
  );
};

export const NotificationsToggle = (): JSX.Element => {
  const [selectedNotifications, setSelectedNotifications] = useState(false);
  const [userGroups, setUserGroups] = useState<DropDownItem[]>([]);

  const { t } = useTranslation(['mh']);
  const theme = useTheme();
  const onNotificationsUserGroupsChange = (userGroup: DropDownItem[]) => {
    setUserGroups(userGroup);
  };

  return (
    <>
      <ToggleInput toggleSize={16}>
        <div className="row">
        <CheckboxWrapper>
        <p className="label">
            {`${t('notifications')}`} <Asterisk />
          </p>
          <Switch
            checked={selectedNotifications}
            onChange={() => {
              setSelectedNotifications((value) => !value);
            }}
            offColor={theme.colors.mediumGrey2}
            disabled
          />
        </CheckboxWrapper>
        </div>
      </ToggleInput>
      <DropdownSubOptions
        disabled={!selectedNotifications}
        ariaLabel={t('alert_select_users_groups') as string}
        options={TestGroupUsers}
        optionsWithHeaders={groupedOptions}
        handleMultiSelect={onNotificationsUserGroupsChange}
        value={userGroups}
        placeholder={t('alert_select_users_groups') as string}
      />
    </>
  );
};
