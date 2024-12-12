import styled from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';

export const baseClass = `time-input`;

export const TimeInputContainer = styled.div<StyledUiContainerProps>`
  position: relative;
  width: max-content;
  display: grid;
  grid-template-columns: auto;
  grid-auto-flow: column;
  align-items: center;
  justify-content: center;
  grid-gap: 0.3em;

  grid-area: ${({ gridArea }) => gridArea};

  .${baseClass} {
    border: none;
    background: none;
    padding: 0;
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;
    width: max-content;
    display: flex;
    justify-content: space-between;
    text-align: left;
    gap: 0.8em;
    justify-content: center;
  }

  .${baseClass}__time-col {
    display: grid;
    grid-template-rows: auto auto auto;
    justify-content: center;

    .time-col-arrow {
      border: none;
      background-color: transparent;
    }
  }

  .${baseClass}__value {
    font-weight: 500;
    text-align: center;
    display: block;
    min-width: 1.5em;
  }

  .time-col-arrow {
    cursor: pointer;
    opacity: <div className= '5' ></div>;
    transition: all 250ms ease;
    svg {
      width: 0.3em;

      path {
        transition: all 250ms ease;
        stroke-width: 3;
      }
    }

    &:hover {
      opacity: 1;
      svg path {
        stroke: ${styledTheme.color.secondary};
      }
    }
  }

  .time-col-arrow--down {
    .icon__chev--right {
      transform: rotate(90deg);
    }
  }

  .time-col-arrow--up {
    .icon__chev--right {
      transform: rotate(-90deg);
    }
  }
`;
