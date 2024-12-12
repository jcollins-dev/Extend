import { styledTheme } from 'components';
import React from 'react';

export interface Props {
  color?: string;
}

export const Icon6 = ({ color }: Props): JSX.Element => {
  color = color || styledTheme.color.main;

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_406_150467)">
        <path
          d="M6.66732 9C6.15894 9.29351 5.76162 9.74657 5.53697 10.2889C5.31233 10.8313 5.27292 11.4326 5.42485 11.9996C5.57678 12.5666 5.91157 13.0677 6.37729 13.425C6.84301 13.7824 7.41363 13.9761 8.00065 13.9761C8.58768 13.9761 9.1583 13.7824 9.62402 13.425C10.0897 13.0677 10.4245 12.5666 10.5765 11.9996C10.7284 11.4326 10.689 10.8313 10.4643 10.2889C10.2397 9.74657 9.84236 9.29351 9.33399 9V3.33333C9.33399 2.97971 9.19351 2.64057 8.94346 2.39052C8.69341 2.14048 8.35427 2 8.00065 2C7.64703 2 7.30789 2.14048 7.05784 2.39052C6.8078 2.64057 6.66732 2.97971 6.66732 3.33333V9Z"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.66602 6H9.33268"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_406_150467">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
