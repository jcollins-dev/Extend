import styled from 'styled-components';

export interface ChartTooltipWrapperContainerProps {
  pos?: {
    x: number;
    y: number;
  };
}

export const ChartTooltipWrapperContainer = styled.div.attrs(() => ({
  className: 'tool-tip-wrapper'
}))<ChartTooltipWrapperContainerProps>`
  position: absolute;
  min-width: 1px;
  min-height: 1px;
  z-index: 999;

  opacity: ${({ pos }) => (!pos ? `none` : `block`)};
  left: ${({ pos }) => `${pos?.x || 0}px`};
  top: ${({ pos }) => `${Number(pos?.y) - 3 || 0}px`};

  .tooltip-inner {
    background-color: white;
    border-radius: 0.3em;
    position: absolute;
    bottom: 100%;
    padding: 0.5em;
    transform: translate(-50%, -0.3em);
    box-shadow: 0 0.625rem 1rem rgba(0, 0, 0, 0.1), 0 0.25rem 0.375rem rgba(0, 0, 0, 0.05),
      0 0 0 rgba(0, 0, 0, 0.05);
    transition: opacity 300ms ease;
    width: max-content;

    opacity: ${({ pos }) => (!pos ? 0 : 1)};

    &:after {
      content: '';
      display: block;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0.5em 0.5em 0 0.5em;
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translate(-50%, -1px);

      border-color: ${({ theme }) => theme.colors.white} transparent transparent transparent;
    }
  }
`;
