import styled, { css } from 'styled-components';
import { styledTheme } from 'components';
import { StyledUiContainerProps } from 'components';

export const InputGroupContainer = styled.div<StyledUiContainerProps>`
  font-size: 1em;

  label {
    font-size: 0.9em;
    font-weight: 500;
  }

  .input-group__input-field {
    font-family: inherit;
    background-color: rgba(241, 243, 244, 1);
    padding: 0.5em;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(229, 233, 237, 1);

    border-radius: ${styledTheme.radius.sm};
    outline-color: ${styledTheme.color.secondary};
  }

  .input-group__message {
    font-size: 0.8em;
  }

  &.has-error {
    label {
      color: red;
    }
    input {
      border-color: red;
      outline-color: red;
    }
  }

  ${({ grid }) =>
    grid
      ? gridStyles
      : `
    display: flex;
    flex-direction: column;
    gap: .2em;
  `};
`;
// only load these if the input group should be a grid
const gridStyles = css`
  display: grid;
  gap: 0.3em;
  grid-template-rows: 0.9em auto 0.8em;
  grid-template-areas:
    'label'
    'input'
    'message';

  label {
    grid-area: label;
  }
  .input-group__input {
    grid-area: input;
  }
  .input-group__message {
    grid-area: message;
  }
`;
