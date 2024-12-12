import styled from 'styled-components';

export interface DateButtonWithDropdownContainerProps {
  alignDropdown?: string;
}
export const DateButtonWithDropdownContainer = styled.div<DateButtonWithDropdownContainerProps>`
  position: relative;
  width: max-content;
  height: max-content;
  z-index: 999;

  .ui-date-range-picker {
    position: absolute;
    top: 100%;
    z-index: 900;
    box-shadow: 0 0.0625rem 0.375rem 0 rgb(0 0 0 / 15%);

    ${({ alignDropdown }) => (alignDropdown === 'left' ? `left: 0` : `right: 0`)}
  }

  &.is-open {
    .ui-date-range-btn {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: 0;
    }
  }
`;
