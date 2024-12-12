import React from 'react';
import styled from 'styled-components';
import { styledTheme } from 'components';

const Svg = styled.svg.attrs(({ width }) => ({
  width: width || `100%`,
  height: width || `auto`,
  viewBox: '0 0 21 21',
  fill: 'none'
}))``;

export const IconPencil = ({
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
        d="M18.7677 1.73223L19.4748 1.02513V1.02513L18.7677 1.73223ZM5 19.0355V20.0355C5.26522 20.0355 5.51957 19.9301 5.70711 19.7426L5 19.0355ZM1.5 19.0355H0.5C0.5 19.5878 0.947715 20.0355 1.5 20.0355L1.5 19.0355ZM1.5 15.4644L0.792893 14.7573C0.605357 14.9448 0.5 15.1992 0.5 15.4644H1.5ZM15.9393 2.43934C16.5251 1.85355 17.4748 1.85355 18.0606 2.43934L19.4748 1.02513C18.108 -0.341709 15.8919 -0.341709 14.5251 1.02513L15.9393 2.43934ZM18.0606 2.43934C18.6464 3.02513 18.6464 3.97487 18.0606 4.56066L19.4748 5.97487C20.8417 4.60804 20.8417 2.39196 19.4748 1.02513L18.0606 2.43934ZM18.0606 4.56066L4.29289 18.3284L5.70711 19.7426L19.4748 5.97487L18.0606 4.56066ZM5 18.0355H1.5V20.0355H5V18.0355ZM14.5251 1.02513L0.792893 14.7573L2.20711 16.1715L15.9393 2.43934L14.5251 1.02513ZM0.5 15.4644V19.0355H2.5V15.4644H0.5ZM13.0251 3.93934L16.5606 7.47487L17.9748 6.06066L14.4393 2.52513L13.0251 3.93934Z"
        fill={color || styledTheme.color.main}
      />
    </Svg>
  );
};
