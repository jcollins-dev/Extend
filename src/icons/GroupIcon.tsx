import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg.attrs(({ width }) => ({
  width: width || '20px',
  height: width ? 'auto' : '20px',
  viewBox: '2 -4 9 19',
  fill: 'none'
}))``;
const GroupIcon = ({ width }: { width?: string }): JSX.Element => {
  return (
    <Svg {...{ width }}>
      <path d="M0.5 1H6" stroke="#0076CC" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0.5 5H6" stroke="#0076CC" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0.5 9H6" stroke="#0076CC" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0.5 13H6" stroke="#0076CC" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 1H15.5" stroke="#0076CC" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 5H15.5" stroke="#0076CC" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9H15.5" stroke="#0076CC" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 13H15.5" stroke="#0076CC" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default GroupIcon;
