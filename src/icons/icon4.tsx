import { styledTheme } from 'components';
import React from 'react';

export interface Props {
  color?: string;
}

export const Icon4 = ({ color }: Props): JSX.Element => {
  color = color || styledTheme.color.main;

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_406_150453)">
        <path
          d="M2 4.66667C2 3.95942 2.28095 3.28115 2.78105 2.78105C3.28115 2.28095 3.95942 2 4.66667 2H11.3333C12.0406 2 12.7189 2.28095 13.219 2.78105C13.719 3.28115 14 3.95942 14 4.66667V11.3333C14 12.0406 13.719 12.7189 13.219 13.219C12.7189 13.719 12.0406 14 11.3333 14H4.66667C3.95942 14 3.28115 13.719 2.78105 13.219C2.28095 12.7189 2 12.0406 2 11.3333V4.66667Z"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.99916 4.66603C9.30316 4.66603 10.4818 5.20069 11.3325 6.06269L9.36183 7.99869C8.9922 7.65635 8.50698 7.46611 8.00316 7.46603C7.49944 7.46593 7.01423 7.65592 6.6445 7.99803L4.67383 6.06269C5.10819 5.61932 5.62688 5.26734 6.19934 5.02748C6.77181 4.78761 7.38648 4.66472 8.00716 4.66603H7.99916Z"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_406_150453">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
