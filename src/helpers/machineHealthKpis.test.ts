import { getCellColor } from 'helpers';
import theme from 'themes';
import { MachineHealthKpiStatus } from 'types/machine-health';

describe('Machine Health Kpis helper', () => {
  it('It should return the appropriate cell color and background based for Bad kpi status', () => {
    const badCellColor = {
      background: theme.colors.negativeRed4,
      color: theme.colors.darkRed
    };
    const cellColor = getCellColor(MachineHealthKpiStatus.Bad);
    expect(cellColor).toStrictEqual(badCellColor);
  });

  it('It should return the appropriate cell color and background based for Warn kpi status', () => {
    const warnCellColor = {
      background: theme.colors.atRiskYellow4,
      color: theme.colors.richGold
    };
    const cellColor = getCellColor(MachineHealthKpiStatus.Warning);
    expect(cellColor).toStrictEqual(warnCellColor);
  });

  it('It should return the appropriate cell color and background based for Good kpi status', () => {
    const goodCellColor = {
      background: theme.colors.onTrackGreen4,
      color: 'inherit'
    };
    const cellColor = getCellColor(MachineHealthKpiStatus.Good);
    expect(cellColor).toStrictEqual(goodCellColor);
  });
});
