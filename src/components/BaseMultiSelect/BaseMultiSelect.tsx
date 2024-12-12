import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputLabel } from 'components';
import { InputVariant } from 'types';
import Select, { DropdownIndicatorProps, StylesConfig } from 'react-select';
import { components, OptionProps } from 'react-select';

interface BaseMultiSelectProps extends InputVariant {
  value?: string;
  options: { value: string; label: string }[];
  handleChange: (values: string[]) => void;
  placeholder?: string;
  id?: string;
  label?: string;
  multi?: boolean;
  disabled?: boolean;
}

const SelectContainer = styled.div`
  position: relative;
  height: 2.5rem;
  max-height: 100%;
  display: flex;
`;

const StyledSelect = styled(Select)<InputVariant>`
  height: 100%;
  display: flex;

  font-family: ${(props) => props.theme.typography.family || 'sans-serif'};
  font-size: ${(props) => props.theme.typography.components.input.size || '0.875rem'};
  line-height: ${(props) => props.theme.typography.components.input.lineHeight || '1.125rem'};
  font-weight: ${(props) => props.theme.typography.components.input.weight || '500'};
  color: ${(props) =>
    props.variant && props.variant === 'disabled'
      ? props.theme.colors.disabled.light.fill
      : props.theme.colors.field.select.enabled || '#5D6A86'};
  background-color: ${(props) =>
    props.variant
      ? props.variant === 'disabled'
        ? props.theme.colors.field.disabled.fill
        : props.variant === 'white'
        ? props.theme.colors.field.white.fill
        : props.theme.colors.field.grey.fill || 'rgb(244, 247, 249)'
      : 'transparent'};

  cursor: ${(props) => (props.variant && props.variant === 'disabled' ? 'not-allowed' : 'auto')};

  padding: 0 1.125rem 0 0.75rem;
`;

const SelectIcon = styled.div<InputVariant>`
  color: ${(props) =>
    props.variant && props.variant === 'disabled'
      ? props.theme.colors.disabled.dark.fill
      : props.theme.colors.icons.dark.fill || '#303E47'};
`;

const BaseMultiSelect = ({
  options,
  handleChange,
  placeholder,
  label,
  multi,
  disabled
}: BaseMultiSelectProps): ReactElement => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const checkIfSelected = (label: string) => {
    return selectedOptions.some((item) => label === item);
  };

  const Option = (props: OptionProps) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={checkIfSelected(props.label)}
            onChange={() => {
              if (!multi && props.hasValue) {
                props.clearValue();
              }
            }}
          />{' '}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  const DropdownIndicator = (props: DropdownIndicatorProps) => {
    return (
      <components.DropdownIndicator {...props}>
        <SelectIcon variant={'gray'}>
          <FontAwesomeIcon icon={faSortDown} />
        </SelectIcon>
      </components.DropdownIndicator>
    );
  };

  const style: StylesConfig<unknown, boolean> = {
    container: (base) => ({
      ...base,
      border: 'none',
      flexBasis: '100%',
      flexDirection: 'row',
      flex: '0 1 auto',
      whiteSpace: 'nowrap'
    }),
    valueContainer: (base) => ({
      ...base,
      display: 'flex',
      width: '80%',
      alignContent: 'center',
      justifyContent: 'center',
      height: '100%',
      overflow: 'auto',
      overflowX: 'hidden',
      overflowY: selectedOptions.length > 1 ? 'auto' : 'hidden'
    }),
    indicatorsContainer: (base) => ({
      ...base,
      width: '20%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: '.15rem',
      height: '100%'
    }),
    placeholder: (base) => ({
      ...base,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      display: 'inline-block'
    }),
    option: (base) => ({
      ...base,
      margin: '0.2rem'
    }),
    control: (base) => ({
      ...base,
      maxHeight: '100%',
      maxWidth: '100%',
      width: '8rem'
    }),
    multiValue: (base) => ({
      ...base
    }),
    menu: (base) => ({
      ...base,
      flex: '1',
      width: 'max-content',
      position: 'absolute',
      minWidth: 'max-content'
    }),
    input: (base) => ({
      ...base,
      margin: '0',
      padding: '0',
      height: '0',
      color: 'transparent'
    })
  };

  const handleMultiChange = (selected: { value: string; label: string }[]) => {
    setSelectedOptions(selected.map((item) => item.label));
    handleChange(selected.map((item) => item.value));
  };

  const handleSingleChange = (selected: { value: string; label: string } | undefined) => {
    if (selected) {
      handleChange([selected.value]);
      setSelectedOptions([selected.label]);
    } else {
      handleChange([]);
      setSelectedOptions([]);
    }
  };

  return (
    <>
      {label && <InputLabel>{label}</InputLabel>}
      <SelectContainer>
        <StyledSelect
          options={options}
          isMulti={multi}
          components={
            multi
              ? { Option, DropdownIndicator, IndicatorSeparator: () => null }
              : { DropdownIndicator, IndicatorSeparator: () => null }
          }
          styles={style}
          onChange={(e) => {
            multi
              ? handleMultiChange(e as { value: string; label: string }[])
              : handleSingleChange(e as { value: string; label: string });
          }}
          placeholder={placeholder}
          hideSelectedOptions={false}
          isClearable={false}
          isDisabled={disabled}
          menuPortalTarget={document.body}
        />
      </SelectContainer>
    </>
  );
};

export default BaseMultiSelect;
