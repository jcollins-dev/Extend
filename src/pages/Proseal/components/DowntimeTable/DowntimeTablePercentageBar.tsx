import React from 'react';
import styled from 'styled-components';
import { themeColors } from 'themes';

const BORDER_RADIUS = 4;

const StyledPercentageBar = styled.div`
  background-color: ${themeColors.greyBlue};
  height: 20px;
  border-radius: ${BORDER_RADIUS}px;
  position: relative;
  top: -20px;
`;

const PercentageBarContainer = styled.div`
  background-color: ${themeColors.lightGrey2};
  width: 80%;
  border-radius: ${BORDER_RADIUS}px;
`;

const Tick = styled.div`
  height: 100%;
  width: 1px;
  background-color: ${themeColors.lightGrey3};
`;

const TickContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-evenly;
`;

const HorizontalFlexContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: right;
`;

const DataContainer = styled.div`
  text-align: right;
  padding-right: 10px;
  width: 50%;
`;

export const DowntimeTablePercentageBar = (props: {
  value: boolean | string | number | JSX.Element;
  percentage: number;
}): JSX.Element => {
  return (
    <HorizontalFlexContainer>
      <DataContainer>{props.value}</DataContainer>
      <PercentageBarContainer>
        <TickContainer>
          <Tick />
          <Tick />
          <Tick />
        </TickContainer>
        <StyledPercentageBar style={{ width: `${props.percentage}%` }} />
      </PercentageBarContainer>
    </HorizontalFlexContainer>
  );
};
