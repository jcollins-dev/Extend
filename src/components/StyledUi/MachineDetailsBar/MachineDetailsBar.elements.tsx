import styled from 'styled-components';
import { styledTheme } from '../theme';

export interface MachineDetailsBarContainerProps {
  gridArea?: string;
  className?: string;
}
export const MachineDetailsBarContainer = styled.div<MachineDetailsBarContainerProps>`
  font-size: 0.875rem;
  font-weight: 400;
  display: flex;
  gap: 0.5em;
  align-items: center;

  color: ${styledTheme.color.gray};
  grid-area: ${({ gridArea }) => gridArea};

  .machine-details-bar__item {
    padding-left: 0.5em;

    border-left: solid 2px ${styledTheme.color.gray};
  }

  .machine-details-bar__item:first-child {
    border-left: none;
    padding-left: 0;
  }
`;
