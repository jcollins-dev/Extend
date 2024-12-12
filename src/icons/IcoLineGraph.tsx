import React from 'react';

export const IcoLineGragh = ({ color }: { color?: string }): JSX.Element => {
  color = color || '#FF0000';
  return (
    <svg
      className="icon-line-graph"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      1
      <path
        d="M2 11.3334L6 7.33341L8.66667 10.0001L14 4.66675"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.3335 4.66675H14.0002V9.33341"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
