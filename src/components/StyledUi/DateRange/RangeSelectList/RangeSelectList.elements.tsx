import { styledTheme } from 'components/StyledUi/theme';
import styled from 'styled-components';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';

export const baseClass = `range-select-list`;

export const RangeSelectListContainer = styled.ul<StyledUiContainerProps>`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: auto;

  gap: ${styledTheme.space.xs};
  grid-area: ${({ gridArea }) => gridArea};

  .${baseClass}__item {

    button {
      display: block;
      text-align: center;
      width: 100%;
      padding: .35em;
      justify-content: center;
      align-items: center;
      border: 1px solid;
      border-color: #F9FAFB;
      cursor pointer;
      font-family: inherit;
      text-transform: capitalize;
      font-weight: 500;
      
      background-color: ${styledTheme.color.secondaryLight};
      border-radius: ${styledTheme.radius.sm};
      color: ${styledTheme.color.main};

      &:hover,
      &[data-selected='true'] {
        background-color: ${styledTheme.color.secondaryLight};
        border-color: ${styledTheme.color.secondary};
      }
    }
  }
`;
