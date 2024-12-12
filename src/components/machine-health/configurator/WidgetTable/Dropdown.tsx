// 3rd party libraries
import React, { useEffect, useState } from 'react';
import { faChevronDown, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { useTheme } from 'styled-components';
import { SelectMethods, SelectProps, SelectState } from 'react-dropdown-select';
import { List, AutoSizer } from 'react-virtualized';
import { useTranslation } from 'react-i18next';

// Types
import { WidgetTableDropdownItem } from 'types/machine-health';
import { WidgetType } from 'types/protein';

// Components
import { StyledTableInput } from './Form';

// Constants
import { TagIdPrefix } from 'constants/machineConfig';
import { TagsDropdownItems } from 'types/machine-health/widget-table';
import BaseSelect from 'components/BaseSelect/BaseSelect';
import TabNavToggle from 'components/TabNavToggle';
import { debounce } from 'lodash';
import { TooltipWrapper } from 'components';
import { TDropdownValue } from 'components/AlertQueryBuilder/customComponents/CustomValueEditor';

export const StyledSelect = styled.select<{ color?: string }>`
  padding-left: 0.75rem;
  padding-right: 0.75rem;

  width: 100%;
`;

const StyledSelectWrapper = styled.div`
  align-items: center;
  border-radius: 0.5rem;
  border: ${({ theme }) => theme.colors.borders.border02.border};
  color: ${({ color, theme }) => color || theme.colors.table.primary};
  display: flex;
  flex-grow: 1;
  height: 2.25rem;
  outline: 0.125rem solid transparent;
  position: relative;
  transition: all 0.2s ease-in-out;

  select {
    display: none;
  }

  svg {
    font-size: 1rem;
  }

  &:hover,
  :active,
  :focus {
    border: 0.0625rem solid ${({ theme }) => theme.colors.mediumBlue};
    outline: 0.125rem solid ${({ theme }) => theme.colors.mediumBlue3};
  }
`;

const StyledSelectLabelButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  color: ${({ color, theme }) => color || theme.colors.mediumBlue};
  cursor: pointer;
  display: flex;
  font-family: ${({ theme }) => theme.typography.family};
  font-size: ${({ theme }) => theme.typography.components.tableHeader.size};
  height: 100%;
  justify-content: space-between;
  padding: 0 0.75rem;
  text-align: left;
  width: 100%;
`;

const StyledOption = styled.div<{
  active?: boolean;
  disabled?: boolean;
  onClick?: null | (() => void);
  style?: string;
}>`
  align-items: center;
  background-color: ${({ active, disabled, theme }) =>
    disabled ? theme.colors.lightGrey1 : active ? theme.colors.background.background10 : ''};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.colors.darkGrey};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;

  span {
    color: ${({ disabled, theme }) => disabled && theme.colors.mediumGrey2};
  }

  &:hover,
  :focus,
  :focus:hover {
    background-color: ${({ active, theme }) => !active && theme.colors.background.background2};
  }
`;

const StyledOptionWrapper = styled.div<{ isVisible: boolean }>`
  background-color: ${({ theme }) => theme.colors.background.background1};
  border-radius: 0.5rem;
  border: ${({ theme, isVisible }) => isVisible && theme.colors.borders.border02.border};
  box-shadow: ${({ theme, isVisible }) => isVisible && theme.colors.field.white.shadow};
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  display: flex;
  flex-direction: column;
  left: 0;
  max-height: ${({ isVisible }) => (isVisible ? '18rem' : '0')};
  overflow-y: auto;
  position: absolute;
  top: 2.5rem;
  width: 100%;
  z-index: 1;
`;

const StyledSpanWrapper = styled.span<{ color?: string }>`
  align-items: center;
  color: ${({ color, theme }) => color || theme.colors.darkGrey};
  display: flex;
  gap: 0.25rem;
