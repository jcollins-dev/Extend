import React, { ReactElement } from 'react';

import { MachineProps } from 'types';
import styled from 'styled-components';
import { default as theme } from 'themes';

const MachineCard = styled.div`
  position: relative;
  max-width: 15rem;
  height: 30rem;
  box-sizing: border-box;
  border: ${theme.colors.borders.border02.border};
  box-shadow: ${theme.colors.borders.border02.shadow};
  border-radius: 10px;
  background-color: transparent;
  margin-right: 50px;
`;

const CardUpperArea = styled.div`
  max-height: 13.43rem;
  padding: 1.875rem;
`;

const CardLowerArea = styled.div`
  font-family: ${theme.typography.family};
`;

const CardAlertArea = styled.div`
  position: absolute;
  height: 25%;
`;

const MachineTitle = styled.h3`
  margin-bottom: 0;
`;

const CardRow = styled.div`
  width: 100%;
  background-color: rgba(217, 221, 229, 0.3);
  box-sizing: border-box;
  padding: 5px 1.875rem;
`;

const CardRowTitle = styled.h5`
  margin: 0px;
`;

const MachineDetailDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
`;

const MachineDetailModule = styled.div`
  width: 100%;
  padding: 5px 1rem;
  margin-bottom: 0;
`;

const NumericDetail = styled.h4`
  margin: 0px;
`;

const DescriptionDetail = styled.h5`
  margin: 0px;
  font-size: 10px;
  font-weight: normal;
  margin-bottom: 0;
`;

const throughputLabels = ['Current', 'Avg Hour', 'Avg Shift', 'Total Shift/Day'];
const lineSpeedLabels = ['Current', 'Avg Hour', 'Avg Shift'];
const downtimeLabels = ['Shift/Day', 'Weekly'];

const DashboardMachineCard = ({ machine }: MachineProps): ReactElement => {
  // TODO: move this data to the backend
  const tempMetricData = {
    throughput: ['1040', '1500', '2000', '6000'],
    lineSpeed: ['103', '108', '110'],
    downtime: ['1:10:12', '1:30:15']
  };
  return (
    <MachineCard>
      <CardUpperArea>
        <CardAlertArea></CardAlertArea>
        <img src="https://via.placeholder.com/182x100" />
        <MachineTitle>{machine.nickname}</MachineTitle>
      </CardUpperArea>
      <CardLowerArea>
        <CardRow>
          <CardRowTitle>Throughput (lbs/hour)</CardRowTitle>
        </CardRow>
        <MachineDetailDiv>
          {tempMetricData.throughput &&
            tempMetricData.throughput
              .filter((item, index) => index <= 2)
              .map((number, index) => (
                <MachineDetailModule key={index}>
                  <NumericDetail>{number}</NumericDetail>
                  <DescriptionDetail>{throughputLabels[index]}</DescriptionDetail>
                </MachineDetailModule>
              ))}
        </MachineDetailDiv>
        {tempMetricData.throughput && tempMetricData.throughput.length > 3 && (
          <MachineDetailDiv>
            <MachineDetailModule>
              <NumericDetail>{tempMetricData.throughput[3]}</NumericDetail>
              <DescriptionDetail>{throughputLabels[3]}</DescriptionDetail>
            </MachineDetailModule>
          </MachineDetailDiv>
        )}
        <CardRow>
          <CardRowTitle>Line Speed</CardRowTitle>
        </CardRow>
        <MachineDetailDiv>
          {tempMetricData.lineSpeed?.map((number, index) => (
            <MachineDetailModule key={index}>
              <NumericDetail>{number}</NumericDetail>
              <DescriptionDetail>{lineSpeedLabels[index]}</DescriptionDetail>
            </MachineDetailModule>
          ))}
        </MachineDetailDiv>
        <CardRow>
          <CardRowTitle>Downtime</CardRowTitle>
        </CardRow>
        <MachineDetailDiv>
          {tempMetricData.downtime?.map((number, index) => (
            <MachineDetailModule key={index}>
              <NumericDetail>{number}</NumericDetail>
              <DescriptionDetail>{downtimeLabels[index]}</DescriptionDetail>
            </MachineDetailModule>
          ))}
        </MachineDetailDiv>
      </CardLowerArea>
    </MachineCard>
  );
};

export default DashboardMachineCard;
