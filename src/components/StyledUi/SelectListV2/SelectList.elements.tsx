import styled from 'styled-components';
import { styledTheme } from '../theme';

export interface SelectListContainerProps {
  gridArea?: string;
  className?: string;
}

export const SelectListContainer = styled.div<SelectListContainerProps>`
  grid-area: ${({ gridArea }) => gridArea};
  font-size: 0.9em;

  .select-list-item {
    label {
      cursor: pointer;
      input {
        transform: translateY(1px);
      }
    }
  }

  .group-header__label {
    text-transform: capitalize;
    font-size: 1.1em;
  }

  .group-header__count {
    opacity: 0.8;
  }

  ul.select-list-items {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1em;

    .select-list-item--is-selected {
      opacity: 1 !important;
    }

    li {
      margin-bottom: 0.5em;
      opacity: 0.7;
      transition: all 200ms ease;

      &:hover {
        opacity: 1;
      }

      label {
        display: flex;
        gap: 0.5em;
      }

      input {
        width: 0.8em;
        height: 0.8em;
      }
    }
  }

  .select-list-item_counter,
  .group-header__count {
    font-size: 0.9em;
    color: ${styledTheme.color.gray};
  }
`;

interface ColorCircleProps {
  color?: string;
}
export const ColorCircle = styled.div<ColorCircleProps>`
  background-color: ${({ color }) => color};
  width: 15px;
  min-width: 15px;
  height: 15px;
  min-height: 15px;
  flex-grow: 0;
  border-radius: 100px;
`;
