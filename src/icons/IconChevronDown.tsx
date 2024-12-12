import { styledTheme } from 'components';
import React from 'react';

export interface Props {
  color?: string;
}

export const ChevronDown = ({ color }: Props): JSX.Element => {
  color = color || styledTheme.color.main;

  return (
    <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 1.5L7 7.5L13 1.5"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
