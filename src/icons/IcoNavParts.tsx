import React from 'react';

export interface IconNavPartsProps {
  color?: string;
}

export const IcoNavParts = ({ color }: IconNavPartsProps): JSX.Element => {
  color = color || '#323130';

  return (
    <svg
      className="icon-nav-parts"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.55438 0V3.01444C6.053 2.74167 3.02483 5.35063 3.01444 8.90476V9.55438H0C0.291482 14.2605 4.21328 18 8.99134 18C13.9587 18 18 13.9587 18 8.99134C18 4.21328 14.2605 0.291482 9.55438 0ZM7.875 15.75V14.625H9V15.75H7.875ZM13.5 13.5V12.375H12.375V13.5H13.5ZM12.375 4.5H11.25V3.375H12.375V4.5ZM14.625 7.875V9H15.75V7.875H14.625ZM9 5.625C10.8609 5.625 12.375 7.13905 12.375 9C12.375 10.8609 10.8609 12.375 9 12.375C7.13905 12.375 5.625 10.8609 5.625 9C5.625 7.13905 7.13905 5.625 9 5.625ZM4.5 12.375H3.375V13.5H4.5V12.375Z"
        fill={color}
      />
    </svg>
  );
};
