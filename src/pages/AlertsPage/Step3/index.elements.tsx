import styled from 'styled-components';
import breakpoint from 'constants/breakpoints';
import theme from 'themes';

export interface Props {
  toggleSize?: number;
}

export const StepContainer = styled.div`
  display: flex;
  margin: 0 auto;
  padding: 1rem 0.75rem;
  width: 100%;
  flex-direction: column;
  background: #f9fafb;
  transition: all 1s linear;

  .header {
    display: flex;
    flex-direction: row;

    button.chevron {
      border: 0;
      background: none;
      cursor: pointer;
      width: 26px;
    }
  }

  .wrapper {
    display: block;

    &.closed {
      display: none;
    }

    &.open {
      display: block;

      .date-range-picker {
        left: 0;
        right: auto;
        margin-bottom: 3rem;
      }
    }
  }

  h2 {
    margin: 1rem 0.5rem;
    color: #212121;
    font-size: 16px;
  }

  .radioInput-container--label > label,
  .label,
  .label label {
    color: #323130;
    font-weight: 700;
    font-size: 12px;

    small {
      color: red;
      font-weight: 700;
    }
  }

  .select--disabled {
    cursor: none;
    opacity: 0.5;
  }

  .column {
    &.fixed-width {
      width: 200;

      @media ${breakpoint.device.lg} {
        min-width: 240px;
      }

      @media ${breakpoint.device.xl} {
        min-width: 300px;
      }
    }
  }

  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    padding: 0 1rem;

    &.reminder {
      flex-direction: column;

      .input--stopAfter {
        margin-left: 1rem;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        width: 2rem;
      }

      p {
        font-size: 14px;
        padding: 0 0.5rem;
      }
    }

    @media ${breakpoint.device.lg} {
      flex-wrap: nowrap;
    }
    input[type='number'].input--stopAfter {
      width: 6.8rem;
    }

    input[type='number'] {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      border: 1px solid #e5e9ed;
      height: 2.35rem;
      min-width: 60px;
      padding: 0 1rem;

      @media ${breakpoint.device.lg} {
        min-width: 80px;
      }

      @media ${breakpoint.device.xl} {
        min-width: 100px;
      }

      @media ${breakpoint.device.xxl} {
        min-width: 2.5rem;
      }
    }

    input[type='number']::-webkit-inner-spin-button {
      opacity: 1;
      -webkit-appearance: inner-spin-button !important;
      width: 30px;
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      background: #303e47;
    }

    .dropdown {
      select {
        min-width: 60px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        background: #ffffff;

        @media ${breakpoint.device.lg} {
          min-width: 80px;
        }

        @media ${breakpoint.device.xl} {
          min-width: 100px;
        }

        @media ${breakpoint.device.xxl} {
          min-width: 2.5rem;
        }
      }

      & > div {
        height: 2.35rem;
      }
    }

    .row {
      padding: 0.25rem;
    }

    .column {
      .row {
        padding: 0;
      }
    }

    &.column {
      display: flex;
      flex-direction: column;
      padding: 1rem;
    }

    .card {
      max-width: 420px;
      margin: 1rem auto 2rem;
      width: 100%;
      border-radius: 12px;
      box-shadow: 0px 0px 1px 1px #cccccc;
      margin-bottom: 3rem;

      .header {
        font-size: 1rem;
        font-weight: bold;
        margin: 0;
        padding: 1.25rem 1.5rem;
        background: #f7f7f8;
        border-top-right-radius: inherit;
        border-top-left-radius: inherit;
      }

      .counter {
        text-align: center;
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0.75rem 0;
      }

      .alertCount {
        padding: 2rem 0;
        background-size: cover;

        img {
          display: block;
          margin: 0 auto;
          max-width: 75px;
        }
      }
    }
  }

  div {
    label {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }

  .radioInput-container {
    min-width: 150px;
  }

  .radioInput-container--wrapper {
    &.range {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      max-width: 9.375rem;

      .matches,
      .duration {
        display: block;
        opacity: 0;
        margin: 1rem 0;
        max-width: 54px;
        min-width: 30px;

        &.active {
          opacity: 1;
        }
      }

      .duration--input {
        min-width: 65px;
      }

      .dropdown {
        max-width: 80px;

        select {
          min-width: 80px;
        }
      }

      .matches {
        min-width: 60px;
      }

      .duration {
        display: flex;
        flex-direction: row;
        max-width: 100%;
        min-width: auto;

        input {
          margin: 0;
        }
      }
    }
  }

  .radioInput-container--wrapper--input {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .input--radio {
      display: flex;
      flex-direction: column;

      input {
        align-self: flex-start;
        order: 3;
      }

      div:nth-child(2) {
        top: 32px;
        left: 0;
      }

      div:nth-child(3) {
        order: 1;
        margin: 0;
      }

      label {
        font-size: 14px;
      }
    }
  }

  .dropdown_checkboxes {
    max-width: 300px;
  }

  .option {
    .option--checkbox {
    }
  }

  .dropdown-header-row {
    .header--label {
      color: #000000;
      font-size: 14px;
      text-transform: none;
      padding: 1rem 0.25rem;
    }
  }
`;

export const ToggleInput = styled.div<Props>`
  display: flex;
  flex-direction: row;
  align-items: baseline;

  .toggle-container {
    width: ${({ toggleSize }) => (toggleSize && `calc(${toggleSize}px * 2)`) || `30px`};
    background-color: #b6caf0;
    cursor: pointer;
    user-select: none;
    border-radius: 15px;
    padding: 2px;
    height: ${({ toggleSize }) => (toggleSize && `calc(${toggleSize}px * 0.6)`) || `25px`};
    position: relative;
    margin-left: 1rem;
  }

  .dialog-button {
    cursor: pointer;
    background-color: #0a70ff;
    color: white;
    padding: ${({ toggleSize }) => (toggleSize && `calc(${toggleSize}px / 2)`) || `12px`};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    //min-width: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${({ toggleSize }) => toggleSize + 'px' || `25px`};
    height: ${({ toggleSize }) => toggleSize + 'px' || `25px`};
    min-width: unset;
    border-radius: ${({ toggleSize }) => toggleSize + 'px' || `25px`};
    box-sizing: border-box;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    position: absolute;
    left: ${({ toggleSize }) => (toggleSize && `calc(${toggleSize}px * 1.15)`) || `13px`};
    top: ${({ toggleSize }) => (toggleSize && `calc(-${toggleSize}px * 0.15)`) || `-3px`};
    transition: all 0.3s ease;
  }

  .disabled {
    background-color: #a3a3a3;
    left: ${({ toggleSize }) => (toggleSize && `calc(-${toggleSize}px * 0.15)`) || `-3px`};
  }

  .container-wrapper {
    &.reminder {
      margin-top: 1rem;
    }
  }
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;
export const InsertButton = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  cursor: pointer;
  color: ${theme.colors.primaryBlue5};
  align-items: center;
  font-size: 14px;
  border-top: 1px solid #ccc;
`;

export const MenuListOptionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
`;
export const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
