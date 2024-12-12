import React, { useMemo } from 'react';
import { TotalsBar } from 'components/StyledUi/StyledChartsV2/UIChartsAndFiltersPage/TotalsBar';
import { useChartsAndFiltersPageData } from 'components/StyledUi/StyledChartsV2/UIChartsAndFiltersPage/_hooks/useChartsAndFiltersPageData';
import { filterSelectedData, useFilterSelected } from 'components';
import { convertSecondsToTime } from 'components/StyledUi/js';

export const AlarmsTotalsBar = (): JSX.Element => {
  const { data } = useChartsAndFiltersPageData();
  const [selected] = useFilterSelected();

  // cache filtered data
  const filteredData = useMemo(() => filterSelectedData({ data, selected }), [data, selected]);

  // check if warning information is selected for use with changing titles and labels
  let warningIsSelected = false;

  // set default title
  let title = 'All Alarms';

  // check if any items are selected to change titles
  if (selected) {
    selected?.type?.forEach((val: string) => {
      if (val === 'Warning Information') {
        warningIsSelected = true;
      }
    });
  }

  const labelAppend =
    !selected || (warningIsSelected && selected.type.length > 2)
      ? `(Excluding Warning Information)`
      : ``;

  if (warningIsSelected) title = 'Warning Information';

  if (selected?.code) title = `ID: ${selected?.code?.[0]}`;

  const totalsBarSetings = {
    groupKey: 'type',
    valueKey: 'duration',
    cells: {
      count: {
        title,
        label: `Total Alarms${warningIsSelected ? `` : ` (Including Warning Information)`} `,
        format: {
          value: (x: Record<string, unknown>) => (x.value || <>0</>) as string
        }
      },
      sum: {
        title,
        label: `Total Duration ${labelAppend}`,
        excludeKeys: warningIsSelected ? undefined : ['Warning Information'],
        format: {
          value: (x: Record<string, unknown>) => <>{convertSecondsToTime(x.value as number)}</>
        }
      },
      average: {
        title,
        label: `Average Duration ${labelAppend}`,
        excludeKeys: warningIsSelected ? undefined : ['Warning Information'],
        format: {
          value: (x: Record<string, unknown>) => <>{convertSecondsToTime(x.value as number)}</>
        }
      }
    }
  };

  if (!data || !filteredData) return <></>;

  return <TotalsBar {...totalsBarSetings} data={filteredData} />;
};
