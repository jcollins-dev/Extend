import styled from 'styled-components';
import { StyledUiContainerProps } from '../StyledUiGlobal.types';
import { StyledButtonV2 } from '../elements/StyledButton';

export type StateHistoryButtonContainerProps = StyledUiContainerProps;

export const stateHistoryButtonsBaseClass = `sate-history-buttons`;

export const StateHistoryButtonsContainer = styled.div<StateHistoryButtonContainerProps>`
  display: flex;
  justify-content: flex-end;
  gap: 1em;

  grid-area: ${({ gridArea }) => gridArea};

  .${stateHistoryButtonsBaseClass}__button {
    &[disabled],
    &[data-muted='true'] {
      background-color: #e5e9ed;
      box-shadow: none;
      color: #a3a3a3;
      cursor: not-allowed !important;
    }

`;

export const StateHistoryButtonContainer = styled(StyledButtonV2)``;
