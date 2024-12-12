import React from 'react';

export interface IconMagnifyingGlassProps {
  color?: string;
}

export const IcoMagnifyingGlass = ({ color }: IconMagnifyingGlassProps): JSX.Element => {
  color = color || '#008200';
  return (
    <svg
      className="icon-magnifying-glass"
      width="6"
      height="4"
      viewBox="0 0 6 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 2.0013L2.33333 3.33464L5 0.667969"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
