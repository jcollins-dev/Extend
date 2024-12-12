import { styledTheme } from 'components';
import React from 'react';

export interface Props {
  color?: string;
}

export const Icon5 = ({ color }: Props): JSX.Element => {
  color = color || styledTheme.color.main;

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_406_150463)">
        <path
          d="M14 11.9H2C2 9.2 2.94733 9.2 4.52667 9.2C8 9.2 5.33333 6.14 5.33333 4.66667C5.33333 3.95942 5.61428 3.28115 6.11438 2.78105C6.61448 2.28095 7.29276 2 8 2C8.70724 2 9.38552 2.28095 9.88562 2.78105C10.3857 3.28115 10.6667 3.95942 10.6667 4.66667C10.6667 6.14 8 9.2 11.4733 9.2C13.0527 9.2 14 9.2 14 11.9Z"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.33398 14H12.6673"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_406_150463">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
