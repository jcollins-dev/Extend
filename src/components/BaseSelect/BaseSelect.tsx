import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import { faExclamationCircle, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputLabel, TooltipWrapper } from 'components';
import { InputVariant, SelectChangeHandler } from 'types';
import SearcheableSelect, { SelectMethods, SelectProps, SelectState } from 'react-dropdown-select';
import theme from 'themes';

interface BaseSelectProps extends InputVariant {
  contentRenderer?: (item: Record<string, unknown>) => ReactNode;
  disabledLabel?: string;
  dropdownRenderer?: (
    props: SelectProps<string | Record<string, unknown>>,
    state: SelectState<string | Record<string, unknown>>,
    methods: SelectMethods<string | Record<string, unknown>>
  ) => ReactElement;
  handleChange?: SelectChangeHandler;
  handleChangeSearch?: (value: (string | Record<string, unknown>)[]) => void;
  id?: string;
  label?: string;
  labelField?: string;
  mandatory?: boolean;
  noDataMessage?: string;
  options: string[] | { value?: string; label: string; id?: string }[];
  placeholder?: string;
  searchable?: boolean;
  searchBy?: string;
  value: string | Record<string, unknown>;
  valueField?: string;
  optionsKeysFormatted?: boolean;
  isRequied?: boolean;
  tooltipText?: string;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
  height: 2.5rem;
`;

const StyledSelect = styled.select<InputVariant>`
  position: relative;
  width: 100%;
  height: 100%;

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

  appearance: none;

  box-sizing: border-box;
  border-radius: 0.375rem;
  border: ${(props) => props.theme.colors.borders.border02.border || '0.0625rem solid #D8DDe3'};
  box-shadow: ${(props) => props.theme.colors.borders.border02.shadow || 'none'};

  padding: 0 1.125rem 0 0.75rem;

  &::after {
    content: '▼';
    font-size: 1rem;
    top: 6px;
    right: 10px;
    position: absolute;
  }
`;

const StyledSearcheableSelect = StyledSelect.withComponent(styled(SearcheableSelect)<InputVariant>`
  &::after {
    content: '' !important;
  }
  min-height: 2.5rem !important;
  border-radius: 0.375rem !important;

  font-family: ${(props) => props.theme.typography.family || 'sans-serif'};
  font-size: ${(props) => props.theme.typography.components.input.size || '0.875rem !important'};
  line-height: ${(props) =>
    props.theme.typography.components.input.lineHeight || '1.125rem  !important'};

  border: ${(props) => {
    if (props.borderVariant && props.borderVariant === 'none') {
      return 'none';
    } else if (props.borderVariant && props.borderVariant === 'error') {
      return props.theme.colors.borders.error.border;
    }
    return props.theme.colors.borders.border02.border || '0.0625rem solid #D8DDe3 !important';
  }};
  box-shadow: ${(props) => props.theme.colors.borders.border02.shadow || 'none !important'};
`);

const SelectIcon = styled.div<InputVariant>`
  position: absolute;
  right: 0;
  top: 0;
  font-size: 1rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  pointer-events: none;

  color: ${(props) =>
    props.variant && props.variant === 'disabled'
      ? props.theme.colors.disabled.dark.fill
      : props.theme.colors.icons.dark.fill || '#303E47'};
`;

const WarningIconContainer = styled.div`
  cursor: pointer;
  position: absolute;
  right: 1.5rem;
  top: 0.875rem;
`;

const BaseSelect = ({
  contentRenderer,
  disabledLabel,
  dropdownRenderer,
  handleChange,
  handleChangeSearch,
  id,
  label,
  isRequied,
  tooltipText,
  labelField,
  mandatory,
  noDataMessage = '',
  options,
  optionsKeysFormatted,
  placeholder,
  searchable,
  searchBy,
  value,
  valueField,
  variant = 'gray',
  borderVariant
}: BaseSelectProps): ReactElement => {
  const noDataRenderer = () => <p style={{ textAlign: 'center' }}>{noDataMessage}</p>;

  return (
    <>
      {label && (
        <InputLabel id={id} mandatory={mandatory}>
          {label}
        </InputLabel>
      )}
      <SelectContainer>
        {searchable ? (
          <StyledSearcheableSelect
            contentRenderer={
              contentRenderer
                ? ({ props }) => (
                    <div>{contentRenderer(props.values[0] as Record<string, unknown>)}</div>
                  )
                : undefined
            }
            disabled={variant === 'disabled'}
            disabledLabel={disabledLabel}
            dropdownHandle={false}
            dropdownHandleRenderer={() => <span />}
            dropdownRenderer={
              dropdownRenderer
                ? ({ props, state, methods }) => (
                    // @ts-expect-error: library uses disallowed 'object' type
                    <div>{dropdownRenderer(props, state, methods)}</div>
                  )
                : undefined
            }
            labelField={labelField}
            noDataRenderer={noDataRenderer}
            // @ts-expect-error: library type check different
            onChange={handleChangeSearch}
            options={options}
            placeholder={placeholder}
            searchBy={searchBy}
            valueField={valueField}
            values={value ? [value] : []}
            variant={variant}
            borderVariant={borderVariant}
          />
        ) : (
          <StyledSelect
            id={id}
            onChange={handleChange}
            value={value as string}
            variant={variant}
            disabled={variant === 'disabled'}
          >
            {placeholder && (
              <option key="item-empty" value={''}>
                {placeholder}
              </option>
            )}
            {options &&
              options?.map((option, i) => {
                let value;
                let label;
                if (typeof option === 'string') {
                  value = option;
                  label = option;
                } else {
                  value = option.value;
                  label = option.label;
                }

                if (!optionsKeysFormatted) {
                  return (
                    <option key={`option${i}`} value={value}>
                      {label}
                    </option>
                  );
                }

                return (
                  <option key={(value as string).toLowerCase().replaceAll(' ', '-')} value={value}>
                    {label}
                  </option>
                );
              })}
          </StyledSelect>
        )}
        {isRequied
          ? value.length === 0 && (
              <WarningIconContainer>
                <TooltipWrapper Tooltip={tooltipText}>
                  <FontAwesomeIcon
                    fontSize="0.75rem"
                    color={theme.colors.negativeRed}
                    icon={faExclamationCircle}
                  />
                </TooltipWrapper>
              </WarningIconContainer>
            )
          : null}
        <SelectIcon variant={variant}>
          <FontAwesomeIcon icon={faSortDown} />
        </SelectIcon>
      </SelectContainer>
    </>
  );
};

export default BaseSelect;
