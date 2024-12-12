import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg.attrs(({ width }) => ({
  width: width || '20px',
  height: width ? 'auto' : '20px',
  viewBox: '2 -4 9 19',
  fill: 'none'
}))``;

export const IcoCheckIn = ({ width }: { width?: string }): JSX.Element => {
  return (
    <Svg {...{ width }}>
      <path
        d="M5 7L6.33333 8.33333L9 5.66667M13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1C10.3137 1 13 3.68629 13 7Z"
        stroke="#28B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
