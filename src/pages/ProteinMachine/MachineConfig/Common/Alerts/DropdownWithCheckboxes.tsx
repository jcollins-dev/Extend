//3rd party
import React, { useState, useEffect } from 'react';
import i18next from 'i18next';
import Select, { ClearIndicatorProps, MultiValue, components } from 'react-select';
import { CSSObject } from '@emotion/serialize';
import { DropDownItem, DropdownProps } from './FormElementsTypes';

const CustomClearText = () => <>{i18next.t('clear_all', { ns: 'common' })}</>;

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const ClearIndicator = (props: ClearIndicatorProps<any, true>) => {
  const {
    children = <CustomClearText />,
    innerProps: { ref, ...restInnerProps }
  } = props;
  return (
    <div {...restInnerProps} ref={ref}>
      <div style={{ padding: '0px 5px' }}>{children}</div>
    </div>
  );
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const DropdownIndicator = (props: ClearIndicatorProps<any, true>) => {
  const {
    innerProps: { ref, ...restInnerProps }
  } = props;
  return (
    <div style={{ padding: '0px 12px' }} {...restInnerProps} ref={ref}>
      <svg
        style={{ width: '10px' }}
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="sort-down"
        className="svg-inline--fa fa-sort-down "
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
      >
        <path
          fill="currentColor"
          d="M311.9 335.1l-132.4 136.8C174.1 477.3 167.1 480 160 480c-7.055 0-14.12-2.702-19.47-8.109l-132.4-136.8C-9.229 317.8 3.055 288 27.66 288h264.7C316.9 288 329.2 317.8 311.9 335.1z"
        ></path>
      </svg>
    </div>
  );
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const Option = (props: any) => {
  return (
    <div>
      <components.Option {...props}>
        <input type="checkbox" checked={props.isSelected} onChange={() => null} />{' '}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const ClearValues = (
  base: CSSObject,
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  state: ClearIndicatorProps<any>
): CSSObject => ({
  ...base,
  cursor: 'pointer',
  color: state.isFocused ? 'blue' : 'black'
});

export const DropdownWithCheckboxes = ({
  disabled,
  options,
  value,
  handleMultiSelect,
  ariaLabel,
  placeholder
}: DropdownProps): JSX.Element => {
  const [multiValue, setMultiValue] = useState<DropDownItem[]>(value);

  const handleInputOnChange = (e: MultiValue<DropDownItem>) => {
    setMultiValue([...e]);
  };

  useEffect(() => {
    handleMultiSelect(multiValue);
  }, [multiValue]);

  return (
    <Select
      isDisabled={disabled ? true : false}
      className={disabled ? 'dropdown_checkboxes select--disabled' : 'dropdown_checkboxes'}
      hideSelectedOptions={false}
      aria-label={ariaLabel}
      isClearable={false}
      closeMenuOnSelect={false}
      components={{
        Option,
        ClearIndicator,
        DropdownIndicator
      }}
      styles={{ clearIndicator: ClearValues }}
      defaultValue={multiValue}
      isMulti
      options={options}
      onChange={(e) => handleInputOnChange(e)}
      placeholder={placeholder}
    />
  );
};
