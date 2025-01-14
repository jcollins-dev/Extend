import React from 'react';

export const IcoCalendar = ({ color }: { color?: string }): JSX.Element => {
  color = color || '#0076CC';
  return (
    <svg
      className="icon-calendar"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.33333 3.66667V1M9.66667 3.66667V1M3.66667 6.33333H10.3333M2.33333 13H11.6667C12.403 13 13 12.403 13 11.6667V3.66667C13 2.93029 12.403 2.33333 11.6667 2.33333H2.33333C1.59695 2.33333 1 2.93029 1 3.66667V11.6667C1 12.403 1.59695 13 2.33333 13Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
