import React, { useMemo } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { KPIOverTimeGraph } from 'components';
import OEETooltip from './OEETooltip';
import theme from 'themes';

import { BaseTagValue, ProsealMachineProductionKpis } from 'types/proseal';

const timeZone = 'Europe/London';

const OEEColor = theme.colors.darkBlue;
const PRColor = theme.colors.greyBlue2;
const ARColor = theme.colors.mediumBlue3;

type OEEGraphProps = {
  data?: ProsealMachineProductionKpis;
  startDate: moment.Moment;
  endDate: moment.Moment;
};

const Container = styled.div`
  border-radius: 0.5rem;
  border: ${({ theme }) => theme.colors.borders.border02.border};

  display: flex;

  height: 20rem;
`;

const StyledPoint = styled.circle`
  fill: ${(props) => props.color};
`;

type ScatterPointProps = {
  x?: number;
  y?: number;
  color: string;
  size: number;
};

const ScatterPoint = ({ x, y, color, size }: ScatterPointProps) => {
  return <StyledPoint color={color} cx={x} cy={y} r={size} />;
};

const mapData = (data: BaseTagValue[], dateArray: Date[]) => {
  return data.map((v, index) => ({
    x: dateArray[index],
    y: Math.floor((v.value as number) * 100)
  }));
};

const OEEGraph = ({ startDate, endDate, data }: OEEGraphProps): JSX.Element => {
  const { t } = useTranslation(['mh']);
  if (!data) {
    return <div>{t('error', { ns: 'common' })}</div>;
  }

  // momentArray has tz info for display, while dateArray is for Victory's y axis, but
  // they have the same values
  const { momentArray, dateArray } = useMemo(() => {
    const dateArray: Date[] = [];
    const momentArray: moment.Moment[] = [];
    const curr = moment(startDate);
    while (curr < endDate) {
      momentArray.push(moment(curr));
      dateArray.push(curr.toDate());
      curr.add(1, 'days');
    }
    return { momentArray, dateArray };
  }, [startDate, endDate]);

  if (!data) {
    return <div>{t('error', { ns: 'common' })}</div>;
  }

  const oeeData = useMemo(() => mapData(data.oee.values, dateArray), [data.oee, dateArray]);
  const perfData = useMemo(
    () => mapData(data.performance.values, dateArray),
    [data.performance, dateArray]
  );
  const availData = useMemo(
    () => mapData(data.availability.values, dateArray),
    [data.availability, dateArray]
  );

  const tooltipComponent = () => (
    <OEETooltip
      dateDomain={momentArray}
      oee={{ data: oeeData.map((v) => v.y), color: OEEColor }}
      performance={{ data: perfData.map((v) => v.y), color: PRColor }}
      availability={{ data: availData.map((v) => v.y), color: ARColor }}
    />
  );

  return (
    <Container>
      <KPIOverTimeGraph
        title={t('overall_equipment_effectiveness') as string}
        xDomain={[startDate.toDate(), endDate.toDate()]}
        domainPadding={{ y: 20, x: 50 }}
        axisH={{
          tickValues: dateArray.length <= 7 ? dateArray : undefined,
          tickFormat: (t) => moment(t).tz(timeZone).format('M/D ddd')
        }}
        axisV={{
          tickValues: [0, 20, 40, 60, 80, 100],
          tickFormat: (t) => `${t}%`,
          style: {
            axis: { stroke: 'transparent' },
            grid: { stroke: theme.colors.lightGrey3 },
            ticks: { size: 0 }
          }
        }}
        series={[
          {
            label: 'OEE',
            mode: 'LINE',
            id: 'OEE',
            color: OEEColor,
            data: oeeData,
            tooltipComponent: tooltipComponent()
          },
          {
            mode: 'SCATTER',
            id: 'OEE_scatter',
            size: 6,
            color: OEEColor,
            data: oeeData,
            dataComponent: <ScatterPoint color={OEEColor} size={6} />
          },
          {
            label: 'Performance',
            mode: 'LINE',
            id: 'PR',
            color: PRColor,
            style: {
              strokeWidth: 1,
              strokeDasharray: '6, 6'
            },
            data: perfData,
            tooltipComponent: tooltipComponent()
          },
          {
            mode: 'SCATTER',
            id: 'PR_scatter',
            color: PRColor,
            data: perfData,
            dataComponent: <ScatterPoint color={PRColor} size={4} />
          },
          {
            label: 'Availability',
            mode: 'LINE',
            id: 'AR',
            color: ARColor,
            style: {
              strokeWidth: 1,
              strokeDasharray: '6, 6'
            },
            data: availData,
            tooltipComponent: tooltipComponent()
          },
          {
            mode: 'SCATTER',
            id: 'AR_scatter',
            color: ARColor,
            data: availData,
            dataComponent: <ScatterPoint color={ARColor} size={4} />
          }
        ]}
      />
    </Container>
  );
};

export default OEEGraph;
