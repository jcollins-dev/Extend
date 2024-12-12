import React from 'react';
import { render } from '@testing-library/react';
import { toISO8601 } from 'helpers';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Alarm, AlarmType } from 'types/machine-health/alarms';
import AlarmIdPieChart, { groupData } from '.';
import { PieSliceDatum } from 'components/PieChart';
import ToolTip from './ToolTip';

describe('AlarmsStackedBarChart', () => {
  it('groupIntoBars function correctly groups steps into days', () => {
    const mockAlarms: Alarm[] = [
      {
        code: '10',
        type: AlarmType.WarningInformation,
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
        description: 'Spiral Alarm'
      }
    ];

    const expected: PieSliceDatum[] = [
      {
        id: '10',
        hidden: true,
        label: '50.00%',
        percent: 50,
        color: '',
        tooltip: <ToolTip count={1} label={'10 - Cleaning Alarm'} percent={50} />
      },
      {
        id: '45',
        hidden: false,
        label: '50.00%',
        percent: 50,
        color: '',
        tooltip: <ToolTip count={1} label={'45 - Spiral Alarm'} percent={50} />
      }
    ];

    const getColorById = jest.fn((id: string) => '');
    const selectedId = '45';
    const selectedType = AlarmType.CriticalAlarm;
    const groupedData = groupData(mockAlarms, getColorById, selectedId, selectedType);
    expect(groupedData).toEqual(expected);
    expect(getColorById).toHaveBeenCalledWith(selectedId);

    render(
      <ThemeProvider theme={theme}>
        <AlarmIdPieChart data={mockAlarms} getColorById={getColorById} onSliceClick={jest.fn} />
      </ThemeProvider>
    );
  });
});
