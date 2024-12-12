import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg.attrs(({ width }) => ({
  width: width || `100%`,
  height: width || `auto`,
  viewBox: '0 0 21 21',
  fill: 'none'
}))``;

export const IcoPlus = ({
  width,
  color,
  srLabel
}: {
  width?: string;
  color?: string;
  srLabel?: string;
}): JSX.Element => {
  return (
    <Svg
      {...{ width, color }}
      className="icon--pencil icon"
      focusable="true"
      aria-label={srLabel || `edit`}
    >
      <path
        d="M6.00033 0.666016V11.3327M11.3337 5.99935L0.666992 5.99935"
        stroke="#0076CC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
