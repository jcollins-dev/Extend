import React from 'react';
import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

export interface IconChevronProps extends StyledUiContainerProps {
  dir?: 'up' | 'down' | 'left' | 'right';
}

const Path = styled.path<IconChevronProps>`
  transform: ${({ dir }) =>
    dir && `rotate(${dir === 'up' ? 180 : dir === 'left' ? 90 : dir === 'right' ? 270 : 0}deg )`};
`;

export const IcoChevron = ({ color }: IconChevronProps): JSX.Element => {
  color = color || '#008200';
  return (
    <svg
      className="icon-chevron"
      width="13"
      height="13"
      viewBox="0 0 13 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M6.33528 7.10938L0.398437 0.768066L1.11751 1.34293e-07L6.33528 5.57324L11.5531 2.08321e-06L12.2721 0.768069L6.33528 7.10938Z"
        fill={color}
      />
    </svg>
  );
};
