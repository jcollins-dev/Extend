import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';
export interface ProgressCellContainerProps extends StyledUiContainerProps {
  color?: string;
  value: number;
}

export const ProgressCellContainer = styled.div<ProgressCellContainerProps>`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  font-size: 0.9em;
  gap: 0.5em;
  align-items: center;
  font-weight: 500;

  &.label-inside {
    .progress-cell__label {
      grid-column: 1 / span 2;
      grid-row: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 0.9em;
      padding-right: 0.5em;
    }

    .progress-cell__bar {
      grid-column: 1 / span 2;
      grid-row: 1;
      z-index: -1;
    }
  }

  .progress-cell__bar {
    background: rgba(229, 233, 237, 1);
    border-radius: 0.3em;
    position: relative;
    width: 100%;
    height: 20px;

    &::before {
      position: absolute;
      content: '';
      left: 0;
      top: 0;
      bottom: 0;
      border-radius: inherit;

      width: ${({ value }) => `${value}%`};
      background: ${({ color }) => color || 'rgba(64, 92, 133, 1)'};
      z-index: 100;
    }
  }
`;
