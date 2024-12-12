import React from 'react';
import { CheckboxWrapper, ToggleInput } from './index.elements';
import { Dropdown } from './Dropdown';
import { useTranslation } from 'react-i18next';
import { Switch } from 'components';
import { useTheme } from 'styled-components';
import { AlertEnumTypes, TReminder } from 'types/machine-health/alerts';

interface IReminder {
  alertReminderUnits: AlertEnumTypes['reminderUnits'];
  reminderValues: TReminder;
  onDropdownChange: (key: string, value: string | number) => void;
  setIsReminderEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isReminderEnabled: boolean;
}

const Reminder = ({
  alertReminderUnits,
  reminderValues,
  onDropdownChange,
  isReminderEnabled,
  setIsReminderEnabled
}: IReminder): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const theme = useTheme();
  const onDropdownValueChange = (val: string) => {
    onDropdownChange('units', val);
  };

  return (
    <>
      <ToggleInput toggleSize={16}>
        <CheckboxWrapper>
          <p className="label">{`${t('reminder')}`}</p>
          <Switch
            checked={isReminderEnabled}
            onChange={() => {
              setIsReminderEnabled((value) => !value);
            }}
            offColor={theme.colors.mediumGrey2}
          />
        </CheckboxWrapper>
      </ToggleInput>
      <div className="container-wrapper reminder">
        {isReminderEnabled && (
          <>
            <div className="row" style={{ justifyContent: 'flex-start', padding: '0rem' }}>
              <input
                type="number"
                min="1"
                max="1000"
                name="reminderValue"
                value={reminderValues.value}
                placeholder={`${t('value')}`}
                className="input--reminderValue"
                onChange={(e) => onDropdownChange('value', e.target.value)}
              ></input>
              <Dropdown
                vals={alertReminderUnits}
                value={reminderValues.units}
                onDropdownChange={onDropdownValueChange}
              />
            </div>
            <div className="row" style={{ justifyContent: 'flex-start', paddingTop: '0.5rem' }}>
              <input
                type="number"
                min="1"
                max="1000"
                name="reminderStopAfter"
                value={reminderValues.stop_after}
                placeholder={`${t('stop_after')}`}
                className="input--stopAfter"
                onChange={(e) => onDropdownChange('stop_after', e.target.value)}
              ></input>
              <p style={{ marginLeft: '0.5rem' }}>Reminders</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Reminder;
