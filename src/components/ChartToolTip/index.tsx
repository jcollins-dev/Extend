// 3rd party libs
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

export interface ChartToolTipProps {
  x: number;
  y: number;
  content?: React.ReactNode;
}

const Container = styled.div`
  pointer-events: none;
  position: absolute;
  z-index: 999;
  transform: translate(-50%, -100%);
  margin-top: -0.625rem; /* Offset to account for 0.625rem arrow height */
  background: ${({ theme }) => theme.colors.white};
  border-radius: 0.5rem;
  box-shadow: 0 0.625rem 1rem rgba(0, 0, 0, 0.1), 0 0.25rem 0.375rem rgba(0, 0, 0, 0.05),
    0 0 0 rgba(0, 0, 0, 0.05);

  /* Downward triangle */
  :after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0.625rem 0.625rem 0 0.625rem;
    border-color: ${({ theme }) => theme.colors.white} transparent transparent transparent;
    position: absolute;
    /* -1px to remove tiny line artifact between arrow and div, due to pixel rounding */
    top: calc(100% - 1px);
    left: 50%;
    transform: translateX(-50%);
  }
`;

/**
 * DOM based tooltip, to give us more control over the tooltip content/layout than the SVG based Victory tooltips.
 * Will simply render the content passed in, and will position itself based on the x and y coordinates.
 */
const ChartToolTip = (props: ChartToolTipProps): JSX.Element =>
  ReactDOM.createPortal(
    <Container
      style={{
        left: props.x,
        top: props.y
      }}
    >
      {props.content}
    </Container>,
    document.body
  );

export default ChartToolTip;
