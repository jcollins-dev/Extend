import React from 'react';
import { formatDataBySkid, generateDemoDataIntensifiers } from './utils';
import { DotsChartWrapper } from './DotsChartWrapper';
import { uniqueId } from 'lodash';
import { WidgetUi } from 'components';
import { IntensifiersStrokeCountsList } from '../IntensifiersStrokeCountsList/IntensifiersStrokeCountsList';

export const testAlarmData = [
  {
    id: 'e5e0f491-f3f5-4fed-9913-c637bdf67c6c',
    internalId:
      '997be3d3-5200-46cb-b9b5-4ff35c0149fe_high_decompression_valve_temperature_decomp_valve_temperature_r_operations',
    description: 'Rise in intensifier stroke count Intensifier 1',
    status: 'not_complete',
    alertType: 'operations',
    timestamp: new Date('2023-09-11T02:40:00.000Z')
  },
  {
    id: 'e5e0f491-f3f5-4fed-9913-c637bdf67c6c',
    internalId:
      '997be3d3-5200-46cb-b9b5-4ff35c0149fe_high_decompression_valve_temperature_decomp_valve_temperature_r_operations',
    description: 'Rise in intensifier stroke count Intensifier 2',
    status: 'not_complete',
    alertType: 'operations',
    timestamp: new Date('2023-09-11T08:40:00.000Z')
  },
  {
    id: 'e5e0f491-f3f5-4fed-9913-c637bdf67c6c',
    internalId:
      '997be3d3-5200-46cb-b9b5-4ff35c0149fe_high_decompression_valve_temperature_decomp_valve_temperature_r_operations',
    description: 'Rise in intensifier stroke count Intensifier 3',
    status: 'not_complete',
    alertType: 'operations',
    timestamp: new Date('2023-09-11T10:40:00.000Z')
  }
];

interface Props {
  width: number;
}

export const SkidStrokeCountsCharts = ({ width }: Props): JSX.Element => {
  // Pull data for intensifiers form Provider HERE
  const data = generateDemoDataIntensifiers(); // test data

  // Below function could be moved inside the provider
  // This transforms the data that we would be using for the chart
  // It returns 2 large arrays
  // Array #1 is an array of arrays - it would contain as many arrays as there are skids in the reponse
  // Array within array #1 is a skid, it contains an object with timestamp and intensifiers and its value
  // Array #2 is an array of arrays. It would have same data as array #1 but formatted differently. We need this for tooltip information
  const { skids, skidsByTimestampAsKey } = formatDataBySkid(data);

  // Pull data for alarms form Provider HERE
  const alarmsDataSkid1 = testAlarmData;

  const strokeCountChart = skids.map((el, i) => {
    const widgetSettings = {
      //gridArea: gridArea,
      className: 'intensifier-stroke-count-widgetui',
      //styleType: 'v2',
      //title: title as unknown as HTMLElement,
      //isLoading: isFirstRender.current ? (isLoading ? true : false) : false,
      //hasError: hasError ? 'Error loading data' : undefined,
      Main: (
        <div style={{ width: width }}>
          <div
            className="intensifier-stroke-count-alerts"
            style={{ width: '240px', height: '300px' }}
          >
            <IntensifiersStrokeCountsList />
          </div>
          <DotsChartWrapper
            key={uniqueId()}
            index={i}
            data={el}
            data2={alarmsDataSkid1}
            width={width - 300}
            height={300}
            tooltipData={skidsByTimestampAsKey[i]}
          />
        </div>
      )
    };
    return <WidgetUi key={uniqueId()} {...widgetSettings} />;
  });

  return <>{strokeCountChart}</>;
};
