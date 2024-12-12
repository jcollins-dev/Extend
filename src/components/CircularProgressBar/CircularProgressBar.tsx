import React, { ReactElement, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

interface Props {
  size: number;
  progress: number;
  label: string;
  strokeWidth: number;
  circleOneStroke: string;
  circleTwoStroke: string;
}

const CircularProgressContainer = styled.div`
  padding: 0 0 0 0.8125rem;
`;

const Svg = styled.svg`
  display: block;
  max-width: 100%;
`;

const IndicatorCircleBackground = styled.circle`
  fill: none;
`;

const IndicatorCircleProgress = styled.circle`
  fill: none;
  transform-origin: center;
  transform: rotate(90deg);
`;

const ProgressContainer = styled.text`
  text-anchor: middle;
  fill: #303e47;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.3125rem;
  letter-spacing: 0rem;
  text-align: center;
`;

const LabelContainer = styled.text`
  text-anchor: middle;
  fill: #828285;
  font-size: 0.8125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: 0rem;
  text-align: center;
`;

const CircularProgressBar = ({
  size,
  progress,
  label,
  strokeWidth,
  circleOneStroke,
  circleTwoStroke
}: Props): ReactElement => {
  const [offset, setOffset] = useState(0);
  const circleRef = useRef(null);

  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const labelArray = label.split(' ');

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);
  }, [setOffset, progress, circumference, offset]);

  return (
    <CircularProgressContainer>
      <Svg width={size} height={size}>
        <IndicatorCircleBackground
          stroke={circleOneStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <IndicatorCircleProgress
          ref={circleRef}
          stroke={circleTwoStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <ProgressContainer x={`${center}`} y={`${center}`}>
          {progress}%
        </ProgressContainer>
        {labelArray.map((labelElement, i) => {
          return (
            <LabelContainer key={i} x={`${center}`} y={`${center + 16 * (1 + i)}`}>
              {labelElement}
            </LabelContainer>
          );
        })}
      </Svg>
    </CircularProgressContainer>
  );
};

export default CircularProgressBar;
