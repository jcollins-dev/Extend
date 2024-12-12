import React, { useContext } from 'react';
import { WidgetUi } from 'common/components';
import { IntensifierAlarmsTableContainer } from './IntensifierAlarmsWidget.elements';
import { ProgressCell } from './ProgressCell';
import { useAlarmsForIntensifierApi } from '../../../hooks/useAlarmsForIntensifierApi';
import { roundToTenth } from 'common/helpers/dataCounters';
import { SelectedSkidContext } from '../../IntensifierViewAlarmsAndSkids';

const colors: Record<string, unknown> = {
  Critical: 'rgba(182, 44, 16, 1)',
  Product: 'rgba(0, 118, 204, 1)',
  Warning: 'rgba(226, 178, 8, 1)'
};

const TableCell = (props: {
  alarm_category: string;
  alarm_description: string;
  alarm_hpu_value: string;
  alarm_id: string;
  occurences_ratio: number;
  occurences_percentage: number;
}): JSX.Element => {
  const alarmRatioCell = {
    value: props.occurences_ratio,
    label: roundToTenth(props.occurences_ratio),
    color: colors[props.alarm_category as string] as string,
    labelPosition: 'outside'
  };

  const alarmPercentageCell = {
    value: props.occurences_percentage,
    label: `${roundToTenth(props.occurences_percentage)}%`,
    labelPosition: 'inside'
  };

  return (
    <tr>
      <td className="auto">{props.alarm_id}</td>
      <td className="auto">{props.alarm_description}</td>
      <td className="full">
        <ProgressCell {...alarmRatioCell} />
      </td>
      <td className="full">
        <ProgressCell {...alarmPercentageCell} />
      </td>
    </tr>
  );
};

export const IntensifierAlarmsWidget = (): JSX.Element => {
  const { tableData, isLoading, hasMessage, hasError } = useAlarmsForIntensifierApi();

  const { selected } = useContext(SelectedSkidContext);

  const widgetSettings = {
    title: 'Intensifier Alarms',
    className: 'intensifier-alarms-widget',
    isLoading,
    hasMessage,
    hasError
  };

  const checkIfSelected = (val: string): boolean => {
    if (!selected || selected?.length === 0 || selected?.includes(val)) return true;
    return false;
  };

  return (
    <WidgetUi {...widgetSettings}>
      <IntensifierAlarmsTableContainer>
        <thead>
          <tr>
            <th className="auto">Alarm ID</th>
            <th className="auto">Alarm Description</th>
            <th className="full">Alarm Occurrences</th>
            <th className="full">Occurrences in period</th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((row, i) => {
            const sel = checkIfSelected(row?.lineChartKey as string);
            if (!sel) return <></>;
            return <TableCell {...row} key={`row${i}`} />;
          })}
        </tbody>
      </IntensifierAlarmsTableContainer>
    </WidgetUi>
  );
};
