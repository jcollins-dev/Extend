import { styledTheme } from 'components';
import React from 'react';

export interface Props {
  color?: string;
}

export const Icon1 = ({ color }: Props): JSX.Element => {
  color = color || styledTheme.color.main;

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_406_150412)">
        <path
          d="M6.00065 3.33398H12.0007C12.1775 3.33398 12.347 3.40422 12.4721 3.52925C12.5971 3.65427 12.6673 3.82384 12.6673 4.00065V10.0007M12.4727 12.4713C12.4107 12.5334 12.3372 12.5827 12.2562 12.6163C12.1752 12.65 12.0884 12.6673 12.0007 12.6673H4.00065C3.82384 12.6673 3.65427 12.5971 3.52925 12.4721C3.40422 12.347 3.33398 12.1775 3.33398 12.0007V4.00065C3.33398 3.81932 3.40598 3.65532 3.52332 3.53532"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.66667 6H10V7.33333M10 10H6V6"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 6.66602H3.33333"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 9.33398H3.33333"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.66602 2V3.33333"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33398 2V3.33333"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.9993 6.66602H12.666"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.9993 9.33398H12.666"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33398 13.9993V12.666"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.66602 13.9993V12.666"
          stroke={`${color}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M2 2L14 14" stroke={`${color}`} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_406_150412">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
