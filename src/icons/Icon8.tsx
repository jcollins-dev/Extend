import { styledTheme } from 'components';
import React from 'react';

export interface Props {
  color?: string;
}

export const Icon8 = ({ color }: Props): JSX.Element => {
  color = color || styledTheme.color.main;

  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_319_146910)">
        <path
          d="M12.6775 6.66667H3.00195L5.76641 4"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.76562 9.33203H15.4412L12.6768 11.9987"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_319_146910">
          <rect width="16.5867" height="16" fill="white" transform="translate(0.927734)" />
        </clipPath>
      </defs>
    </svg>
  );
};
