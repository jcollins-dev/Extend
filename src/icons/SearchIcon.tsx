import { styledTheme } from 'components';
import React from 'react';

export interface Props {
  color: string;
}

export const SearchIcon = ({ color }: Props): JSX.Element => {
  color = color || styledTheme.color.main;

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.33333 10.6667L7.25245 8.74755M7.25245 8.74755C7.61438 9.10948 8.11438 9.33333 8.66667 9.33333C9.77124 9.33333 10.6667 8.4379 10.6667 7.33333C10.6667 6.22876 9.77124 5.33333 8.66667 5.33333C7.5621 5.33333 6.66667 6.22876 6.66667 7.33333C6.66667 7.88562 6.89052 8.38562 7.25245 8.74755ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
        stroke={`${color}`}
        strokeLinecap="round"
      />
    </svg>
  );
};
