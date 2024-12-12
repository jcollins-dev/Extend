import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import { toISO8601 } from 'helpers';
import { Alarm, AlarmType } from 'types/machine-health/alarms';
import AvureAlarmCharts from './index';

describe('Alarms', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AvureAlarmCharts
              onSliceClick={jest.fn()}
              data={mockData}
              selectedId={undefined}
              selectedType={undefined}
              selectedIdType={undefined}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });

  const mockData: Alarm[] = [
    {
      code: '10',
      startTimestamp: toISO8601(new Date('2022-01-01T00:00:00.000Z')),
      endTimestamp: toISO8601(new Date('2022-01-02T00:00:00.000Z')),
      type: AlarmType.AvureProductAlarm,
      location: 'Test',
      description: 'Product Alarm'
    },
    {
      code: '11',
      startTimestamp: toISO8601(new Date('2022-01-02T00:00:00.000Z')),
      tzCorrectedTimestamp: toISO8601(new Date('2022-01-02T00:00:00.000Z')),
      endTimestamp: toISO8601(new Date('2022-01-02T10:00:00.000Z')),
      type: AlarmType.AvureCriticalAlarm,
      location: 'Test',
      description: 'Test Alarm'
    },
    {
      code: '12',
      startTimestamp: toISO8601(new Date('2022-01-02T00:00:00.000Z')),
      tzCorrectedTimestamp: toISO8601(new Date('2022-01-02T00:00:00.000Z')),
      endTimestamp: toISO8601(new Date('2022-01-02T10:00:00.000Z')),
      type: AlarmType.AvureWarningAlarm,
      location: 'Test',
      description: 'Test Alarm'
    }
  ];
});
