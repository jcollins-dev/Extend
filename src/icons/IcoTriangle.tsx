import React from 'react';

export const IcoTriangle = ({ color }: { color?: string }): JSX.Element => {
  color = color || '#008200';
  return (
    <svg
      className="icon-triangle"
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.87417 1.35C8.37454 0.483334 9.62546 0.483334 10.1258 1.35L17.054 13.35C17.5544 14.2167 16.9289 15.3 15.9282 15.3H2.0718C1.07106 15.3 0.445594 14.2167 0.945964 13.35L7.87417 1.35Z"
        stroke={color}
        strokeWidth="1.4"
      />
    </svg>
  );
};
