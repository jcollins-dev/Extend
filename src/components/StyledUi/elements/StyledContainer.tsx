import styled from 'styled-components';
import { ContainerProps } from './Styled.types';

export const StyledContainer = styled.div.attrs(
  ({ ariaLabel, isLoading, isDisabled, isAriaHidden, htmlHide }: ContainerProps) => ({
    'aria-label': ariaLabel,
    'aria-busy': isLoading && 'true',
    'aria-disabled': isDisabled && 'true',
    'aria-hidden': isAriaHidden && 'true',
    hidden: htmlHide
  })
)<ContainerProps>`
  grid-area: ${({ ga }) => ga};
`;

export const SrOnly = styled.span.attrs(() => ({
  'aria-hidden': 'true'
}))`
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  left: -1000%;
`;
