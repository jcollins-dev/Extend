import React, { useMemo } from 'react';
import { IntensifiersStrokeCountsListContainer } from './IntensifiersStrokeCountsList.elements';
import { StyledUiContainerProps } from 'components';
import { CollapseContainerWrapper } from './CollapseContainerWrapper';
import { intensifierColors } from '../../IntensifierView';
import { useApiData } from 'sandbox/joey/useApiCall';
import { useFleetMachineAccountData } from 'pages/FleetMachineDetail/hooks';

export interface IntensifiersStrokeCountsListProps extends StyledUiContainerProps {
  skidNum?: number;
}

const demoAlarmsData = {
  intensifier1: [
    {
      date: `Fri, 07/06 - 08:45`,
      alarm:
        'Rise in intensifier stroke count - Abnormally high stroke count per cycle for Skid 1, Intensifier 2'
    },
    {
      date: `Fri, 07/07 - 10:15`,
      alarm:
        'Rise in intensifier stroke count - Abnormally high stroke count per cycle for Skid 1, Intensifier 2'
    }
  ],
  intensifier2: [
    {
      date: `Fri, 07/06 - 08:45`,
      alarm:
        'Rise in intensifier stroke count - Abnormally high stroke count per cycle for Skid 1, Intensifier 2'
    },
    {
      date: `Fri, 07/07 - 10:15`,
      alarm:
        'Rise in intensifier stroke count - Abnormally high stroke count per cycle for Skid 1, Intensifier 2'
    }
  ],
  intensifier3: [
    {
      date: `Fri, 07/06 - 08:45`,
      alarm:
        'Rise in intensifier stroke count - Abnormally high stroke count per cycle for Skid 1, Intensifier 2'
    },
    {
      date: `Fri, 07/07 - 10:15`,
      alarm:
        'Rise in intensifier stroke count - Abnormally high stroke count per cycle for Skid 1, Intensifier 2'
    }
  ],
  intensifier4: []
};

export const IntensifiersStrokeCountsList = ({
  skidNum,
  className
}: IntensifiersStrokeCountsListProps): JSX.Element => {
  // set default skid number
  skidNum = skidNum || 1;
  // adjust classnames
  className = className
    ? `${className} intensifiers-stroke-counts-list`
    : `intensifiers-stroke-counts-list`;
  className += `intensifiers-stroke-counts-list--skid-${skidNum}`;
  const { machineId } = useFleetMachineAccountData();
  const apiCall = useApiData(`/fps/v1/machines/${machineId}/alerts`);
  const demoData = apiCall?.data;
  const data = demoAlarmsData;

  console.log({ demoData, apiCall });
  // cache the alarms rows
  const alarms = useMemo(() => {
    return [
      {
        title: 'Intensifier 1',
        color: intensifierColors[`intensifier_utilization_${skidNum}_1`],
        data: data.intensifier1
      },
      {
        title: 'Intensifier 2',
        color: intensifierColors[`intensifier_utilization_${skidNum}_2`],
        data: data.intensifier2
      },
      {
        title: 'Intensifier 3',
        color: intensifierColors[`intensifier_utilization_${skidNum}_3`],
        data: data.intensifier3
      },
      {
        title: 'Intensifier 4',
        color: intensifierColors[`intensifier_utilization_${skidNum}_4`],
        data: data.intensifier4
      }
    ];
  }, [data]);

  return (
    <IntensifiersStrokeCountsListContainer {...{ className }}>
      <div className="list-area">
        <h2>Intensifier Stroke Counts Skid {skidNum}</h2>
        <div className="intensifiers-stroke-counts-list__scroll-area">
          {alarms.map((alarm, i) => (
            <CollapseContainerWrapper key={i} {...alarm} />
          ))}
        </div>
      </div>
      {/* <div className="chart-area">chart</div> */}
    </IntensifiersStrokeCountsListContainer>
  );
};
