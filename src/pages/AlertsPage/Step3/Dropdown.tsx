import React from 'react';
import { BaseSelect } from 'components';
import {
  CustomContentRenderer,
  CustomDropdownRenderer
} from 'components/machine-health/configurator/WidgetTable/Dropdown';
import { capitalizeFirst } from 'helpers';
import { useTranslation } from 'react-i18next';
import { WidgetTableDropdownItem } from 'types/machine-health';
import { AlertEnumTypes } from 'types/machine-health/alerts';

interface DropdownProps {
  vals: AlertEnumTypes['alertFrequencyUnits'] | AlertEnumTypes['reminderUnits'];
  onDropdownChange: (val: string) => void;
  value?: string;
}

export const Dropdown = ({ vals, onDropdownChange, value }: DropdownProps): JSX.Element => {
  const { t } = useTranslation(['mh']);

  const values =
    vals &&
    vals.length > 0 &&
    vals.map((item) => ({
      value: item,
      label: capitalizeFirst(item.toLocaleLowerCase() as string)
    }));

  return (
    <div className="dropdown">
      <BaseSelect
        contentRenderer={({ id }: Record<string, unknown>) => (
          <CustomContentRenderer item={id as unknown as WidgetTableDropdownItem} />
        )}
        dropdownRenderer={(props, state, methods) => (
          <CustomDropdownRenderer props={props} state={state} methods={methods} />
        )}
        handleChange={(e) => {
          const val = e.target.value as string;
          return val && onDropdownChange(val);
        }}
        labelField="id"
        options={values as { value: string; label: string }[]}
        optionsKeysFormatted={false}
        placeholder={t('unit') as string}
        searchable={false}
        searchBy="label"
        value={value || ''}
        valueField="id"
      />
    </div>
  );
};
