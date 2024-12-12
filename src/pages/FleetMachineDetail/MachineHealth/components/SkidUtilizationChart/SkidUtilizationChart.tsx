import React, { useContext } from 'react';
import { ConnectedScatterChart } from 'common/components/Charts/LineCharts/ConnectedScatterChart/ConnectedScatterChart';
import { SkidChartTooltipContainer, SkidChartTooltipItem } from './SkidUtilizationChart.elements';
import { WidgetUi } from 'common/components';
import { UseSkidUtilizationKpiReturnProps } from 'pages/FleetMachineDetail/hooks/useSkidUtilizationKpi';
import { SelectedSkidContext } from '../../IntensifierViewAlarmsAndSkids';
import { intensifierColors } from '../../IntensifierView';

export interface SkidUtilizationChartProps extends UseSkidUtilizationKpiReturnProps {
  skidNumber: number;
  dateRange?: string[];
  bottomTickCount?: number;
}

export const SkidUtilizationChart = ({
  skidNumber,
  dateRange,
  data,
  isLoading,
  hasMessage,
  hasError,
  bottomTickCount,
  ...rest
}: SkidUtilizationChartProps): JSX.Element => {
  // THIS ALL NEEDS TO BE CLEANED UP

  const { selected, setSelected } = useContext(SelectedSkidContext);

  const handle = (type: string, options?: Record<string, unknown>) => {
    switch (type) {
      case 'select': {
        if (options?.selected) return setSelected?.(options?.selected as string[]);
        return false;
      }
    }
  };

  const chartSettings = {
    selected,
    handle,
    className: 'widget-ui__main',
    labelLeft: 'Utilization Percentage',
    groupKey: 'day_machine_local_time',
    // the [startDate, endData] in yyyy-mm-dd format
    dateRange,
    // this generates a line for each key
    valueKeys: [
      `intensifier_utilization_${skidNumber}_1`,
      `intensifier_utilization_${skidNumber}_2`,
      `intensifier_utilization_${skidNumber}_3`,
      `intensifier_utilization_${skidNumber}_4`
    ],
    height: 300,
    // tese are the colors for the legend items
    legendItems: {
      items: [
        { id: `intensifier_utilization_${skidNumber}_1`, label: `Intensifiers ${skidNumber}.1` },
        { id: `intensifier_utilization_${skidNumber}_2`, label: `Intensifiers ${skidNumber}.2` },
        { id: `intensifier_utilization_${skidNumber}_3`, label: `Intensifiers ${skidNumber}.3` },
        { id: `intensifier_utilization_${skidNumber}_4`, label: `Intensifiers ${skidNumber}.4` }
      ]
    },
    dateRangeDomain: dateRange,
    bottomTickCount,
    colors: intensifierColors,
    isOutlined: true,
    TooltipComponent: (props: Record<string, unknown>) => {
      const colors = props?.colors as Record<string, string>;
      return (
        <SkidChartTooltipContainer className="tooltip">
          <div className="tooltip__date">{props?.day_machine_local_time as string}</div>
          <SkidChartTooltipItem
            color={colors?.[`intensifier_utilization_${skidNumber}_1`]}
            className={`intensifier_utilization_${skidNumber}_1`}
          >
            Intensifiers {skidNumber}.1 -{' '}
            <b>{props?.[`intensifier_utilization_${skidNumber}_1`]}%</b>
          </SkidChartTooltipItem>
          <SkidChartTooltipItem
            color={colors?.[`intensifier_utilization_${skidNumber}_2`]}
            className={`intensifier_utilization_${skidNumber}_2`}
          >
            Intensifiers {skidNumber}.2 -{' '}
            <b>{props?.[`intensifier_utilization_${skidNumber}_2`]}%</b>
          </SkidChartTooltipItem>
          <SkidChartTooltipItem
            color={colors?.[`intensifier_utilization_${skidNumber}_3`]}
            className={`intensifier_utilization_${skidNumber}_3`}
          >
            Intensifiers {skidNumber}.3 -{' '}
            <b>{props?.[`intensifier_utilization_${skidNumber}_3`]}%</b>
          </SkidChartTooltipItem>
          <SkidChartTooltipItem
            color={colors?.[`intensifier_utilization_${skidNumber}_4`]}
            className={`intensifier_utilization_${skidNumber}_4`}
          >
            Intensifiers {skidNumber}.4 -{' '}
            <b>{props?.[`intensifier_utilization_${skidNumber}_4`]}%</b>
          </SkidChartTooltipItem>
        </SkidChartTooltipContainer>
      );
    },
    data: data as Record<string, unknown>[]
  };

  const widgetSettings = {
    title: `Skid ${skidNumber} Utilization`,
    className: `skid-chart`,
    isLoading,
    hasError,
    hasMessage
  };

  return (
    <WidgetUi
      {...widgetSettings}
      Main={data && <ConnectedScatterChart {...chartSettings} {...rest} />}
    />
  );
};
