// 3rd party libs
import React, { ReactElement, useState, useMemo } from 'react';
import styled from 'styled-components';
import moment from 'moment';

// components
import { DateSlider } from 'components';
import PackIntervalChart, { PackIntervalChartProps } from '../PackIntervalChart';

// Types
import { ProsealStatus } from 'types/proseal';

const timeZone = 'Europe/London';

// Styling
const SliderContainer = styled.div`
  padding-left: 3rem;
  padding-right: 3rem;
  margin-bottom: 1rem;
`;

const filterStatusesForZoom = (statuses: ProsealStatus[]): ProsealStatus[] => {
  let isFilteringErrors = false;
  const filteredstatuses: ProsealStatus[] = [];
  for (const currentStatus of statuses) {
    if (currentStatus.isError && isFilteringErrors) {
      continue;
    }

    if (currentStatus.isError) {
      isFilteringErrors = true;
      filteredstatuses.push(currentStatus);
    } else {
      isFilteringErrors = false;
    }
  }

  return filteredstatuses;
};

const HistoricPackIntervalChart = ({
  startTime,
  endTime,
  statuses = [],
  ...rest
}: PackIntervalChartProps): ReactElement => {
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  const [selectedRange, setSelectedRange] = useState<{ to: moment.Moment; from: moment.Moment }>({
    from: moment(startTime),
    to: moment(startTime).add(24, 'hours')
  });

  const filteredStatuses = useMemo(() => {
    if (!isZoomedIn) {
      return filterStatusesForZoom(statuses);
    }
    return statuses;
  }, [statuses]);

  return (
    <PackIntervalChart
      {...rest}
      startTime={selectedRange.from}
      endTime={selectedRange.to}
      statuses={filteredStatuses}
      onZoom={() => setIsZoomedIn(true)}
      onZoomReset={() => setIsZoomedIn(false)}
      timeTickCount={isZoomedIn ? undefined : 24}
    >
      <SliderContainer>
        <DateSlider
          min={startTime.toDate()}
          max={endTime.toDate()}
          value={moment(selectedRange.from).add(12, 'hours').toDate()}
          tz={timeZone}
          onChange={(value) => {
            setSelectedRange({
              from: moment(value).subtract('12', 'hours'),
              to: moment(value).add('12', 'hours')
            });
          }}
        />
      </SliderContainer>
    </PackIntervalChart>
  );
};

export default HistoricPackIntervalChart;
