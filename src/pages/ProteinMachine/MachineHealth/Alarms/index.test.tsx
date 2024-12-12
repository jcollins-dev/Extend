import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import Alarms, {
  AlarmWithDay,
  filterBarChartData,
  filterPieChartData,
  filterStatisticsData,
  matchAlarm
} from '.';
import { toISO8601 } from 'helpers';
import moment from 'moment';
import { filterReducer, initialFilterState } from './filterReducer';
import { AlarmType } from 'types/machine-health/alarms';

describe('Alarms', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <Alarms />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });

  const mockBarData: AlarmWithDay[] = [
    {
      code: '10',
      startTimestamp: toISO8601(new Date('2022-01-01T00:00:00.000Z')),
      endTimestamp: toISO8601(new Date('2022-01-02T00:00:00.000Z')),
      type: AlarmType.WarningInformation,
      location: 'Spiral',
      description: 'Spiral Alarm',
      day: '2022-01-01T00:00:00.000Z'
    },
    {
      code: '11',
      startTimestamp: toISO8601(new Date('2022-01-02T00:00:00.000Z')),
      tzCorrectedTimestamp: toISO8601(new Date('2022-01-02T00:00:00.000Z')),
      endTimestamp: toISO8601(new Date('2022-01-02T10:00:00.000Z')),
      type: AlarmType.Undefined,
      location: 'Spiral',
      description: 'Spiral Alarm',
      day: '2022-01-02T00:00:00.000Z'
    },
    {
      code: '12',
      startTimestamp: toISO8601(new Date('2022-01-02T00:00:00.000Z')),
      tzCorrectedTimestamp: toISO8601(new Date('2022-01-02T00:00:00.000Z')),
      endTimestamp: toISO8601(new Date('2022-01-02T10:00:00.000Z')),
      type: AlarmType.CriticalAlarm,
      location: 'Spiral',
      description: 'Spiral Alarm',
      day: '2022-01-02T00:00:00.000Z'
    }
  ];

  describe('matchAlarm', () => {
    it('should match alarms based on text input', () => {
      const allLetters = 'test';
      expect(
        matchAlarm(allLetters, {
          code: '10',
          startTimestamp: moment().toDate().toString(),
          endTimestamp: moment().add(1, 'hour').toDate().toString(),
          description: allLetters,
          location: 'Spiral',
          type: AlarmType.Alarm,
          day: '2022-01-01T00:00:00.000Z'
        })
      ).toBe(true);
    });

    it('should match alarms based numeric input', () => {
      const allNumbers = '10';
      const start = moment();
      expect(
        matchAlarm(allNumbers, {
          code: '10',
          startTimestamp: start.toDate().toString(),
          endTimestamp: moment(start).add(1, 'hour').toDate().toString(),
          description: 'Test',
          location: 'Spiral',
          type: AlarmType.Alarm,
          day: start.format()
        })
      ).toBe(true);
    });

    it('should reject alarms based mixed input', () => {
      const mixedString = 'test10';
      const start = moment();
      expect(
        matchAlarm(mixedString, {
          code: '10',
          startTimestamp: start.toDate().toString(),
          endTimestamp: moment(start).add(1, 'hour').toDate().toString(),
          description: 'A test description',
          location: 'Spiral',
          type: AlarmType.Alarm,
          day: start.format()
        })
      ).toBe(false);
    });

    it('should reject alarms based on mixed or special character input', () => {
      const longString = 'L10NgStr!Ng';
      const start = moment();
      expect(
        matchAlarm(longString, {
          code: '10',
          startTimestamp: start.toDate().toString(),
          endTimestamp: moment(start).add(1, 'hour').toDate().toString(),
          description: 'A test description',
          location: 'Spiral',
          type: AlarmType.Alarm,
          day: start.format()
        })
      ).toBe(false);
    });
  });

  describe('filterBarChartData', () => {
    it('should filter by date', () => {
      const filteredByDate = filterBarChartData(mockBarData, '2022-01-01T00:00:00.000Z');
      expect(filteredByDate).toHaveLength(1);
    });

    it('should filter by alarm type', () => {
      const filteredByAlarmType = filterBarChartData(
        mockBarData,
        undefined,
        AlarmType.CriticalAlarm
      );
      expect(filteredByAlarmType).toHaveLength(1);
    });

    it('should filter by id type', () => {
      const filterByIdType = filterBarChartData(
        mockBarData,
        undefined,
        undefined,
        AlarmType.CriticalAlarm
      );
      expect(filterByIdType).toHaveLength(1);
    });
  });

  describe('filterPieChartData', () => {
    it('should filter by date', () => {
      const filteredByDate = filterPieChartData(mockBarData, '2022-01-01T00:00:00.000Z');
      expect(filteredByDate).toHaveLength(1);
    });
  });

  describe('filterStatisticsData', () => {
    it('should filter by date', () => {
      const defaultFiltered = filterStatisticsData(mockBarData);
      expect(defaultFiltered).toHaveLength(2);

      const filteredData = filterStatisticsData(
        mockBarData,
        undefined,
        AlarmType.WarningInformation
      );
      expect(filteredData).toHaveLength(1);
    });
  });

  describe('filterReducer', () => {
    it('should register a history event when FILTER_BY_DATE is dispatched', () => {
      const mockDate = '2022-01-01T00:00:00+00:00';
      expect(filterReducer(initialFilterState, { type: 'FILTER_BY_DATE', date: mockDate })).toEqual(
        {
          future: [],
          present: {
            searchQuery: '',
            selectedId: '',
            selectedDate: mockDate,
            selectedIdType: undefined,
            selectedType: undefined
          },
          past: [
            {
              searchQuery: '',
              selectedId: '',
              selectedDate: undefined,
              selectedIdType: undefined,
              selectedType: undefined
            }
          ]
        }
      );
    });

    it('should register a history event when FILTER_BY_ID is dispatched', () => {
      expect(
        filterReducer(initialFilterState, {
          type: 'FILTER_BY_ID',
          id: '1234',
          alarmIdType: AlarmType.Alarm
        })
      ).toEqual({
        future: [],
        present: {
          searchQuery: '',
          selectedId: '1234',
          selectedDate: undefined,
          selectedIdType: AlarmType.Alarm,
          selectedType: undefined
        },
        past: [
          {
            searchQuery: '',
            selectedId: '',
            selectedDate: undefined,
            selectedIdType: undefined,
            selectedType: undefined
          }
        ]
      });
    });

    it('should register a history event when FILTER_BY_TYPE is dispatched', () => {
      expect(
        filterReducer(initialFilterState, { type: 'FILTER_BY_TYPE', alarmType: AlarmType.Alarm })
      ).toEqual({
        future: [],
        present: {
          searchQuery: '',
          selectedId: '',
          selectedDate: undefined,
          selectedIdType: undefined,
          selectedType: AlarmType.Alarm
        },
        past: [
          {
            searchQuery: '',
            selectedId: '',
            selectedDate: undefined,
            selectedIdType: undefined,
            selectedType: undefined
          }
        ]
      });
    });

    it('should register a history event when FILTER_BY_SEARCH is dispatched', () => {
      expect(
        filterReducer(initialFilterState, { type: 'FILTER_BY_SEARCH', query: 'Door' })
      ).toEqual({
        future: [],
        present: {
          searchQuery: 'Door',
          selectedId: '',
          selectedDate: undefined,
          selectedIdType: undefined,
          selectedType: undefined
        },
        past: [
          {
            searchQuery: '',
            selectedId: '',
            selectedDate: undefined,
            selectedIdType: undefined,
            selectedType: undefined
          }
        ]
      });
    });

    it('should register a history event when UNDO is dispatched', () => {
      expect(
        filterReducer(
          {
            future: [],
            present: {
              searchQuery: 'Door',
              selectedId: '',
              selectedDate: undefined,
              selectedIdType: undefined,
              selectedType: undefined
            },
            past: [
              {
                searchQuery: '',
                selectedId: '',
                selectedDate: undefined,
                selectedIdType: undefined,
                selectedType: undefined
              }
            ]
          },
          { type: 'UNDO' }
        )
      ).toEqual({
        future: [
          {
            searchQuery: 'Door',
            selectedId: '',
            selectedDate: undefined,
            selectedIdType: undefined,
            selectedType: undefined
          }
        ],
        present: {
          searchQuery: '',
          selectedId: '',
          selectedDate: undefined,
          selectedIdType: undefined,
          selectedType: undefined
        },
        past: []
      });
    });

    it('should register a history event when REDO', () => {
      expect(
        filterReducer(
          {
            future: [
              {
                searchQuery: 'Door',
                selectedId: '',
                selectedDate: undefined,
                selectedIdType: undefined,
                selectedType: undefined
              }
            ],
            present: {
              searchQuery: '',
              selectedId: '',
              selectedDate: undefined,
              selectedIdType: undefined,
              selectedType: undefined
            },
            past: []
          },
          { type: 'REDO' }
        )
      ).toEqual({
        future: [],
        present: {
          searchQuery: 'Door',
          selectedId: '',
          selectedDate: undefined,
          selectedIdType: undefined,
          selectedType: undefined
        },
        past: [
          {
            searchQuery: '',
            selectedId: '',
            selectedDate: undefined,
            selectedIdType: undefined,
            selectedType: undefined
          }
        ]
      });
    });

    it('should return initial filter state when CLEAR action is dispatched', () => {
      expect(filterReducer(initialFilterState, { type: 'CLEAR' })).toEqual(initialFilterState);
    });
  });
});
