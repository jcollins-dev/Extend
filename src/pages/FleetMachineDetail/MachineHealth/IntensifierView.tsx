import React from 'react';
import { IntensifierViewContainer } from './MachineHealth.elements';
import { AlarmsAndSkidsArea } from './IntensifierViewAlarmsAndSkids';
import { StrokeCountAreaChart } from './components/SkidStrokeCountsChart/StrokeCountAreaChart';

export const IntensifierView = (): JSX.Element => {
  return (
    <IntensifierViewContainer className="page-view--intensifiers">
      <AlarmsAndSkidsArea />
      <StrokeCountAreaChart />
    </IntensifierViewContainer>
  );
};

export const intensifierColors: Record<string, string> = {
  intensifier_utilization_1_1: 'rgba(17, 141, 255, 1)',
  intensifier_utilization_1_2: 'rgba(58, 75, 198, 1)',
  intensifier_utilization_1_3: 'rgba(230, 108, 55, 1)',
  intensifier_utilization_1_4: 'rgba(200, 61, 149, 1)',
  intensifier_utilization_2_1: 'rgba(17, 141, 255, 1)',
  intensifier_utilization_2_2: 'rgba(58, 75, 198, 1)',
  intensifier_utilization_2_3: 'rgba(230, 108, 55, 1)',
  intensifier_utilization_2_4: 'rgba(200, 61, 149, 1)',
  intensifier_utilization_3_1: 'rgba(17, 141, 255, 1)',
  intensifier_utilization_3_2: 'rgba(58, 75, 198, 1)',
  intensifier_utilization_3_3: 'rgba(230, 108, 55, 1)',
  intensifier_utilization_3_4: 'rgba(200, 61, 149, 1)',
  intensifier_utilization_4_1: 'rgba(17, 141, 255, 1)',
  intensifier_utilization_4_2: 'rgba(58, 75, 198, 1)',
  intensifier_utilization_4_3: 'rgba(230, 108, 55, 1)',
  intensifier_utilization_4_4: 'rgba(200, 61, 149, 1)'
};
