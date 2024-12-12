import React from 'react';
import { useTranslation } from 'react-i18next';

//Components
import { RadioButton, Switch, Typography } from 'components';
import { Dropdown } from './Dropdown';
import { CheckboxWrapper, ToggleInput } from './index.elements';
import { useTheme } from 'styled-components';
import { AlertEnumTypes, TTrigger } from 'types/machine-health/alerts';

interface TriggerAlertProps {
  classname?: string;
  label?: string;
  handleUpdate?: (val: string) => void;
  alertFrequencyUnits: AlertEnumTypes['alertFrequencyUnits'];
  alertTriggerTypes: AlertEnumTypes['triggerType'];
  onDropdownChange: (key: string, value: string | number) => void;
  isTriggerEnabled: boolean;
  triggerValues: TTrigger;
  onRadioAndTriggerHandleChange: (key: string) => void;
}

const TriggerAlert = ({
  classname,
  label,
  alertFrequencyUnits,
  alertTriggerTypes,
  onDropdownChange,
  isTriggerEnabled,
  triggerValues,
  onRadioAndTriggerHandleChange
}: TriggerAlertProps): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const theme = useTheme();
  const onDropdownValueChange = (val: string) => {
    onDropdownChange('units', val);
  };

  const radios =
    alertTriggerTypes &&
    alertTriggerTypes.length > 0 &&
    alertTriggerTypes.map((item, index) => {
      return (
        <RadioButton
          key={`triggerFormat${index}`}
          id={`triggerFormat${index}`}
          checked={triggerValues.type === item ? true : false}
          label={t(`${item?.toLowerCase()}`) as string}
          labelWeight={400}
          onChange={() => item && onDropdownChange('type', item)}
        />
      );
    });

  return (
    <div className={`radioInput-container ${classname}`}>
      <div className="radioInput-container--label label">
        <ToggleInput toggleSize={16}>
          <div className="row">
            <CheckboxWrapper>
              <Typography variant="inputlabel">{t(`${label}`)}</Typography>
              <Switch
                checked={isTriggerEnabled}
                onChange={() => {
                  onRadioAndTriggerHandleChange('trigger');
                }}
                offColor={theme.colors.mediumGrey2}
              />
            </CheckboxWrapper>
          </div>
        </ToggleInput>
      </div>
      {isTriggerEnabled ? (
        <>
          <div className="radioInput-container--wrapper">
            <div className="radioInput-container--wrapper--input">{radios}</div>
          </div>
          <div className="radioInput-container--wrapper range">
            {triggerValues.type === 'MATCHES' ? (
              <div className={`${triggerValues.type === 'MATCHES' ? 'matches active' : 'matches'}`}>
                <input
                  type="number"
                  value={triggerValues.value}
                  min="1"
                  max="1000"
                  name="Matches"
                  className={`${triggerValues.type === 'MATCHES' ? 'matches active' : 'matches'}`}
                  onChange={(e) => onDropdownChange('value', e.target.value)}
                ></input>
              </div>
            ) : null}

            {triggerValues.type === 'DURATION' ? (
              <div
                className={`${triggerValues.type === 'DURATION' ? 'duration active' : 'duration'}`}
              >
                <input
                  type="number"
                  value={triggerValues.value}
                  min="1"
                  max="1000"
                  name="Duration"
                  className={`${
                    triggerValues.type === 'DURATION' ? 'duration--input active' : 'duration--input'
                  }`}
                  onChange={(e) => onDropdownChange('value', e.target.value)}
                ></input>
                <div>
                  <Dropdown
                    vals={alertFrequencyUnits}
                    onDropdownChange={onDropdownValueChange}
                    value={triggerValues.units}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default TriggerAlert;
