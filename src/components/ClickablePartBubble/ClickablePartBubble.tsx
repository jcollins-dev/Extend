// Third party
import React, { ReactElement, useRef } from 'react';
import { rgba } from 'polished';

// Theme
import { default as theme } from 'themes';
import { themeColors } from 'themes';

// Types
import { Bubble, Id } from 'types';
import { DiagramBubbleAction, Part } from 'types/parts';
import styled from 'styled-components';

// Props
interface ClickablePartBubbleProps {
  color?: string;
  fontColor?: string;
  alpha?: number;
  onClick?: DiagramBubbleAction;
  part?: Part;
  id: Id;
  partUuid?: Id;
  partLabel?: string;
  index: string;
  x?: number;
  y?: number;
  radius: number;
  loading?: boolean;
  bubbleType?: 'circle' | 'square' | 'circleOutline' | 'squareLegend' | 'squareCircleLegend';
  disabled?: boolean;
  preventClicks?: boolean;
  bubbleEditId?: Id;
}

interface BubbleBaseProps {
  preventClicks?: boolean;
}
const BubbleBase = styled.g<BubbleBaseProps>`
  @keyframes bubble {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }
  }

  animation-name: bubble;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  pointer-events: ${(props) => (props.preventClicks ? 'none' : 'auto')};
`;

const ClickablePartBubble = ({
  id,
  index,
  radius,
  x,
  y,
  partUuid,
  partLabel,
  color,
  onClick,
  alpha = 0.4,
  part,
  preventClicks,
  fontColor = 'white',
  loading = false,
  bubbleType = 'circle',
  disabled = false,
  bubbleEditId
}: ClickablePartBubbleProps): ReactElement => {
  const marker: Bubble = {
    id: id,
    index: index,
    radius: radius,
    x: x || 0,
    y: y || 0,
    partUuid: partUuid,
    partLabel: partLabel
  };
  // Hide if disabled
  color = color === undefined || loading ? theme.colors.lightGrey4 : color;
  const bgColor = color.includes('rgb') ? color : rgba(color, alpha);
  const bubbleBaseRef = useRef(null);

  const handleOnClick = (event: React.MouseEvent) => {
    if (onClick && !disabled) {
      onClick(marker, event, bubbleBaseRef, part, undefined, bubbleEditId);
      event.stopPropagation();
    }
  };
  return (
    <BubbleBase
      id={`clickable-bubble-${id}`}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        animationName: loading ? 'bubble' : 'none'
      }}
      transform={x && x > 0 && y && y > 0 ? `translate(${x} ${y})` : ''}
      onClick={handleOnClick}
      role="link"
      ref={bubbleBaseRef}
      preventClicks={!part?.isAssembly ? preventClicks : false}
    >
      {/* background circle */}
      {bubbleType && bubbleType === 'circle' && <circle r={radius * 1.5} fill={bgColor} />}
      {/* main circle */}
      {bubbleType && bubbleType === 'circle' && <circle r={radius} fill={color} />}

      {/* background square */}
      {bubbleType && bubbleType === 'square' && (
        <rect
          width={radius * 3}
          height={radius * 3}
          fill={bgColor}
          x={-radius * 1.5}
          y={-radius * 1.5}
          rx={10}
          ry={10}
        />
      )}
      {/* main square */}
      {bubbleType && bubbleType === 'square' && (
        <rect
          width={radius * 2.3}
          height={radius * 2.3}
          fill={color}
          x={-radius * 1.15}
          y={-radius * 1.15}
          rx={10}
          ry={10}
        />
      )}

      {/* Circle Border */}
      {bubbleType && bubbleType === 'circleOutline' && (
        <circle r={radius} fill={'white'} stroke={'black'} />
      )}

      {/* background square for Legend */}
      {bubbleType && bubbleType === 'squareLegend' && (
        <rect
          width={radius * 3}
          height={radius * 3}
          fill={bgColor}
          x={-radius * 1.5}
          y={-radius * 1.5}
          rx={2}
          ry={2}
        />
      )}
      {/* main square for Legend*/}
      {bubbleType && bubbleType === 'squareLegend' && (
        <rect
          width={radius * 2.3}
          height={radius * 2.3}
          fill={color}
          x={-radius * 1.15}
          y={-radius * 1.15}
          rx={2}
          ry={2}
        />
      )}

      {/* background square  with circle on top right corner Legend Icon*/}
      {bubbleType && bubbleType === 'squareCircleLegend' && (
        <rect
          width={radius * 3}
          height={radius * 3}
          fill={bgColor}
          x={-radius * 1.5}
          y={-radius * 1.5}
          rx={2}
          ry={2}
        />
      )}
      {/* main  square with circle on top right corner Legend Icon*/}
      {bubbleType && bubbleType === 'squareCircleLegend' && (
        <rect
          width={radius * 2.3}
          height={radius * 2.3}
          fill={color}
          x={-radius * 1.15}
          y={-radius * 1.15}
          rx={2}
          ry={2}
        />
      )}

      {/* circle on top right corner of the square-circle Legend Icon*/}
      {bubbleType && bubbleType === 'squareCircleLegend' && (
        <circle r={radius * 0.75} fill={themeColors.mediumBlue} cx={radius * 1.3} cy={-radius} />
      )}

      {/* TODO: add subpart count circle */}
      {bubbleType && bubbleType !== 'circleOutline' && (
        <text
          fontFamily={theme.typography.family}
          fontSize={`${radius / 16}rem`}
          fontWeight="bold"
          stroke="none"
          fill={fontColor}
          textAnchor="middle"
          y={radius / 3}
        >
          {index}
        </text>
      )}

      {bubbleType && bubbleType === 'circleOutline' && (
        <text
          fontFamily={theme.typography.family}
          fontSize={`${radius / 16}rem`}
          fontWeight="bold"
          stroke="none"
          fill={'black'}
          textAnchor="middle"
          y={radius / 3}
        >
          {index}
        </text>
      )}
    </BubbleBase>
  );
};

export default ClickablePartBubble;
