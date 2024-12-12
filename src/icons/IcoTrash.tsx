import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg.attrs(({ width }) => ({
  width: width || `100%`,
  height: width || `auto`,
  viewBox: '0 0 21 21',
  fill: 'none'
}))``;

export const IcoTrash = ({
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
        d="M12.667 4.66667L12.0888 12.7617C12.0389 13.4594 11.4584 14 10.7588 14H5.24182C4.5423 14 3.96171 13.4594 3.91187 12.7617L3.33366 4.66667M6.66699 7.33333V11.3333M9.33366 7.33333V11.3333M10.0003 4.66667V2.66667C10.0003 2.29848 9.70185 2 9.33366 2H6.66699C6.2988 2 6.00033 2.29848 6.00033 2.66667V4.66667M2.66699 4.66667H13.3337"
        stroke={color ? `${color}` : '#B62C10'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
