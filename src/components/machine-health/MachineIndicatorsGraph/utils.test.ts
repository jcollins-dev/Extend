import { mockLineSeries, mockScatterSeries } from 'constants/testdata/protein';
import { formatDate } from 'helpers';
import 'jest';
import { Series } from 'types/graph';
import { formatLineSeriesTooltip, formatScatterSeriesTooltip } from './utils';

describe('MachineIndicatorsGraph utils', () => {
  test('formatLineSeriesTooltip', () => {
    const lineSeries = formatLineSeriesTooltip(mockLineSeries as Series[]);

    const formattedTooltip =
      lineSeries[0].tooltipFormat &&
      lineSeries[0].tooltipFormat(lineSeries[0], lineSeries[0].data[0]);
    const x = lineSeries[0].data[0].x;
    expect(formattedTooltip).toBe(
      `Belt Speed, 100.0 km/h, ${formatDate(x, 'hours-minutes')} ${formatDate(
        x,
        'numeric-month-day'
      )}`
    );
  });

  test('formatScatterSeriesTooltip', () => {
    const scatterSeries = formatScatterSeriesTooltip(mockScatterSeries as Series);
    const formattedTooltip =
      scatterSeries.tooltipFormat &&
      scatterSeries.tooltipFormat(scatterSeries, scatterSeries.data[0], 0);
    expect(
      ['Running', 'Cleaning', 'Stop', 'Stop Alarm', 'Idle'].includes(formattedTooltip as string)
    );
  });
});
