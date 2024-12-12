import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import AlarmsTypePieChart, { groupData } from '.';
import { mockAlarmsTableData } from 'constants/testdata/protein';
import { PieSliceDatum } from 'components/PieChart';
import { AlarmType } from 'types/machine-health/alarms';
import ToolTip from './Tooltip';

describe('AlarmsTypePieChart', () => {
  it('groupData function correctly groups pie chart data based on selected type', () => {
    const expected: PieSliceDatum[] = [
      {
        id: AlarmType.CriticalAlarm,
        percent: 40,
        label: '40.00%',
        color: theme.colors.alarmStatusColors[AlarmType.CriticalAlarm],
        hidden: false,
        highlight: false,
        tooltip: <ToolTip count={2} label={'Critical Alarm'} percent={40} />
      },
      {
        id: AlarmType.Alarm,
        percent: 40,
        label: '40.00%',
        color: theme.colors.alarmStatusColors[AlarmType.Alarm],
        hidden: false,
        highlight: false,
        tooltip: <ToolTip count={2} label={'Alarm'} percent={40} />
      },
      {
        id: AlarmType.WarningInformation,
        percent: 20,
        label: '20.00%',
        color: theme.colors.alarmStatusColors[AlarmType.WarningInformation],
        hidden: false,
        highlight: false,
        tooltip: <ToolTip count={1} label={'Warning Information'} percent={20} />
      }
    ];

    const formattedData = groupData(mockAlarmsTableData);
    expect(formattedData).toEqual(expected);

    render(
      <ThemeProvider theme={theme}>
        <AlarmsTypePieChart data={mockAlarmsTableData} onSliceClick={jest.fn} />
      </ThemeProvider>
    );
  });
});
