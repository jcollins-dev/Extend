import { BaseSelect, Typography } from 'components';
import {
  CustomContentRenderer,
  CustomDropdownRenderer
} from 'components/machine-health/configurator/WidgetTable/Dropdown';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WidgetTableDropdownItem } from 'types/machine-health';

interface DropdownSelectProps {
  values: { value: string | number; label: string }[];
  label?: string;
  classname?: string;
  placeholder?: string;
  isDisabled?: boolean;
}

export const DropdownSelect = ({
  values,
  label,
  classname,
  placeholder,
  isDisabled
}: DropdownSelectProps): JSX.Element => {
  const [value, setValue] = useState<string | Record<string, unknown>>('');

  const options = Object.entries(values).map(([value, label]) => ({
    id: value,
    values: label,
    label: value
  }));

  const { t } = useTranslation(['mh']);

  return (
    <div className={`dropdown-container ${classname}`}>
      <div className="dropdown-container--label">
        <Typography variant="inputlabel">{t(`${label}`)}:</Typography>
      </div>
      <div className="dropdown-container--input">
        <BaseSelect
          contentRenderer={({ id }: Record<string, unknown>) => (
            <CustomContentRenderer item={id as unknown as WidgetTableDropdownItem} />
          )}
          dropdownRenderer={(props, state, methods) => (
            <CustomDropdownRenderer props={props} state={state} methods={methods} />
          )}
          handleChange={(e) => {
            const val = e.target.value as string;
            return val && setValue(val);
          }}
          labelField="id"
          options={
            options as {
              values: { value: string | number; label: string };
              label: string;
              id: string;
            }[]
          }
          optionsKeysFormatted={false}
          placeholder={t(`${placeholder}`) as string}
          searchable={false}
          searchBy="label"
          value={value}
          valueField="id"
          variant={isDisabled ? 'disabled' : 'gray'}
        />
      </div>
    </div>
  );
};
