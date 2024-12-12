import React from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import CleaningStepDurationsBarChart, { groupIntoBars } from '.';
import { CleaningStepGroup, DecoratedCleaningStep } from 'types/protein';
import { useColorMap } from 'hooks';

describe('CleaningStepDurationsBarChart', () => {
  it('groupIntoBars function correctly groups steps into sessions', () => {
    const testSteps: DecoratedCleaningStep[] = [
      {
        sessionId: 'session-a',
        duration: 60_000, // 1 min
        id: '1',
        startDateTime: new Date('2022-01-01T00:00:00.000Z')
      },
      {
        sessionId: 'session-a',
        duration: 60_000, // 1 min
        id: '2',
        startDateTime: new Date('2022-01-01T00:01:00.000Z')
      },
      {
        sessionId: 'session-a',
        duration: 60_000, // 1 min
        id: '1',
        startDateTime: new Date('2022-01-01T00:02:00.000Z')
      },

      {
        sessionId: 'session-b',
        duration: 120_000, // 2 min
        id: '1',
        startDateTime: new Date('2022-01-02T00:00:00.000Z')
      },
      {
        sessionId: 'session-b',
        duration: 120_000, // 2 min
        id: '1',
        startDateTime: new Date('2022-01-02T00:02:00.000Z')
      },
      {
        sessionId: 'session-b',
        duration: 120_000, // 2 min
        id: '3',
        startDateTime: new Date('2022-01-02T00:04:00.000Z')
      }
    ] as DecoratedCleaningStep[];

    const expectedFormattedData = [
      {
        id: '1',
        x: 'session-a',
        y0: 0,
        y: 2,
        color: 'red'
      },
      {
        id: '2',
        x: 'session-a',
        y0: 2,
        y: 1,
        color: 'green'
      },
      {
        id: '1',
        x: 'session-b',
        y0: 0,
        y: 2,
        color: 'red'
      },
      {
        id: '3',
        x: 'session-b',
        y0: 2,
        y: 2,
        color: 'blue'
      }
    ];

    const { result } = renderHook(() => useColorMap(['red', 'green', 'blue']));

    const { barData, numSessions, sessionIdToDateMap } = groupIntoBars(
      testSteps,
      result.current,
      []
    );

    expect(barData).toEqual(barData);
    expect(numSessions).toEqual(2);
    expect(sessionIdToDateMap).toEqual({
      'session-a': new Date('2022-01-01T00:00:00.000Z'),
      'session-b': new Date('2022-01-02T00:00:00.000Z')
    });

    const testGroupedData = [
      {
        id: '1',
        name: 'step-1'
      },
      {
        id: '2',
        name: 'step-2'
      },
      {
        id: '3',
        name: 'step-3'
      }
    ] as CleaningStepGroup[];

    // It renders ok with the data
    render(
      <ThemeProvider theme={theme}>
        <CleaningStepDurationsBarChart
          data={testSteps}
          groupedData={testGroupedData}
          selectedSteps={[]}
          onSelectSteps={jest.fn}
          getColorById={result.current}
        />
      </ThemeProvider>
    );
  });
});
