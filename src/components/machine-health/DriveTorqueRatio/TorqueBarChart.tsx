// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Cmponents
import { BarChart, KPICard } from 'components';

// Colors
import { COLORS } from './';

// Theme
import victoryTheme from 'themes/victory';

// Hooks
import { useContainerSize } from 'hooks';

const BAR_WIDTH = 36;

interface Props {
  innerValue: number;
  outerValue: number;
}

const StyledKPICard = styled((props) => <KPICard {...props} />)`
  height: 100%;
`;

const ChartWrapper = styled.div`
  height: 100%;
  position: relative;
`;

const ChartContainer = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
`;

const TorqueBarChart = ({ innerValue, outerValue }: Props): JSX.Element => {
  const { width: graphWidth, containerRef: graphContainerRef } = useContainerSize();
  const { t } = useTranslation(['mh']);

  return (
    <StyledKPICard heading={t('drive_torque_ratio')}>
      <ChartWrapper>
        <ChartContainer ref={graphContainerRef}>
          <BarChart
            domainPadding={{
              x: BAR_WIDTH / 2 + 20
            }}
            theme={victoryTheme}
            dims={{ width: graphWidth, height: 230 }}
            bars={[
              {
                x: 'Inner',
                y: innerValue,
                color: COLORS.inner
              },
              {
                x: 'Outer',
                y: outerValue,
                color: COLORS.outer
              }
            ]}
            format={(tick) => `${tick}%`}
            config={{
              bar: {
                barWidth: BAR_WIDTH,
                labels: ({ datum }) => `${datum.y}%`,
                style: { labels: { fontSize: 11 } }
              },
              yAxis: {
                domain: [0, 100]
              }
            }}
            padding={{ left: 40, right: 20 }}
          />
        </ChartContainer>
      </ChartWrapper>
    </StyledKPICard>
  );
};

export default TorqueBarChart;
