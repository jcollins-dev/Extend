import React from 'react';
import styled from 'styled-components';

import { BaseMultiSelect } from 'components';

interface Props {
  value?: string;
  options: { value: string; label: string }[];
  placeholder: string;
  handleChange: (value: string[]) => void;
  id?: string;
  multi?: boolean;
  disabled?: boolean;
}

interface ContentProps {
  disabled?: boolean;
}

const Content = styled.div<ContentProps>`
  margin: 0rem 0.25rem 0rem 0rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'default')}};
`;

const FilterOption = ({
  options,
  placeholder,
  handleChange,
  id,
  multi,
  disabled,
  value
}: Props): JSX.Element => {
  return (
    <Content disabled={disabled}>
      <BaseMultiSelect
        value={value}
        variant={'white'}
        handleChange={(event): void => {
          handleChange(event);
        }}
        options={options}
        placeholder={placeholder}
        id={id}
        multi={multi}
        disabled={disabled ? disabled : false}
      />
    </Content>
  );
};

export default FilterOption;
