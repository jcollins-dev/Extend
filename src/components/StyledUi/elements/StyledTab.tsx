import styled from 'styled-components';
import { StyledUiContainerProps } from '../StyledUiGlobal.types';
import { styledTheme } from '../theme';

export const StyledTab = styled.a<StyledUiContainerProps>`

  &[data-style='pill'] {
    display: inline-block;
    cursor: pointer;
    padding: 0.6875rem;
    font-size: 0.8125rem;
    background-color: #F9FAFB;
    border: 1px solid;
    border-color: transparent;
    cursor pointer;

    border-radius: ${styledTheme.radius.sm};
    color: ${styledTheme.color.main};
    grid-area: ${({ gridArea }) => gridArea};

    &:not([data-disabled="true"]) {
      &:hover,
      &[data-current="true"] {
        background-color: ${styledTheme.color.secondaryLight};
        border-color: ${styledTheme.color.secondary};
      }
    }
  }

  &[data-style='pill'] {
    flex-grow: 1;
    padding: 1em;
    border-style: solid;
    border-width: 0 0 2px 0;
    border-color: transparent;
    font-weight: 500;

    color: ${styledTheme.color.main};

    &[data-disabled="true"] {
      cursor: not-allowed;
    }

    &:not([data-disabled="true"]) {
      cursor: pointer;
      &[data-current="true"] {
        cursor: arrow!important;
      }

      &[data-current="true"] {
        border-color: ${styledTheme.color.secondary};
      }

      &:hover,
      &[data-current="true"] {
        background-color: ${styledTheme.color.secondaryLight};
        color: ${styledTheme.color.secondary};
      }
    }
  }
`;
