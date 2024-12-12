import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

export const MachineConnectionIconContainer = styled.span<StyledUiContainerProps>`
  font-weight: 500;
  display: grid;
  grid-gap: 0.3em;
  grid-template-columns: auto auto;
  flex-grow: 0;
  width: max-content;
  font-size: 0.9em;
  align-items: center;
  justify-content: center;
  min-height: 1em;

  color: ${({ color }) => color};
`;
