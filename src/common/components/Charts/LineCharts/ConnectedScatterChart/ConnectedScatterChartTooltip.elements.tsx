import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

export const ConnectedScatterChartTooltipContainer = styled.div<StyledUiContainerProps>`
  position: absolute;
  z-index: 700;
  width: 0px;
  height: 0px;
  font-size: clamp(11px, 2vw, 0.85rem);
  transform: translateY(-5px);

  left: ${({ left }) => (left as string) || '0px'};
  top: ${({ top }) => (top as string) || '0px'};

  .chart-tooltip__content-wrapper {
    position: absolute;
    bottom: 100%;
    transform: translateX(-50%);
  }

  .chart-tooltip__content {
    padding: 0.5em;
    background-color: white;
    border-radius: 0.5em;
    min-width: max-content;
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.5);
  }

  .chart-tooltip__arrow {
    height: 0.5em;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &:after {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 10px solid white;
      display: block;
      content: '';
    }
  }
`;