`;

const StyledSpan = styled.span<{
  color?: string;
  isDisabledLabel?: boolean;
  padding?: string;
  isRequired?: boolean;
}>`
  border: ${({ isDisabledLabel, theme }) =>
    isDisabledLabel && '0.0625rem solid ' + theme.colors.lightGrey5};
  border-radius: ${({ isDisabledLabel }) => isDisabledLabel && '0.5rem'};
  color: ${({ color, theme }) => color || theme.colors.darkGrey};
  padding: ${({ padding }) => padding || 0};
  word-break: break-word;
  ${({ isRequired }) =>
    isRequired &&
    `
`}
`;

const StyledCircleSpan = styled.span`
  font-size: 2rem;
  padding-bottom: 0.35rem;
`;

const StyledSearch = styled.div`
  display: flex;
  flex-direction: column;
  input {
    margin: 0.5rem 0.5rem 0.125rem;
  }
`;

const ThresholdFieldContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  padding: 0.5rem;
  input {
    // margin: 0.5rem 0.5rem 0.125rem;
    cursor: text;
  }
  cursor: text;
`;

const StyledSearchAlertLogic = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  input {
    margin: 0.5rem 0.5rem 0.125rem;
  }
`;

const StyledOptions = styled(List)`
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0.5rem;
  max-height: 12rem;
`;

const StyledInputField = styled.input`
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.4rem;
  font-size: 1rem;
  width: 100%;
  cursor: pointer;
`;

const WarningIconContainer = styled.div`
  cursor: pointer;
  position: absolute;
  right: 1.5rem;
  top: 0.875rem;
