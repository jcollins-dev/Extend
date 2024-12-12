//3rd party
import React, { useState, Fragment } from 'react';
import Select, { MultiValue, components } from 'react-select';
import {
  DropDownItem,
  DropdownProps,
  GroupedOption
} from 'pages/ProteinMachine/MachineConfig/Common/Alerts/FormElementsTypes';
import { InsertButton, LabelWrapper, MenuListOptionWrapper } from './index.elements';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const Option = (props: any) => {
  return (
    <div>
      <components.Option {...props} className="option">
        <MenuListOptionWrapper>
          <input
            className="option--checkbox"
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />
          <LabelWrapper>
            <label className="option--label">{props.label}</label>
            <label className="option--label">{props.value}</label>
          </LabelWrapper>
        </MenuListOptionWrapper>
      </components.Option>
    </div>
  );
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const Menu = (props: any) => {
  return (
    <Fragment>
      <components.Menu {...props}>
        <div>
          <div>{props.children}</div>
          <InsertButton>+ Insert Tag(s)</InsertButton>
        </div>
      </components.Menu>
    </Fragment>
  );
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function MultiValueRemove(props: any) {
  if (props.data.isFixed) {
    return null;
  }
  return <components.MultiValueRemove {...props} />;
}

export const DropdownSubOptions = ({
  disabled,
  optionsWithHeaders,
  value,
  options,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMultiSelect,
  ariaLabel,
  placeholder,
  isCustomAddButton
}: DropdownProps): JSX.Element => {
  const [multiValue, setMultiValue] = useState<DropDownItem[]>(value);

  const handleInputOnChange = (e: MultiValue<DropDownItem>) => {
    setMultiValue([...e]);
  };

  /**** Work on send selected values into parent components */
  // useEffect(() => {
  //   handleMultiSelect(multiValue);
  // }, [multiValue]);

  const formatGroupLabel = (optionsWithHeaders: GroupedOption) => (
    <div className="dropdown-header-row">
      <span className="header--label">{optionsWithHeaders.label}</span>
      <span className="header--value">{optionsWithHeaders.options.length}</span>
    </div>
  );

  return (
    <Select
      isDisabled={disabled ? true : false}
      className={disabled ? 'dropdown_checkboxes select--disabled' : 'dropdown_checkboxes'}
      hideSelectedOptions={false}
      aria-label={ariaLabel}
      isClearable={false}
      closeMenuOnSelect={false}
      maxMenuHeight={200}
      components={
        isCustomAddButton
          ? {
              Option,
              MultiValueRemove,
              IndicatorSeparator: () => null,
              Menu
            }
          : {
              Option,
              MultiValueRemove,
              IndicatorSeparator: () => null
            }
      }
      value={multiValue}
      isMulti
      options={optionsWithHeaders ? optionsWithHeaders : options}
      isOptionSelected={(option, selectValue) => selectValue.some((i) => i === option)}
      onChange={(e) => handleInputOnChange(e)}
      placeholder={placeholder}
      formatGroupLabel={formatGroupLabel}
    />
  );
};
