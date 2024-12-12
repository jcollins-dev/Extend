import React from 'react';
import { render } from '@testing-library/react';
import { BarDatum } from 'components/StackedBarChartOverTime';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { groupIntoBars } from '.';
import { toISO8601 } from 'helpers';
import moment from 'moment';
import { Alarm, AlarmType } from 'types/machine-health/alarms';
import AlarmsStackedBarChartWidget from '.';
import { BarDatumLane } from '../StackedBarChartOverLane';

describe('AlarmsStackedBarChart', () => {
  it('groupIntoBars function correctly groups steps into days', () => {
    const mockAlarms: Alarm[] = [
      {
        startTimestamp: toISO8601(new Date('2022-11-01T18:28:23+00:00')).toString(),
        endTimestamp: toISO8601(new Date('2022-11-01T18:28:40+00:00')).toString(),
        code: '6298',
        description: 'Foil Decobox Chute 11: Cap level below low level',
        location: 'Lane 11',
        type: AlarmType.AsepticFoilAlarm
      }
    ];
    const expected: BarDatumLane[][] = [
      [
        {
          id: '6298',
          label: undefined,
          x: '1',
          y: 2,
          name: AlarmType.AsepticFoilAlarm,
          color: theme.colors.alarmStatusColors[AlarmType.AsepticFoilAlarm],
          toolTipData: {
            label: AlarmType.AsepticFoilAlarm,
            day: 'Lane 11',
            count: 2
          }
        }
      ]
    ];

    const getColorById = jest.fn();
    // default case, grouped by alarm type & default alarm colors
    const defaultGrouping = groupIntoBars(mockAlarms, 'count', getColorById, 'UTC');

    expect(getColorById).not.toHaveBeenCalled();

    render(
      <ThemeProvider theme={theme}>
        <AlarmsStackedBarChartWidget
          timeZone="UTC"
          barValueType="count"
          data={mockAlarms}
          getColorById={jest.fn()}
          onBarClick={jest.fn}
        />
      </ThemeProvider>
    );
  });
});
