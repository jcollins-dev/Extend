// 3rd party
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons';

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
  className?: string;
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
  width: ${(props) => (props.width ? `${props.width / 16}rem` : '1.25rem')};
  height: ${(props) => (props.height ? `${props.height / 16}rem` : '1.25rem')};
  appearance: none;
  background-color: white;
  border-radius: 50%;
  border: ${(props) => props.theme.colors.borders.border01.border};
  margin: 0;

  &[type='radio']:checked {
    background-color: ${(props) => props.theme.colors.buttons.primary.fill};
    border-color: ${(props) => props.theme.colors.buttons.primary.fill};
  }
`;

const RadioIcon = styled.div<Props>`
  pointer-events: none;
  width: ${(props) => (props.width ? `${props.width / 16}rem` : '1.25rem')};
  height: ${(props) => (props.height ? `${props.height / 16}rem` : '1.25rem')};
  position: absolute;
  color: ${(props) => (props.checked ? 'white' : 'transparent')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => (props.width ? `${props.width / 32}rem` : '0.78125rem')};
`;

const LabelContainer = styled.div<Props>`
  margin-left: 0.625rem;
  & > label {
    margin-bottom: 0;
    font-weight: ${(props) => (props.labelWeight ? props.labelWeight : 400)};
  }
`;

const RadioButton = ({
  id,
  checked,
  onChange,
  width,
  height,
  label,
  labelWeight,
  className
}: Props): ReactElement => (
  <Root className={className}>
    <Input
      id={`radio-${id}`}
      type="radio"
      checked={checked}
      onChange={onChange}
      width={width}
      height={height}
    ></Input>
    <RadioIcon width={width} height={height} checked={checked}>
      <FontAwesomeIcon icon={faDotCircle} />
    </RadioIcon>
    {label && (
      <LabelContainer labelWeight={labelWeight}>
        <InputLabel>
          <label htmlFor={`radio-${id}`}>{label}</label>
        </InputLabel>
      </LabelContainer>
    )}
  </Root>
);

export default RadioButton;
