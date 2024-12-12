import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

export const MachineProductionIconContainer = styled.span<StyledUiContainerProps>`
  font-weight: 500;
  display: grid;
  grid-gap: 0.3em;
  grid-template-columns: auto auto;
  flex-grow: 0;
  width: max-content;
  align-items: center;
  justify-content: center;
  min-height: 1em;

  color: ${({ color }) => color};

  .machine-production-icon__icon-wrapper {
    width: 1em;
    height: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border-width: 2px;
    border-style: solid;
    border-color: ${({ color }) => color};
  }
`;
