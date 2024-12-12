import React from 'react';

export interface IconInfoProps {
  color?: string;
}

export const IcoInfo = ({ color }: IconInfoProps): JSX.Element => {
  color = color || '#303E47';

  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_2207_16154" maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18 9C18 13.9717 13.9702 18 9 18C4.02979 18 0 13.9717 0 9C0 4.03124 4.02979 0 9 0C13.9702 0 18 4.03124 18 9ZM9 7.3125C9.93198 7.3125 10.6875 6.55698 10.6875 5.625C10.6875 4.69302 9.93198 3.9375 9 3.9375C8.06802 3.9375 7.3125 4.69302 7.3125 5.625C7.3125 6.55698 8.06802 7.3125 9 7.3125ZM10.4003 8.83638L10.6868 13.6176C10.7013 13.8593 10.4899 14.0625 10.2241 14.0625H7.77599C7.5101 14.0625 7.29872 13.8593 7.3132 13.6176L7.59971 8.83638C7.61311 8.61265 7.81635 8.4375 8.0625 8.4375H9.9375C10.1837 8.4375 10.3869 8.61265 10.4003 8.83638Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_2207_16154)">
        <rect width="18" height="18" fill={color} />
      </g>
    </svg>
  );
};
