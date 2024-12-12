import styled, { css } from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';

export const dateRangePickerBaseClass = `date-range-picker`;

const baseClass = dateRangePickerBaseClass;

// grid settings and assignments for component and children
const gridSettings = css<StyledUiContainerProps>`
  display: grid;
  grid-template-rows: ${({ gridRows }) => gridRows || `auto auto auto`};
  grid-template-columns: ${({ gridCols }) => gridCols || `auto 170px`};
  grid-template-areas: ${({ gridAreas }) =>
    gridAreas || `'calendar date-range-select' 'time-range time-range-select' 'btns btns'`};

  .${baseClass}__calendar {
    grid-area: calendar;
  }
  .${baseClass}__date-range-select {
    grid-area: date-range-select;
  }
  .${baseClass}__time-range {
    grid-area: time-range;
  }
  .${baseClass}__time-range-select {
    grid-area: time-range-select;
  }
  .${baseClass}__btns {
    grid-area: btns;
  }
`;

export const DateRangePickerContainer = styled.div<StyledUiContainerProps>`
  z-index: 999;
  box-shadow: 0 0.0625rem 0.375rem 0 rgb(0 0 0 / 15%);
  position: absolute;
  font-size: .9rem;

  background: ${styledTheme.color.neg};
  border-radius: ${styledTheme.radius.base};
  overflow: hidden;

  ${gridSettings}

  .${baseClass}__side-col {
    height: 100%;
    overflow-x: auto;
    max-height: 100%;
    font-size: .8em;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0) 3%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .${baseClass}__time-range {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    align-items: center;

    border-top: solid 1px ${styledTheme.color.border.main};
  }

  .${baseClass}__time-range-select.range-select-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-auto-flow: row;
      grid-template-rows: auto;
    }
  }

  .${baseClass}__btns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1em;

    border-top: solid 1px ${styledTheme.color.border.main};
  }

  .${baseClass}__side-col,
  .${baseClass}__time-range,
  .${baseClass}__btns  {
    padding: 1em;
  }


  .ui-date-range__inputs {
    display: none;
  }
  .ui-date-range__date-stepper {
    padding: 0;
  }
  .ui-date-range__calendar-wrapper {
    width: 100%;
    font-family: inherit;


    button { 
      font-family: inherit;
      color: ${styledTheme.color.main};
    }

    .rdrDayNumber {
      font-weight: 500;
    }
  }
  .rdrMonthName {
    display: none;
  }
`;