`;

interface DropdownProps {
  selectedItem?: WidgetTableDropdownItem;
  onChangeCallback?: (value: WidgetTableDropdownItem) => void;
  options: WidgetTableDropdownItem[];
}

export const Dropdown = ({
  selectedItem,
  onChangeCallback,
  options
}: DropdownProps): JSX.Element => {
  const theme = useTheme();

  const [selectedTag, setSelectedTag] = useState<WidgetTableDropdownItem>({
    name: 'Select an item',
    id: '',
    type: WidgetType.None
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    selectedItem && setSelectedTag(selectedItem);
  }, [selectedItem]);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setOpen((prev) => !prev);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleValueChange = (option: WidgetTableDropdownItem) => {
    setSelectedTag(option);
  };

  const handleChange = (option: WidgetTableDropdownItem) => {
    handleValueChange(option);
    onChangeCallback?.(option);
    handleClose();
  };

  return (
    <StyledSelectWrapper>
      <StyledSelectLabelButton onClick={(e) => handleOpen(e)}>
        <StyledSpan
          color={
            selectedTag?.values?.[0]?.value ? theme.colors.onTrackGreen : theme.colors.mediumGrey3
          }
        >
          <StyledCircleSpan>•</StyledCircleSpan>
          {selectedTag.id.startsWith(TagIdPrefix) ? (
            <StyledSpan color={theme.colors.mediumGrey3}>Select a tag...</StyledSpan>
          ) : (
            <StyledSpan color={theme.colors.mediumBlue}>{selectedTag.id}</StyledSpan>
          )}
        </StyledSpan>
        <FontAwesomeIcon icon={faChevronDown} color={theme.colors.darkGrey} />
      </StyledSelectLabelButton>
      <StyledOptionWrapper isVisible={open}>
        {options.map((tag, index) => (
          <StyledOption
            active={tag.id === selectedTag.id}
            key={index}
            onClick={() => handleChange(tag)}
          >
            <StyledSpan>{tag.name || tag.id}</StyledSpan>
            {tag.values?.[0]?.value && (
              <StyledSpan color={theme.colors.mediumGrey2}>{tag.values[0].value}</StyledSpan>
            )}
          </StyledOption>
        ))}
      </StyledOptionWrapper>
    </StyledSelectWrapper>
  );
};

interface CustomDropdownProps {
  props: SelectProps<string | Record<string, unknown>>;
  state: SelectState<string | Record<string, unknown>>;
  methods: SelectMethods<string | Record<string, unknown>>;
}

interface CustomDropdownAlertLogicProps {
  props: SelectProps<string | Record<string, unknown>>;
  state: SelectState<string | Record<string, unknown>>;
  methods: SelectMethods<string | Record<string, unknown>>;
  thresholdType?: string;
}

// This component renders the content in the react-dropdown-select
export const CustomDropdownRenderer = ({
  props: selectProps,
  state,
  methods
}: CustomDropdownProps): JSX.Element | null => {
  const theme = useTheme();
  const regexp = new RegExp(state.search, 'i');
  const { t } = useTranslation(['mh']);
  const items = selectProps.options
    .filter((item) => {
      const typedItem = item as Record<string, unknown>;
      const searchBy = selectProps.searchBy as string;
      const labelField = selectProps.labelField as string;
      return (
        regexp.test(typedItem[searchBy] as string) || regexp.test(typedItem[labelField] as string)
      );
    })
    .filter((option) => selectProps.keepSelectedInList || !methods.isSelected(option));

  // Note about types in this component:
  // We are trusting that the react-dropdown-select library sends itself the correct types.
  // https://github.com/sanusart/react-dropdown-select/blob/master/docs/src/examples/CustomContentAndDropdown.js

  return (
    <StyledSearch>
      <StyledTableInput
        type="text"
        value={state.search}
        onChange={methods.setSearch}
        placeholder={t('search_for_tag') as string}
      />
      <AutoSizer style={{ height: '12rem' }}>
        {({ width, height }: { width: number; height: number }) => (
          <StyledOptions
            height={height}
            rowCount={items.length}
            rowHeight={38} // 2.5rem
            width={width - 2}
            rowRenderer={({ index, style, key }: { index: number; style: string; key: string }) => {
              const typedOption = items[index] as Record<string, unknown>;
              const itemValue = (typedOption?.values as { value: string }[])?.[0]?.value;
              const hasValue = itemValue !== undefined && itemValue !== null;
              return (
                <StyledOption
                  disabled={typedOption.disabled as boolean}
                  key={key}
                  style={style}
                  onClick={typedOption.disabled ? undefined : () => methods.addItem(typedOption)}
                >
                  <StyledSpan>{typedOption[selectProps.labelField as string] as string}</StyledSpan>
                  {hasValue && !typedOption.disabled && (
                    <StyledSpan color={theme.colors.mediumGrey2}>{itemValue}</StyledSpan>
                  )}
                  {typedOption.disabled && (
                    <StyledSpan isDisabledLabel>{selectProps.disabledLabel}</StyledSpan>
                  )}
                </StyledOption>
              );
            }}
          />
        )}
      </AutoSizer>
    </StyledSearch>
  );
};

// This component renders the content in the react-dropdown-select
export const CustomDropdownRendererAlertFieldSelector = ({
  props: selectProps,
  state,
  methods
}: CustomDropdownProps): JSX.Element | null => {
  const theme = useTheme();
  const regexp = new RegExp(state.search, 'i');
  const [selectedOperator, setSelectedOperator] = useState('');
  const { t } = useTranslation(['mh']);
  const operatorsList = [
    {
      value: 'raw_tags',
      label: t('raw_tags') as string
    }
  ];
  const items = selectProps.options
    .filter((item) => {
      const typedItem = item as Record<string, unknown>;
      const searchBy = selectProps.searchBy as string;
      const labelField = selectProps.labelField as string;
      return (
        regexp.test(typedItem[searchBy] as string) || regexp.test(typedItem[labelField] as string)
      );
    })
    .filter((option) => selectProps.keepSelectedInList || !methods.isSelected(option));

  // Note about types in this component:
  // We are trusting that the react-dropdown-select library sends itself the correct types.
  // https://github.com/sanusart/react-dropdown-select/blob/master/docs/src/examples/CustomContentAndDropdown.js

  return (
    <StyledSearch>
      <StyledSearchAlertLogic>
        <div
          style={{
            width: '10rem'
          }}
        >
          <StyledTableInput
            type="text"
            value={state.search}
            onChange={methods.setSearch}
            placeholder={t('search_for_tag') as string}
            style={{
              width: '100%'
            }}
          />
        </div>
        <div style={{ margin: '0.5rem 0.5rem 0.125rem', width: '7rem' }}>
          <BaseSelect
            // disabledLabel={'tag_already_assigned'}
            handleChange={(e) => {
              // props.handleOnChange(e ? e.target.value : null);
              setSelectedOperator(e.target.value);
            }}
            labelField="id"
            options={operatorsList}
            searchable={false}
            searchBy="label" // label is assigned as friendlyName value
            value={selectedOperator}
            valueField="id"
          />
        </div>
      </StyledSearchAlertLogic>
      <AutoSizer style={{ height: '12rem' }}>
        {({ width, height }: { width: number; height: number }) => (
          <StyledOptions
            height={height}
            rowCount={items.length}
            rowHeight={38} // 2.5rem
            width={width - 2}
            rowRenderer={({ index, style, key }: { index: number; style: string; key: string }) => {
              const typedOption = items[index] as Record<string, unknown>;
              const itemValue = (typedOption?.values as { value: string }[])?.[0]?.value;
              const hasValue = itemValue !== undefined && itemValue !== null;
              return (
                <StyledOption
                  disabled={typedOption.disabled as boolean}
                  key={key}
                  style={style}
                  onClick={typedOption.disabled ? undefined : () => methods.addItem(typedOption)}
                >
                  <StyledSpan>{typedOption[selectProps.labelField as string] as string}</StyledSpan>
                  {hasValue && !typedOption.disabled && (
                    <StyledSpan color={theme.colors.mediumGrey2}>{itemValue}</StyledSpan>
                  )}
                  {typedOption.disabled && (
                    <StyledSpan isDisabledLabel>{selectProps.disabledLabel}</StyledSpan>
                  )}
                </StyledOption>
              );
            }}
          />
        )}
      </AutoSizer>
    </StyledSearch>
  );
};

// This component renders the content in the react-dropdown-select
export const CustomDropdownRendererAlertValueEditor = ({
  props: selectProps,
  state,
  methods,
  thresholdType
}: CustomDropdownAlertLogicProps): JSX.Element | null => {
  const theme = useTheme();
  const regexp = new RegExp(state.search, 'i');

  const { t } = useTranslation(['mh']);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stateValue: any = state.values[0] as TDropdownValue;
  const DEBOUNCE_TIMEOUT = 1000;
  const items = selectProps.options
    .filter((item) => {
      const typedItem = item as Record<string, unknown>;
      const searchBy = selectProps.searchBy as string;
      const labelField = selectProps.labelField as string;
      return (
        regexp.test(typedItem[searchBy] as string) || regexp.test(typedItem[labelField] as string)
      );
    })
    .filter((option) => selectProps.keepSelectedInList || !methods.isSelected(option));

  // Note about types in this component:
  // We are trusting that the react-dropdown-select library sends itself the correct types.
  // https://github.com/sanusart/react-dropdown-select/blob/master/docs/src/examples/CustomContentAndDropdown.js

  const [currentTab, setCurrentTab] = useState<string>(
    // '1'
    // eslint-disable-next-line no-prototype-builtins
    stateValue && stateValue.hasOwnProperty('label')
      ? stateValue?.isCustomThresholdValue
        ? '1'
        : stateValue?.id?.isCustomThresholdValue
        ? '1'
        : '0'
      : '0'
  );

  return (
    <>
      <TabNavToggle
        items={[
          {
            label: t('tag') as string,
            onClick: () => {
              setCurrentTab('0');
            },
            active: currentTab === '0',
            isTabEnabled: true
          },
          {
            label: t('threshold') as string,
            onClick: () => {
              setCurrentTab('1');
            },
            active: currentTab === '1',
            isTabEnabled: true
          }
        ]}
      />
      {currentTab === '0' ? (
        <StyledSearch>
          <StyledTableInput
            type="text"
            value={state.search}
            onChange={methods.setSearch}
            placeholder={t('search_for_tag') as string}
          />
          <AutoSizer style={{ height: '12rem' }}>
            {({ width, height }: { width: number; height: number }) => (
              <StyledOptions
                height={height}
                rowCount={items.length}
                rowHeight={38} // 2.5rem
                width={width - 2}
                rowRenderer={({
                  index,
                  style,
                  key
                }: {
                  index: number;
                  style: string;
                  key: string;
                }) => {
                  const typedOption = items[index] as Record<string, unknown>;
                  const itemValue = (typedOption?.values as { value: string }[])?.[0]?.value;
                  const hasValue = itemValue !== undefined && itemValue !== null;
                  return (
                    <StyledOption
                      disabled={typedOption.disabled as boolean}
                      key={key}
                      style={style}
                      onClick={
                        typedOption.disabled ? undefined : () => methods.addItem(typedOption)
                      }
                    >
                      <StyledSpan>
                        {typedOption[selectProps.labelField as string] as string}
                      </StyledSpan>
                      {hasValue && !typedOption.disabled && (
                        <StyledSpan color={theme.colors.mediumGrey2}>{itemValue}</StyledSpan>
                      )}
                      {typedOption.disabled && (
                        <StyledSpan isDisabledLabel>{selectProps.disabledLabel}</StyledSpan>
                      )}
                    </StyledOption>
                  );
                }}
              />
            )}
          </AutoSizer>
        </StyledSearch>
      ) : (
        <ThresholdFieldContainer>
          <StyledInputField
            defaultValue={
              // eslint-disable-next-line no-prototype-builtins
              stateValue && stateValue.hasOwnProperty('label')
                ? (stateValue.id?.id as string)
                : stateValue?.isCustomThresholdValue && stateValue.id
            }
            type={thresholdType}
            placeholder={t('value') as string}
            style={{ padding: '1rem' }}
            onChange={debounce((e) => {
              methods.addItem({
                id: e.target.value.replace(/\//g, ''),
                values: [{ value: e.target.value.replace(/\//g, '') as number | string }],
                isCustomThresholdValue: true
              });
            }, DEBOUNCE_TIMEOUT)}
          />
        </ThresholdFieldContainer>
      )}
    </>
  );
};

interface CustomContentProps {
  item: WidgetTableDropdownItem | TagsDropdownItems;
  label?: string | undefined;
  toolTipText?: string;
}

// This component renders the selected item in the react-dropdown-select
export const CustomContentRenderer = ({
  item,
  label,
  toolTipText
}: CustomContentProps): JSX.Element | null => {
  const theme = useTheme();
  const { t } = useTranslation(['mh']);

  const itemValue = item?.values?.[0]?.value;
  const hasValue = itemValue !== undefined && itemValue !== null;

  return item ? (
    <StyledSpanWrapper color={hasValue ? theme.colors.onTrackGreen : theme.colors.negativeRed}>
      <StyledCircleSpan>•</StyledCircleSpan>
      <StyledSpan color={theme.colors.mediumBlue} padding="0 1.5rem 0 0">
        {item.friendlyName || item.name}
      </StyledSpan>
    </StyledSpanWrapper>
  ) : (
    <StyledSpan color={theme.colors.mediumGrey3} isRequired>
      {t(label as string) as string}
      <WarningIconContainer>
        <TooltipWrapper Tooltip={toolTipText}>
          <FontAwesomeIcon
            fontSize="0.75rem"
            color={theme.colors.negativeRed}
            icon={faExclamationCircle}
          />
        </TooltipWrapper>
      </WarningIconContainer>
    </StyledSpan>
  );
};

// This component renders the selected item in the react-dropdown-select
export const CustomContentRendererValueEditor = ({
  item,
  label,
  toolTipText
}: CustomContentProps): JSX.Element | null => {
  const theme = useTheme();
  const { t } = useTranslation(['mh']);

  const itemValue = item?.values?.[0]?.value;
  const hasValue = itemValue !== undefined && itemValue !== null;

  return item && item?.id.length !== 0 ? (
    <StyledSpanWrapper color={hasValue ? theme.colors.onTrackGreen : theme.colors.negativeRed}>
      <StyledCircleSpan>•</StyledCircleSpan>
      <StyledSpan color={theme.colors.mediumBlue} padding="0 1.5rem 0 0">
        {item.id}
      </StyledSpan>
    </StyledSpanWrapper>
  ) : (
    <StyledSpan color={theme.colors.mediumGrey3} isRequired>
      {t(label as string) as string}
      <WarningIconContainer>
        <TooltipWrapper Tooltip={toolTipText}>
          <FontAwesomeIcon
            fontSize="0.75rem"
            color={theme.colors.negativeRed}
            icon={faExclamationCircle}
          />
        </TooltipWrapper>
      </WarningIconContainer>
    </StyledSpan>
  );
};
