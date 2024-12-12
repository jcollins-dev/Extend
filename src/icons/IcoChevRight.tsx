import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg.attrs(() => ({
  width: 10,
  height: 16,
  viewBox: '0 0 10 16',
  fill: 'none'
}))``;

export const IcoChevRight = (): JSX.Element => {
  return (
    <Svg className="icon__chev--right">
      <path
        d="M1.67187 1L8.67187 8L1.67188 15"
        stroke="#303E47"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
