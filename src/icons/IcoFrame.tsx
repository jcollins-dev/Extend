import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg.attrs(({ width }) => ({
  width: width || `100%`,
  height: width || `auto`,
  viewBox: '0 0 21 21',
  fill: 'none'
}))``;

export const IcoFrame = ({
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
        d="M3.99967 2.33333H2.66634C1.92996 2.33333 1.33301 2.93029 1.33301 3.66667V11.6667C1.33301 12.403 1.92996 13 2.66634 13H9.33301C10.0694 13 10.6663 12.403 10.6663 11.6667V3.66667C10.6663 2.93029 10.0694 2.33333 9.33301 2.33333H7.99967M3.99967 2.33333C3.99967 3.06971 4.59663 3.66667 5.33301 3.66667H6.66634C7.40272 3.66667 7.99967 3.06971 7.99967 2.33333M3.99967 2.33333C3.99967 1.59695 4.59663 1 5.33301 1H6.66634C7.40272 1 7.99967 1.59695 7.99967 2.33333"
        stroke="#0076CC"
        strokeLinecap="round"
      />
    </Svg>
  );
};
