import styled from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';

export const TimeInputContainer = styled.div`
  position: relative;
  width: max-content;

  .time-label-btn {
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
  }

  .time-dropdown {
    font-size: 15px;
    max-height: 12rem;
    overflow-x: auto;
    left: 0;
    top: 100%;
    position: absolute;
    z-index: 900;
    width: max-content;
    background-color: ${styledTheme.color.neg};

    .time-dropdown__item {
      min-height: 1.5em;
      display: flex;
      align-items: center;
      font-family: inherit;
      display: block;
      width: 100%;
      border: none;
      font-size: 0.9em;
      text-align: left;
      margin: 3px 0 0 0;

      background-color: ${styledTheme.color.neg};
      padding: ${styledTheme.space.sm};

      &:hover {
        cursor: pointer;
        background-color: ${styledTheme.color.secondary};
        color: ${styledTheme.color.neg};
      }

      &.is-disabled {
        opacity: 0.3;

        &:hover {
          background-color: transparent;
          color: ${styledTheme.color.main};
        }
      }
    }

    &.is-hidden {
      display: none;
    }
  }
`;
