import styled, { css } from 'styled-components';
import { ContainerProps } from './Styled.types';
import { styledTheme } from '../theme';

const baseStyles = css`
  border: none;
  font-family: inherit;
  padding: 1em 1.5em;
  cursor: pointer;
  transition: all 300ms ease;
  font-weight: 700;
  font-size: 1.1em;
`;

const altStyles = css`
  background-color: #f1f7ff;
  box-shadow: 0 0.0625rem 0.375rem 0 rgb(0 0 0 / 15%);
  color: ${styledTheme.color.main};

  &:hover {
    background-color: #b6caf0;
  }
`;

const defaultStyles = css`
  display: flex;
  align-items: center;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: all 300ms ease;
  gap: 3px;

  box-shadow: 0 0.0625rem 0.375rem 0 rgb(0 0 0 / 15%);
  background-color: ${styledTheme.color.neg};
  color: ${styledTheme.color.main};
  border-radius: ${styledTheme.radius.sm};
  padding: 0.4em 1.2em;
  border: solid 1px ${styledTheme.color.border.light};

  &:hover {
    color: ${styledTheme.color.secondary};
  }
`;

export interface StyledButtonProps {
  className?: string;
  gridArea?: string;
  disabled?: boolean;
  styleType?: 'alt' | 'submit' | 'cancel' | 'pill' | 'outlined' | 'tab' | 'tab-pill';
}

export const StyledButtonV2 = styled.button<StyledButtonProps>`
  ${baseStyles};

  ${({ styleType }) => {
    switch (styleType) {
      case 'alt':
        return altStyles;
      default:
        return defaultStyles;
    }
  }};

  &.is-not-allowed {
    cursor: not-allowed;
  }

  &.is-disabled,
  &[disabled],
  &[data-disabled='true],
  &[data-muted='true'],
  &[data-muted='true']:hover,
  &[data-muted]:hover,
  &[data-disabled='true]:hover {
    background-color: #e5e9ed;
    box-shadow: none;
    color: #a3a3a3;
    cursor: not-allowed !important;
  }
`;

export const StyledButton = styled.button.attrs(
  ({ ariaLabel, isLoading, isDisabled, isAriaHidden, htmlHide }: ContainerProps) => ({
    'aria-label': ariaLabel,
    'aria-busy': isLoading && 'true',
    'aria-disabled': isDisabled && 'true',
    'aria-hidden': isAriaHidden && 'true',
    hidden: htmlHide
  })
)<ContainerProps>`
  grid-area: ${({ ga }) => ga};
  cursor: ${({ isDisabled, isMuted }) => !isDisabled && !isMuted && 'pointer'};
`;
