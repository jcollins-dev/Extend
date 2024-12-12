import styled from 'styled-components';
import { StyledUiContainerProps } from '../StyledUiGlobal.types';

export const baseClass = `sort-state-arrows`;

export const SortStateArrowsContainer = styled.div<StyledUiContainerProps>`
  display: grid;
  grid-template-rows: 1fr 1fr;
  justify-content: center;
  align-items: center;

  grid-area: ${({ gridArea }) => gridArea};

  .is-sorting {
    opacity: 1 !important;
  }

  .fa-sort-down {
    font-size: 0.6em;
    opacity: 0.3;

    &:nth-child(1) {
      transform: translateY(3px) rotate(180deg);
    }
    &:nth-child(2) {
      transform: translateY(-3px);
    }
  }
`;

/*

svg {
    opacity: 0.35;
    display: block;
    width: 10px !important;
    height: auto;

    &.not([data-current='true']) {
      transition: opacity 300ms ease;
    }

    path {
      stroke-width: 3 !important;
    }

    &:first-child {
      transform: rotate(-90deg);
    }

    &:last-child {
      transform: rotate(90deg);
    }

    &[data-current='true'] {
      opacity: 1;
    }
  }
  */
