import React from 'react';
import { render } from '@testing-library/react';
import { BarDatum } from 'components/StackedBarChartOverTime';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import AlarmsStackedBarChart, { groupIntoBars } from '.';
import { toISO8601 } from 'helpers';
import moment from 'moment';
import { Alarm, AlarmType } from 'types/machine-health/alarms';

describe('AlarmsStackedBarChart', () => {
  it('groupIntoBars function correctly groups steps into days', () => {
    const mockAlarms: Alarm[] = [
      {
        code: '45',
        type: AlarmType.CriticalAlarm,
        startTimestamp: toISO8601(new Date('2022-01-01T00:00:00.000Z')).toString(),
        endTimestamp: toISO8601(new Date('2022-01-01T00:00:00.000Z')).toString(),
        location: 'Cleaning',
        description: 'Cleaning Alarm'
      },
      {
        code: '45',
        type: AlarmType.CriticalAlarm,
        startTimestamp: toISO8601(new Date('2022-01-01T00:00:00.000Z')).toString(),
        endTimestamp: toISO8601(new Date('2022-01-01T00:00:00.000Z')).toString(),
        location: 'Cleaning',
        description: 'Cleaning Alarm'
      },
      {
        code: '10',
        type: AlarmType.WarningInformation,
        startTimestamp: toISO8601(new Date('2022-01-01T00:00:00.000Z')).toString(),
        endTimestamp: toISO8601(new Date('2022-01-01T00:00:00.000Z')).toString(),
        location: 'Cleaning',
        description: 'Cleaning Alarm'
      },
      {
        code: '11',
        type: AlarmType.Undefined,
        startTimestamp: toISO8601(new Date('2022-01-01T00:00:00.000Z')).toString(),
        endTimestamp: toISO8601(new Date('2022-01-01T00:00:00.000Z')).toString(),
        location: 'Spiral',
        description: 'Spiral Alarm'
      }
    ];
    const dateRange = { from: moment().subtract(14, 'days').toDate(), to: moment().toDate() };
    const expected: BarDatum[][] = [
      [
        {
          id: '45',
          label: undefined,
          x: new Date('2022-01-01T00:00:00.000Z'),
          y: 2,
          name: AlarmType.CriticalAlarm,
          color: theme.colors.alarmStatusColors[AlarmType.CriticalAlarm],
          toolTipData: {
            label: AlarmType.CriticalAlarm,
            day: '2022-01-01T00:00:00Z',
            count: 2
          }
        }
      ],
      [
        {
          id: '10',
          label: undefined,
          x: new Date('2022-01-01T00:00:00+00:00'),
          y: 1,
          name: AlarmType.WarningInformation,
          color: theme.colors.alarmStatusColors[AlarmType.WarningInformation],
          toolTipData: {
            label: AlarmType.WarningInformation,
            day: '2022-01-01T00:00:00Z',
            count: 1
          }
        }
      ],
      [
        {
          id: '11',
          label: undefined,
          x: new Date('2022-01-01T00:00:00+00:00'),
          y: 1,
          name: AlarmType.Undefined,
          color: theme.colors.alarmStatusColors[AlarmType.Undefined],
          toolTipData: {
            label: AlarmType.Undefined,
            day: '2022-01-01T00:00:00Z',
            count: 1
          }
        }
      ]
    ];

    const getColorById = jest.fn();
    // default case, grouped by alarm type & default alarm colors
    const defaultGrouping = groupIntoBars(mockAlarms, 'count', getColorById, 'UTC');

    expect(defaultGrouping).toEqual(expected);
    expect(getColorById).not.toHaveBeenCalled();

    render(
      <ThemeProvider theme={theme}>
        <AlarmsStackedBarChart
          title="Foo"
          timeZone="UTC"
          barValueType="count"
          dateRange={dateRange}
          data={mockAlarms}
          getColorById={jest.fn()}
          onBarClick={jest.fn}
        />
      </ThemeProvider>
    );
  });
});
