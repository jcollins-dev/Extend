import React, { RefObject } from 'react';
import styled from 'styled-components';
import { InputLabel } from 'components';
import { InputVariant } from 'types';
import Tooltip from 'rc-tooltip';
import { default as theme } from 'themes';

interface Props extends InputVariant {
  label?: string;
  mandatory?: boolean;
  id?: string;
  [x: string]: unknown;
  inputRef?: RefObject<HTMLInputElement>;
}

export const TooltipInformationContainer = styled.div`
  max-width: 20rem;
  max-height: 10rem;
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  letter-spacing: 0em;
  text-align: left;
  word-wrap: break-word;
  text-align: justify;
  text-justify: inter-word;
  over-flow: scroll;

  @media (max-width: 768px) {
    max-width: 10rem;
  }
`;

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
  background-color: ${(props) =>
    props.variant
      ? props.variant === 'disabled'
        ? props.theme.colors.field.disabled.fill
        : props.variant === 'white' || props.variant === 'white-dark'
        ? props.theme.colors.field.white.fill
        : props.theme.colors.field.grey.fill || 'rgb(244, 247, 249)'
      : 'transparent'};

  cursor: ${(props) => (props.variant && props.variant === 'disabled' ? 'not-allowed' : 'auto')};

  appearance: none;

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
  box-shadow: ${(props) =>
    (props.borderVariant && props.borderVariant === 'none'
      ? 'none'
      : props.theme.colors.borders.border02.shadow) || 'none'};

  ::placeholder {
    color: ${(props) => props.theme.colors.mediumGrey3};
  }
`;

const StyledText = styled.p`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-family: ${theme.typography.family};
  color: ${theme.colors.darkGrey};
  font-size: 0.875rem;
  font-weight: 400;
  margin-top: 0;
  margin-bottom: 0;
  min-width: 4rem;
  max-width: 8rem;
`;

export const Input = ({
  label,
  mandatory,
  id,
  variant,
  inputRef,
  ...props
}: Props): JSX.Element => (
  <>
    {label && (
      <InputLabel id={id} mandatory={mandatory}>
        {label}
      </InputLabel>
    )}
    <StyledInput
      ref={inputRef}
      disabled={variant === 'disabled'}
      id={id}
      variant={variant}
      {...props}
    />
  </>
);

export const ReviewTableLabel = ({ label, mandatory, id, ...props }: Props): JSX.Element => (
  <>
    {label && (
      <InputLabel id={id} mandatory={mandatory}>
        {label}
      </InputLabel>
    )}
    <Tooltip
      overlay={
        <TooltipInformationContainer>
          <p style={{ overflow: 'auto' }}>{props.value}</p>
        </TooltipInformationContainer>
      }
      placement={'top'}
      overlayClassName="information-tooltip"
    >
      <StyledText>{props.value}</StyledText>
    </Tooltip>
  </>
);

export default Input;
