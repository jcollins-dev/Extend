import React from 'react';

export interface IconDateHistoryProps {
  color?: string;
}

export const IcoDateHistory = ({ color }: IconDateHistoryProps): JSX.Element => {
  color = color || '#666666';

  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.96875 4.39062V7.05729L8.30208 8.39063"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 6.39197C1.14939 4.92534 1.83351 3.56505 2.92182 2.57062C4.01014 1.57619 5.42646 1.01723 6.90059 1.00039C8.37471 0.983554 9.80343 1.51001 10.9142 2.47933C12.0249 3.44864 12.7399 4.79296 12.9228 6.25579C13.1056 7.71863 12.7435 9.19758 11.9056 10.4105C11.0676 11.6234 9.81243 12.4853 8.37952 12.8319C6.94661 13.1784 5.43627 12.9853 4.13666 12.2894C2.83705 11.5934 1.83915 10.4434 1.33333 9.05864M1 12.392V9.05864H4.33333"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
