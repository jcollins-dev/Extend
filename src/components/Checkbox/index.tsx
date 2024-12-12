// 3rd party
import React, { ReactElement } from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Types
import { InputChangeHandler } from 'types';

// Components
import { InputLabel } from 'components';

// Component properties
interface Props {
  id?: string;
  width?: number; // give as pixel value
  height?: number; // give as pixel value
  checked?: boolean;
  onChange?: InputChangeHandler;
  label?: string;
  labelWeight?: number;
  disabled?: boolean;
}

// Styling
const Root = styled.div`
  position: relative;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  align-self: center;
`;

const Input = styled.input<Props>`
  position: relative;
  min-width: ${(props) => (props.width ? `${props.width / 16}rem` : '1.5625rem')};
  height: ${(props) => (props.height ? `${props.height / 16}rem` : '1.5625rem')};
  appearance: none;
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.colors.field.disabled.fill : 'white'};
  border-radius: 0.375rem;
  border: ${(props) => props.theme.colors.borders.border01.border};
  margin: 0;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &[type='checkbox']:checked {
    background-color: ${(props) => props.theme.colors.buttons.primary.fill};
    border-color: ${(props) => props.theme.colors.buttons.primary.fill};
  }
`;

const CheckIcon = styled.div<Props>`
  pointer-events: none;
  width: ${(props) => (props.width ? `${props.width / 16}rem` : '1.5625rem')};
  height: ${(props) => (props.height ? `${props.height / 16}rem` : '1.5625rem')};
  position: absolute;
  color: ${(props) => (props.checked ? 'white' : 'transparent')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => (props.width ? `${props.width / 32}rem` : '0.78125rem')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const LabelContainer = styled.div<Props>`
  margin-left: 0.625rem;
  color: ${({ disabled, theme }) => (disabled ? theme.colors.field.disabled.fill : 'inherit')};
  & > label {
    margin-bottom: 0;
    font-weight: ${(props) => (props.labelWeight ? props.labelWeight : 400)};
  }
`;

const Checkbox = ({
  id,
  checked,
  onChange,
  width,
  height,
  label,
  labelWeight,
  disabled
}: Props): ReactElement => {
  const theme = useTheme();

  return (
    <Root>
      <Input
        id={`checkbox-${id}`}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        width={width}
        height={height}
        disabled={disabled}
      ></Input>
      <CheckIcon width={width} height={height} checked={checked} disabled={disabled}>
        <FontAwesomeIcon icon={faCheck} />
      </CheckIcon>
      {label && (
        <LabelContainer labelWeight={labelWeight}>
          <InputLabel color={disabled ? theme.colors.field.disabled.fill : 'darkGrey'}>
            <label htmlFor={`checkbox-${id}`}>{label}</label>
          </InputLabel>
        </LabelContainer>
      )}
    </Root>
  );
};

export default Checkbox;
