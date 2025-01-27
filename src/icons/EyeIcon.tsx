import { styledTheme } from 'components';
import React from 'react';

export interface Props {
  color: string;
}

export const EyeIcon = ({ color }: Props): JSX.Element => {
  color = color || styledTheme.color.main;

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.99984 8.00065C9.99984 9.10522 9.10441 10.0007 7.99984 10.0007C6.89527 10.0007 5.99984 9.10522 5.99984 8.00065C5.99984 6.89608 6.89527 6.00065 7.99984 6.00065C9.10441 6.00065 9.99984 6.89608 9.99984 8.00065Z"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.63867 8.00063C2.48819 5.2959 5.01504 3.33398 8.00013 3.33398C10.9852 3.33398 13.5121 5.29593 14.3616 8.00068C13.5121 10.7054 10.9852 12.6673 8.00014 12.6673C5.01504 12.6673 2.48817 10.7054 1.63867 8.00063Z"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
