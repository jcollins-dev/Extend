import { defaultLabelStyles } from './StyledCharts.styles';

export const overTime = {
  format: (d: Record<string, unknown>): string[] => {
    const datum = d?.datum as Record<string, unknown>;
    const dateKey = (d.dateKey as string) || 'date';
    const date = datum[dateKey];
    const group = datum[(d.groupKey as string) || 'type'];

    return [`${date}`, ` \n `, `${group}: ${datum.count}`];
  },
  styles: [
    { ...defaultLabelStyles, fontSize: 13, fillOpacity: 0.7 },
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 16, fontWeight: 500 }
  ]
};
