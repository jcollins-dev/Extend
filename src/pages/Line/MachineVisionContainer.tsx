import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { VictoryLine } from 'victory';

// Components
import { KPIPanel, KPISmallPanel, Column, Row } from 'components';

// Types
import {
  MachineVisionInterval,
  MachineVisionKpiItem,
  MachineVisionType
} from 'types/machine-vision';

// Themes
import theme from 'themes';

// Hooks
import useMachineVisionKpi from 'hooks/useMachineVisionKpi';

// Styling
const Container = styled.div`
  margin-top: 0rem;
`;

// 9,000 lbs/hr  target throughput rate
const TARGET_RATE = 9000;

const KPIWitContainer = (): ReactElement | null => {
  const {
    result: resultThroughput,
    isLoading: isLoadingThroughput,
    error: errorThroughput
  } = useMachineVisionKpi(MachineVisionType.Throughput, true, MachineVisionInterval.CurrentDay);
  // Add data for internal temp later, internal temp
  // const internalTempData = useMachineVisionKpi(MachineVisionType.InternalTemp);
  const { result: resultWeight, isLoading: isLoadingWeight } = useMachineVisionKpi(
    MachineVisionType.Weight,
    false
  );

  const {
    result: resultAverage,
    isLoading: isLoadingAverage,
    error: errorAverage
  } = useMachineVisionKpi(MachineVisionType.Average, false);

  const { result: resultTargetWeight, isLoading: isLoadingTargetWeight } = useMachineVisionKpi(
    MachineVisionType.TargetWeight,
    false
  );

  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (errorThroughput || errorAverage) {
      setHasData(false);
    } else {
      setHasData(
        (!!resultThroughput && resultThroughput.values.length > 0) ||
          (!!resultAverage && resultAverage.values.length > 0)
      );
    }
  }, [resultThroughput, resultAverage, errorAverage, errorThroughput]);

  // Target throughput rate
  const targetRate = (throughput: MachineVisionKpiItem) => {
    const { values } = throughput;
    if (values.length < 1) return undefined;

    const start = new Date(values[0].timestamp);
    const end = new Date(values[values.length - 1].endTimestamp);
    return (
      <VictoryLine
        style={{
          data: { stroke: theme.colors.green }
        }}
        data={[
          { x: start, y: TARGET_RATE },
          { x: end, y: TARGET_RATE }
        ]}
      />
    );
  };

  if (!hasData) return null;

  return (
    <Container className="line-status-col">
      <Row>
        <Column size={1}>
          <KPISmallPanel
            isLoading={isLoadingWeight || isLoadingTargetWeight || isLoadingAverage}
            KPIData={{ weight: resultWeight, average: resultAverage, target: resultTargetWeight }}
            precision={{ weight: 0, average: 1, target: 0 }}
          />
        </Column>
        <Column size={2}>
          <KPIPanel
            chartHeight="100%"
            isLoading={isLoadingThroughput}
            KPIData={resultThroughput ? resultThroughput : undefined}
            showxAxis={true}
            custom={resultThroughput ? targetRate(resultThroughput) : undefined}
            isZoomEnabled
          />
        </Column>
      </Row>
    </Container>
  );
};

export default KPIWitContainer;
