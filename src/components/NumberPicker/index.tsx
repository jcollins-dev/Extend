import React from 'react';
import styled from 'styled-components';
import { InputVariant } from 'types';

interface Props extends InputVariant {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
}

const StyledInput = styled.input<InputVariant>`
  width: 100%;
  height: 2.5rem;
  padding: 0 1rem;

  font-family: ${(props) => props.theme.typography.family || 'sans-serif'};
  font-size: ${(props) => props.theme.typography.components.input.size || '0.875rem'};
  line-height: ${(props) => props.theme.typography.components.input.lineHeight || '1.125rem'};
  font-weight: ${(props) => props.theme.typography.components.input.weight || '500'};
  color: ${(props) => {
    if (props.variant && props.variant === 'disabled') {
      return props.theme.colors.disabled.light.fill;
    } else if (props.variant && props.variant === 'white-dark') {
      return 'black';
    }
    return props.theme.colors.field.select.enabled || '#5D6A86';
  }};
  background-color: ${(props) => props.theme.colors.field.white.fill};

  box-sizing: border-box;
  border-radius: 0.375rem;
  border: ${(props) => {
    if (props.borderVariant && props.borderVariant === 'none') {
      return 'none';
    } else if (props.borderVariant && props.borderVariant === 'error') {
      return props.theme.colors.borders.error.border;
    }
    return props.theme.colors.borders.border02.border || '0.0625rem solid #D8DDe3';
  }};
  box-shadow: ${(props) => props.theme.colors.borders.border02.shadow};
`;

const NumberPicker = ({ value, id, variant, onChange, ...props }: Props): JSX.Element => (
  <>
    <StyledInput
      disabled={variant === 'disabled'}
      id={id}
      variant={variant}
      {...props}
      type="number"
      defaultValue={value as number}
      onBlur={(event) => onChange(event)}
    />
  </>
);

export default NumberPicker;
