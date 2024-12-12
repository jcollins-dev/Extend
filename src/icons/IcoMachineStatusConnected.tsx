import React from 'react';

export interface IconMachineStatusConnectedProps {
  color?: string;
}
export const IcoMachineStatusConnected = ({
  color
}: IconMachineStatusConnectedProps): JSX.Element => {
  color = color || '#008200';
  return (
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.28023 8L8.61356 11.3333L7.61356 12.3333C7.39601 12.5581 7.1359 12.7373 6.8484 12.8605C6.5609 12.9837 6.25175 13.0484 5.93897 13.051C5.62619 13.0535 5.31603 12.9938 5.02657 12.8753C4.7371 12.7567 4.47412 12.5818 4.25295 12.3606C4.03177 12.1394 3.85682 11.8765 3.7383 11.587C3.61977 11.2975 3.56004 10.9874 3.56258 10.6746C3.56512 10.3618 3.62988 10.0527 3.75309 9.76516C3.8763 9.47766 4.05549 9.21756 4.28023 9L5.28023 8Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9466 8.00028L8.61328 4.66695L9.61328 3.66695C9.83084 3.44221 10.0909 3.26302 10.3784 3.13981C10.6659 3.0166 10.9751 2.95184 11.2879 2.9493C11.6007 2.94676 11.9108 3.00649 12.2003 3.12502C12.4897 3.24354 12.7527 3.41849 12.9739 3.63967C13.1951 3.86084 13.37 4.12382 13.4885 4.41329C13.6071 4.70275 13.6668 5.01291 13.6643 5.32569C13.6617 5.63847 13.597 5.94762 13.4738 6.23512C13.3505 6.52262 13.1714 6.78273 12.9466 7.00028L11.9466 8.00028Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.61328 13.9987L4.27995 12.332"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.9453 3.66667L14.612 2"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.27865 7.33203L5.94531 8.66536"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.27865 9.33203L7.94531 10.6654"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
