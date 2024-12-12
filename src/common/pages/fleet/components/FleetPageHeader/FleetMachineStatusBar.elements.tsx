import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

export const FleetMachineStatusBarContainer = styled.div<StyledUiContainerProps>`
  display: flex;
  color: inherit;
  min-height: 0.75em;
  font-size: 0.75em;

  .machine-status-bar__item {
    display: flex;
    gap: 0.3rem;
    padding: 0 0.5rem;
    border-color: rgba(0, 0, 0, 0.3);
    border-style: solid;
    border-width: 0 1px 0 0;
    justify-content: center;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
      border: 0;
    }
  }
`;
