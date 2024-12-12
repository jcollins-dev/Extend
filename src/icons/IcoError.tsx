import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg.attrs(({ width }) => ({
  width: width || '20px',
  height: width ? 'auto' : '20px',
  viewBox: '3 -4 9 19',
  fill: 'none'
}))``;

export const IcoError = ({ width }: { width?: string }): JSX.Element => {
  return (
    <Svg {...{ width }}>
      <g clipPath="url(#clip0_6_9762)">
        <path
          d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
          stroke="#AB091E"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 5.33337V8.00004"
          stroke="#AB091E"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 10.6666H8.005" stroke="#AB091E" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_6_9762">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </Svg>
  );
};
