import styled from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';

export const DateRangePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: clamp(350px, 50vw, 500px);
  z-index: 999;

  border: solid 1px ${styledTheme.color.border.main};
  background: ${styledTheme.color.neg};

  .ui-date-range-picker-header {
    background-color: ${styledTheme.color.secondaryLight};

    .ui-date-range-picker-header__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8em;
      font-weight: 500;
      padding: ${styledTheme.space.xs} ${styledTheme.space.xs} 0 ${styledTheme.space.xs};
    }

    .ui-date-range-picker-header__options {
      display: flex;
      align-items: center;
      font-weight: normal;
      color: ${styledTheme.color.main};
      gap: ${styledTheme.space.xs};
      input {
        margin: 0;
      }
    }
  }

  .ui-date-range-picker-header__nav {
    display: flex;

    .ui-date-range-picker-header__nav-item {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      background: transparent;
      cursor: pointer;
      border-width: 0 0 2px 0;
      border-color: transparent;
      border-style: solid;
      font-weight: 500;
      font-family: inherit;

      padding: ${styledTheme.space.sm};
      color: ${styledTheme.color.main};

      &.is-current {
        color: ${styledTheme.color.secondary};
        border-color: ${styledTheme.color.secondary};
      }
    }
  }

  .ui-tab {
    padding: ${styledTheme.space.xs};
  }

  .ui-tab.is-hidden {
    height: 0;
    padding: 0;
    overflow: hidden;
  }

  .ui-buttons {
    display: flex;
    align-items: flex-end;
    gap: ${styledTheme.space.md};
    padding: 0 ${styledTheme.space.xs} ${styledTheme.space.xs};

    button {
      border: none;
      cursor: pointer;

      border-radius: ${styledTheme.radius.sm};
      padding: ${styledTheme.space.xs} ${styledTheme.space.sm};
    }
    .ui-submit {
      background-color: ${styledTheme.color.secondary};
      color: ${styledTheme.color.neg};
    }
    .ui-cancel {
      background-color: ${styledTheme.color.bg.negLightest};
      color: ${styledTheme.color.main};
    }
  }
  .ui-dates {
    display: flex;
    border: solid 1px ${styledTheme.color.border.main};
    margin: ${styledTheme.space.xs};
    border-radius: ${styledTheme.radius.base};
  }

  .ui-date {
    display: flex;
    width: 50%;
    font-size: 13px;
    gap: 0.2em;
    padding: 0.2em;

    .ui-time-col {
      width: 50%;
      padding: 0 ${styledTheme.space.xs};
    }
    &:first-child {
      border-right: solid 1px ${styledTheme.color.border.main};
    }
    .ui-time-col__header {
      font-size: 0.9em;
      font-weight: 500;
    }
  }

  .ui-tab__range-group {
    display: flex;
    flex-wrap: wrap;
    gap: ${styledTheme.space.sm};
  }

  .day-group__item {
    background-color: ${styledTheme.color.secondaryLight};
    border: solid 1px ${styledTheme.color.secondaryLight};
    border-radius: ${styledTheme.radius.sm};
    padding: ${styledTheme.space.sm};
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &.is-selected {
      border-color: ${styledTheme.color.secondary};
    }
  }

  .rdrDateDisplay {
    display: none;
  }
  .rdrMonthName {
    display: none;
  }
  .rdrCalendarWrapper {
    display: flex;
  }
  .ui-date-range__date-stepper {
    padding: 0;
    height: auto;
  }

  .ui-calendar {
    width: 100%;
  }
  .ui-calendar__month {
    padding: 0;
    width: 100%;
  }
`;
