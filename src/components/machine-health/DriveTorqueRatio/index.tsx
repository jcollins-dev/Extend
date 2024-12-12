// 3rd party libs
import React, { useState, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { KPIOverTimeGraph } from 'components';
import { DataRenderer } from 'components/machine-health';
import TorqueBarChart from './TorqueBarChart';

// Icons
import { ShowChartIcon } from 'icons';

// API
import { useGetMachineTagsHistoryQuery } from 'api';

// Helpers
import { formatDate, toISO8601 } from 'helpers';
import { processData } from './utils';

// Constants
import { INNER_DRIVE_TORQUE, OUTER_DRIVE_TORQUE } from 'constants/machineTags';

// Providers
import { useLanguage, useTimeZone } from 'providers';

export const COLORS = {
  inner: '#BEF264',
  outer: '#67E8F9'
};

const BAR_CHART_WIDTH = 14.25;
const CHART_GAP = 1;

interface Props {
  machineId: string;
  startTime: Date;
  endTime: Date;
}

const Container = styled.div`
  overflow: hidden;
`;

const Inner = styled.div<{ barChartVisible: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  gap: ${CHART_GAP}rem;
  transform: translateX(
    ${({ barChartVisible }) => (barChartVisible ? 0 : `-${BAR_CHART_WIDTH + CHART_GAP}rem`)}
  );
  transition: transform 0.5s ease-in-out;
`;

const BarChartContainer = styled.div`
  flex: 0 0 14.25rem;
  width: ${BAR_CHART_WIDTH}rem;
`;

const LineChart = styled.div`
  flex: 0 0 100%;
`;

const ShowChartButton = styled.div`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
`;

const DriveTorqueRatio = ({ machineId, startTime, endTime }: Props): JSX.Element => {
  const { timeZone } = useTimeZone();
  const [barChartVisible, setBarChartVisible] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation(['mh', 'common']);
  const { languageId } = useLanguage();

  const { data, isFetching, error } = useGetMachineTagsHistoryQuery({
    machineId,
    startDatetime: toISO8601(startTime),
    endDatetime: toISO8601(endTime),
    tagCodes: [INNER_DRIVE_TORQUE, OUTER_DRIVE_TORQUE],
    languageId
  });

  const { innerSeriesData, outerSeriesData, innerValuePercent, outerValuePercent } = useMemo(
    () => processData(data),
    [data]
  );

  const showChartButton = (
    <ShowChartButton onClick={() => setBarChartVisible(!barChartVisible)}>
      {ShowChartIcon(undefined, barChartVisible)}
    </ShowChartButton>
  );

  return (
    <div>
      <DataRenderer
        isLoading={isFetching}
        error={error && (t('failed_to_load_data', { ns: 'common' }) as string)}
      >
        <Container>
          <Inner barChartVisible={barChartVisible}>
            <BarChartContainer>
              <TorqueBarChart innerValue={innerValuePercent} outerValue={outerValuePercent} />
            </BarChartContainer>
            <LineChart>
              <KPIOverTimeGraph
                title={t('drive_torque_ratio') as string}
                iconButton={showChartButton}
                graphContainerHeight="18.3125rem"
                xDomain={[startTime, endTime]}
                series={[
                  {
                    mode: 'LINE',
                    id: 'inner',
                    label: t('inner', { ns: 'common' }) as string,
                    color: COLORS.inner,
                    data: innerSeriesData
                  },
                  {
                    mode: 'LINE',
                    id: 'outer',
                    label: t('outer', { ns: 'common' }) as string,
                    color: COLORS.outer,
                    data: outerSeriesData
                  }
                ]}
                axisH={{
                  orientation: 'top',
                  style: {
                    axis: { stroke: 'none' },
                    grid: { stroke: theme.colors.lightGrey3 }
                  },
                  tickFormat: (t) =>
                    `${formatDate(t, 'numeric-month-day', timeZone)}\n${formatDate(
                      t,
                      'hours-minutes',
                      timeZone
                    )}`
                }}
                axisV={{
                  style: {
                    grid: {
                      stroke: 'none'
                    },
                    axis: {
                      stroke: 'none'
                    }
                  }
                }}
              />
            </LineChart>
          </Inner>
        </Container>
      </DataRenderer>
    </div>
  );
};

export default DriveTorqueRatio;
