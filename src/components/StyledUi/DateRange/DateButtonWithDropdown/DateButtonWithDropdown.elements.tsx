import styled from 'styled-components';

export interface DateButtonWithDropdownContainerProps {
  alignDropdown?: string;
}
export const DateButtonWithDropdownContainer = styled.div<DateButtonWithDropdownContainerProps>`
  position: relative;
  width: max-content;
  height: max-content;

  .date-range-picker {
    position: absolute;
    top: 100%;
    border-top-right-radius: 0px;

    ${({ alignDropdown }) => (alignDropdown === 'left' ? `left: 0` : `right: 0`)}
  }

  &.is-open {
    button.ui-date-range-btn {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }

  &.icon-only .icon-calendar {
    width: 1em;
    height: 1em;
    path {
      stroke: #0a70ff;
    }
  }
`;
