// 3rd party libraries
import React from 'react';
import styled from 'styled-components';

export type Variant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'buyNow'
  | 'danger'
  | 'warning'
  | 'link'
  | 'inline-link'
  | 'emergency'
  | 'hover-blue'
  | 'constant'
  | 'upload'
  | 'thin';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: Variant;
  size?: 'small' | 'normal';
  disabled?: boolean;
  bgColor?: string;
  arrow?: boolean;
  width?: string;
  height?: string;
  borderColor?: string;
  borderRadius?: string;
  icon?: React.ReactNode;
  marginLeft?: string;
}

export const Button = styled.button<Props>`
  display: flex;
  display: ${({ variant }) => {
    switch (variant) {
      case 'inline-link':
        return 'inline';
      default:
        return 'flex';
    }
  }};
  align-items: center;
  justify-content: ${({ arrow }) => (arrow ? 'space-between' : 'center')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  width: ${({ width }) => width ?? '100%'};
  height: ${({ height }) => height ?? 'auto'};
  white-space: nowrap;
  padding: ${({ size, variant }) => {
    switch (variant) {
      case 'inline-link':
        return 0;
    }
    switch (size) {
      case 'small':
        return '0.5rem 1.375rem';
      default:
        return '0.75rem 1.375rem';
    }
  }};
  color: ${({ variant, color, theme }) => {
    // Possible to override the variant text color by explicitly specifying "color"
    if (color) {
      return color;
    }
    switch (variant) {
      case 'primary':
      case 'danger':
      case 'warning':
        return 'white';
      case 'buyNow':
        return '#584ccf';
      case 'secondary':
        return theme.colors.darkGrey;
      case 'link':
      case 'inline-link':
        return color ? color : theme.colors.mediumBlue;
      default:
        return '#353B4B';
    }
  }};
  background-color: ${({ variant, theme, bgColor }) => {
    // Possible to override the variant color by explicitly specifying bgColor
    if (bgColor) {
      return bgColor;
    }
    switch (variant) {
      case 'primary':
        return theme.colors.buttons.primary.fill;
      case 'buyNow':
        return '#e5edff';
      case 'secondary':
        return theme.colors.primaryBlue4;
      case 'warning':
        return theme.colors.buttons.warning.fill;
      case 'danger':
        return theme.colors.buttons.danger.fill;
      case 'emergency':
        return theme.colors.darkRed;
      case 'link':
      case 'inline-link':
        return 'transparent';
      default:
        return 'white';
    }
  }};
  border: 0.0625rem solid;
  border-color: ${({ borderColor, variant, theme }) => {
    if (borderColor) return borderColor;
    switch (variant) {
      case 'primary':
        return theme.colors.buttons.primary.fill;
      case 'buyNow':
      case 'secondary':
        return '#e5edff';
      case 'link':
      case 'inline-link':
        return 'transparent';
      case 'thin':
        return theme.colors.lightGrey3;
      default:
        return '#D1D5DB';
    }
  }};
  border-radius: ${({ borderRadius }) => borderRadius ?? '0.625rem'};
  font-size: 0.875rem;
  font-weight: ${({ variant }) => {
    switch (variant) {
      case 'link':
      case 'inline-link':
      case 'thin':
        return 'normal';
      default:
        return 'bold';
    }
  }};
  line-height: 1rem;
  text-align: ${({ variant }) => {
    switch (variant) {
      case 'thin':
        return 'left';
      default:
        return 'center';
    }
  }};
  box-shadow: ${({ variant }) => {
    switch (variant) {
      case 'link':
      case 'inline-link':
      case 'secondary':
        return 'none';
      default:
        return '0 0.0625rem 0.375rem 0 rgba(0, 0, 0, 0.15)';
    }
  }};

  transition: color 0.5s, background-color 0.5s, border-color 0.5s;

  &:hover,
  &:focus,
  &:active {
    background-color: ${({ variant, theme, bgColor }) => {
      switch (variant) {
        case 'primary':
          return '#2F446C';
        case 'buyNow':
        case 'secondary':
          return '#e5edff';
        case 'inline-link':
          return 'transparent';
        case 'link':
          // theme.colors.mediumBlue but with opacity
          return 'rgba(10, 112, 255, 0.1)';
        case 'danger':
          return theme.colors.darkRed;
        case 'emergency':
          return theme.colors.darkRed;
        case 'upload':
          return '#004577';
        case 'hover-blue':
          return theme.colors.darkBlue1;
        case 'constant':
          return bgColor;
        default:
          return theme.colors.lightGrey3;
      }
    }};
    border-color: ${({ variant }) => {
      switch (variant) {
        case 'primary':
          return '#2F446C';
        case 'buyNow':
        case 'secondary':
          return '#584ccf';
        case 'link':
        case 'inline-link':
          return 'transparent';
        default:
          return '#C8CED4';
      }
    }};
  }

  &:disabled {
    color: ${({ variant }) => {
      switch (variant) {
        case 'hover-blue':
          return '#fff';
        default:
          return '#a7a7a7';
      }
    }};
    background-color: ${({ variant }) => {
      switch (variant) {
        case 'hover-blue':
          return '#B4B4B4';
        default:
          return '#f0f0f0';
      }
    }};
    border-color: #f0f0f0;
  }

  svg {
    margin-left: ${({ marginLeft }) => marginLeft || '0.75rem'};
  }
`;

const chevron = (
  <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.35449 2.74871C5.921 3.12027 5.96187 3.93575 5.43535 4.36208L1.62929 7.44389C0.975488 7.97328 5.67359e-08 7.50797 9.47617e-08 6.66672L3.469e-07 1.08863C3.82849e-07 0.293331 0.883412 -0.183735 1.54843 0.252433L5.35449 2.74871Z"
      fill="currentColor"
    />
  </svg>
);

const chevronThin = (
  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.1417 0L0 1.175L3.7085 5L0 8.825L1.1417 10L6 5L1.1417 0Z" fill="currentColor" />
  </svg>
);

const ButtonComponent = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, arrow, variant, icon, ...rest }: Props, ref): JSX.Element => (
    <Button arrow={arrow} variant={variant} ref={ref} {...rest}>
      {icon ? icon : null}
      {children}
      {arrow ? (variant === 'thin' ? chevronThin : chevron) : null}
    </Button>
  )
);

ButtonComponent.displayName = 'ButtonComponent';

export default ButtonComponent;
