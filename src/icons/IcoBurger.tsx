import React from 'react';

export interface IconBurgerProps {
  color?: string;
}

export const IcoBurger = ({ color }: IconBurgerProps): JSX.Element => {
  color = color || '#666666';

  return (
    <svg
      className="icon-burger"
      width="18"
      height="15"
      viewBox="0 0 18 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1.5H17M1 7.5H17M1 13.5H17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
