import React, { useState, useEffect } from 'react';
import { RangeSelectListContainer, baseClass } from './RangeSelectList.elements';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';
import { DateRangeProps, useRangeSelectListOptions } from '../';

export type RangeSelectListPropsOptionValue = number | string;

export interface RangeSelectListPropsOption {
  label?: string;
  value: RangeSelectListPropsOptionValue;
  translate?: {
    label?: string;
    type?: string;
  };
}

export type RangeSelectListPropsOptions = RangeSelectListPropsOption[];

export interface RangeSelectListProps extends StyledUiContainerProps {
  handleSelect: (x: DateRangeProps) => void;
  options?: RangeSelectListPropsOptions;
  dateRange?: DateRangeProps;
}

interface ListItemsProps {
  selected?: RangeSelectListPropsOptionValue;
  options?: RangeSelectListPropsOptions;
  handleSelect: (x: RangeSelectListPropsOptionValue) => void;
}

const ListItems = ({ options, handleSelect, selected }: ListItemsProps): JSX.Element => (
  <>
    {options &&
      options.map(({ label, translate, value }) => {
        label = label || translate?.label;

        if (!label) {
          console.log('error in RangeSelectList.  Button is missing label');
          return <></>;
        }

        const settings = {
          'data-selected': selected === value ? 'true' : undefined,
          onClick: () => handleSelect(value)
        };

        return (
          <li key={label} className={`${baseClass}__item`}>
            <button type="button" {...settings}>
              {label}
            </button>
          </li>
        );
      })}
  </>
);

export const RangeSelectList = ({
  options,
  className,
  gridArea,
  handleSelect,
  dateRange
}: RangeSelectListProps): JSX.Element => {
  const [selected, setSelected] = useState<RangeSelectListPropsOptionValue | undefined>(undefined);

  const ranges = useRangeSelectListOptions();

  useEffect(() => {
    if (selected) {
      handleSelect(ranges[selected]);
    }
  }, [selected]);

  useEffect(() => {
    setSelected(undefined);
  }, [dateRange]);

  const containerSettings = {
    className: className ? `${className} ${baseClass}` : baseClass,
    gridArea
  };

  const listSettings = {
    handleSelect: (x: RangeSelectListPropsOptionValue) => setSelected(x),
    options,
    selected
  };

  return (
    <RangeSelectListContainer {...containerSettings}>
      <ListItems {...listSettings} />
    </RangeSelectListContainer>
  );
};
