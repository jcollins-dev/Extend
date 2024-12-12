import styled, { css } from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';
import { StyledUiContainerProps } from '../StyledUiGlobal.types';

export interface TooltipWrapperContainerProps extends StyledUiContainerProps {
  /** control externally */
  isOpen?: boolean;
  width?: number;
}

/* dimensions of arrow, units are defined in the css */
const arrowWidth = 6;

const arrowStyles = css<TooltipWrapperContainerProps>`
  position: absolute;
  content: '';
  width: 0;
  height: 0;
  transform: translateX(-${arrowWidth}px);
  left: 50%;
  border-left: ${arrowWidth}px solid transparent;
  border-right: ${arrowWidth}px solid transparent;
  border-top: ${arrowWidth}px solid ${styledTheme.color.main};
`;

const tooltipStyles = css<TooltipWrapperContainerProps>`
  animation-direction: reverse;
  position: absolute;
  padding: 6px 8px;
  width: max-content;
  left: 50%;
  transition: opacity 250ms ease;
  grid-row: 1;
  grid-colum: 1;
  transform: translate(-50%, 0);

  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  border-radius: ${styledTheme.radius.sm};
  background-color: ${styledTheme.color.main};
  color: ${styledTheme.color.neg};
  text-align: center;
  z-index: 12;

  &:before {
    ${arrowStyles};
  }
`;

export const TooltipWrapperContainer = styled.div<TooltipWrapperContainerProps>`
  position: relative;
  width: max-content;
  align-items: center;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto;
  z-index: 8;

  > :first-child {
    grid-row: 1;
    grid-column: 1;
  }

  .tooltip {
    ${tooltipStyles};

    &.tooltip--bottom {
      top: 100%;

      margin-top: ${arrowWidth + 3}px;

      &:before {
        top: -${arrowWidth - 2}px;
        transform: rotate(180deg) translateX(${arrowWidth}px);
      }
    }

    &.tooltip--top {
      bottom: 100%;
      font-size: 0.85rem;
      margin-bottom: ${arrowWidth}px;

      &:before {
        bottom: -${arrowWidth - 2}px;
      }
    }
  }

  &:hover {
    .tooltip {
      opacity: 1;
      display: flex;
      gap: 0.25rem;
      animation: ${({ isOpen }) => !isOpen && `fadeInOut ease-in-out 150ms`};
    }
  }

  .status-icon {
    transform: rotate(45deg);
    color: ${styledTheme.color.secondary};
  }

  @keyframes fadeInOut {
    0% {
      display: none;
      opacity: 0;
    }
    1% {
      display: flex;
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
