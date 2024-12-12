import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

export const GlobalFormContainer = styled.form<StyledUiContainerProps>`
  display: flex;
  max-height: 100%;
  flex-grow: 1;
  overflow: hidden;
  flex-direction: column;

  .global-form__inputs {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
`;
