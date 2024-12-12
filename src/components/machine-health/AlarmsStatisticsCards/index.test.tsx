import React from 'react';
import moment from 'moment';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18nForTests';

import theme from 'themes';
import { Alarm, AlarmType } from 'types/machine-health/alarms';
import AlarmsStatisticsCards, {
  computeAlarmStatistics,
  computeAverageDuration,
  computeTotalDuration
} from '.';

describe('AlarmsStatisticsCards', () => {
  it('computeTotalDuration returns correct duaration value', () => {
    const durations: moment.Duration[] = [
      moment.duration(1),
      moment.duration(1),
      moment.duration(1),
      moment.duration(1),
      moment.duration(1)
    ];

    const totalDuration = computeTotalDuration(durations);
    expect(totalDuration).toEqual(moment.duration(5).asMilliseconds());
  });

  it('computeAverageDuration returns correct average duaration value', () => {
    const durations: moment.Duration[] = [
      moment.duration(1),
      moment.duration(1),
      moment.duration(1),
      moment.duration(1),
      moment.duration(1)
    ];

    const totalDuration = computeAverageDuration(durations);
    expect(totalDuration).toEqual(moment.duration(1).asMilliseconds());
  });

  it('computeAlarmStatistics returns appropriate stats values when unfiltered', () => {
    const mockAlarms: Alarm[] = [
      {
        code: '10',
        type: AlarmType.CriticalAlarm,
        startTimestamp: moment().toDate().toString(),
        endTimestamp: moment().add(1, 'hours').toDate().toString(),
        location: 'Spiral',
        description: 'Spiral Alarm'
      },
      {
        code: '11',
        type: AlarmType.CriticalAlarm,
        startTimestamp: moment().toDate().toString(),
        endTimestamp: moment().add(1, 'hours').toDate().toString(),
        location: 'Spiral',
        description: 'Spiral Alarm'
      }
    ];
    const { alarmTotalDuration, alarmAverageDuration } = computeAlarmStatistics(mockAlarms);

    expect(alarmTotalDuration).toBe('2 hrs');
    expect(alarmAverageDuration).toBe('1 hrs');

    render(
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <AlarmsStatisticsCards
            isFiltered={true}
            data={mockAlarms}
            countChips={[]}
            statisticsChips={[]}
          />
        </I18nextProvider>
      </ThemeProvider>
    );
  });
});
