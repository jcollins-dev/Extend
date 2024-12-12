import React, { ReactNode } from 'react';
import { TotalsBarContainer, baseClass } from './TotalsBar.elements';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';
import { StyledLoader } from 'components/StyledUi/elements/StyledLoader';

export type TotalsBarPropsFormat = (x: Record<string, unknown>) => ReactNode | ReactNode[];

export interface TotalsBarPropsCell {
  title?: ReactNode | ReactNode[];
  label?: ReactNode | ReactNode[];
  value?: ReactNode | ReactNode[];
  excludeKeys?: string[];
  format?: {
    title?: TotalsBarPropsFormat;
    label?: TotalsBarPropsFormat;
    value?: TotalsBarPropsFormat;
  };
}

interface Cells {
  count?: TotalsBarPropsCell;
  sum?: TotalsBarPropsCell;
  average?: TotalsBarPropsCell;
}

export interface TotalsBarProps extends StyledUiContainerProps, GetTotalsProps {
  data?: Record<string, unknown>[];
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
  cells?: Cells;
}

export interface GetTotalsProps {
  /** the key to get value to group items by */
  groupKey?: string;
  /** the key to get value to group items by */
  groupKeys?: string[];
  /** the key to get value from for sum or average  */
  valueKey?: string;
  /** need this for TS pass */
  excludeKeys?: string[];
}

export interface GetTotalsPropsItem {
  count: number;
  sum?: number;
  average?: number;
}

interface CellProps extends TotalsBarPropsCell, GetTotalsProps {
  group?: string;
}

const Cell = ({ title, value, label, format, excludeKeys }: CellProps): JSX.Element => {
  if (format?.title) title = format.title({ title, value, label, excludeKeys });
  if (format?.value) value = format.value({ title, value, label, excludeKeys });
  if (format?.label) label = format.label({ title, value, label, excludeKeys });

  return (
    <div className={`${baseClass}__cell`}>
      <div className={`${baseClass}__cell-title`}>{title}</div>
      <div className={`${baseClass}__cell-value`}>{value || 0}</div>
      {label && <div className={`${baseClass}__cell-label`}>{label}</div>}
    </div>
  );
};

const calculateTotals = (
  data: Record<string, unknown>[],
  cells: Cells,
  { groupKey, valueKey, groupKeys }: GetTotalsProps
): {
  count: number;
  average: number;
  sum: number;
  group?: string;
} => {
  const count = 0,
    average = 0,
    sum = 0;

  if (!groupKey) {
    //console.warn('Error: missing groupKey in calculateTotals')
    return { count, average, sum };
  }
  // add single groupKey to array for consistent processing
  groupKeys = groupKey ? [groupKey] : groupKeys;

  if (!groupKeys) return { count, average, sum };

  const totals = data.reduce(
    (
      counter: {
        [id: string]: {
          count: number;
          average: number;
          sum: number;
          group?: string;
        };
      },
      item
    ) => {
      (groupKeys as string[]).forEach((groupKey) => {
        if (!counter[groupKey])
          counter = { ...counter, [groupKey as string]: { count: 0, average: 0, sum: 0 } };

        if (!cells?.count?.excludeKeys?.includes(item[groupKey] as string))
          counter[groupKey].count = counter[groupKey].count + 1;

        if (valueKey && Number(item[valueKey])) {
          // gets the value as number
          const value = Number(item[valueKey]);

          // make sure entries aren't excluded from sum or average
          if (
            !cells?.sum?.excludeKeys
              ?.map((str) => (str === (item[groupKey] as string) ? true : false))
              .filter(Boolean).length
          )
            counter[groupKey].sum = counter[groupKey].sum + value;

          // make sure entries aren't excluded from average
          if (
            !cells?.average?.excludeKeys
              ?.map((str) => (str === item[groupKey] ? true : false))
              .filter(Boolean).length
          )
            counter[groupKey].average = counter[groupKey].sum / counter[groupKey].count;
        }
      });
      return counter;
    },
    {}
  );

  return totals[groupKey as string];
};

export const TotalsBar = ({
  isLoading,
  className,
  data,
  cells,
  ...totalsProps
}: TotalsBarProps): JSX.Element => {
  className = `${baseClass}${!className ? `` : ` ${className}`}`;

  if (!cells)
    return (
      <TotalsBarContainer className={className}>
        error: totalsBar is missing cells property
      </TotalsBarContainer>
    );
  else if (isLoading)
    return (
      <TotalsBarContainer className={className}>
        <StyledLoader />
      </TotalsBarContainer>
    );
  else if (!data)
    return <TotalsBarContainer className={className}>no data to display</TotalsBarContainer>;
  else {
    const totals = data && cells && calculateTotals(data, cells, totalsProps);

    return (
      <TotalsBarContainer className={className}>
        {cells?.count && <Cell {...cells.count} value={totals?.count} />}
        {cells?.sum && <Cell {...cells.sum} value={totals?.sum} />}
        {cells?.average && <Cell {...cells.average} value={totals?.average} />}
      </TotalsBarContainer>
    );
  }
};

/*

need to save this for later, i will try to move it to a text file in this folder 

const calculateGroupTotals = (data: Record<string, unknown>[], cell: TotalsBarPropsCell): GetTotalsReturnProps => {

  let totalCounter: TotalsBarPropsCell = {

  }


  data.map((item: Record<string, unknown>) => {

    keysToCalculate.map(({ groupKey, valueKey, getAverage, getSum }: GetTotalsProps) => {
      // check if groupKey exists in object
      if (groupKey && item[groupKey]) {

        // see if this totals group exists in totals object
        if (!totalCounter[groupKey]) totalCounter = { [groupKey]: { groupKey }, ...totalCounter }
        const groupId = item[groupKey] as string
        // see if this groupId exists in totals object
        if (!totalCounter[groupKey][groupId]) totalCounter[groupKey] = { [groupId]: { count: 0, sum: 0, average: 0 }, ...totalCounter[groupKey] }
        // increment count for this goupId
        totalCounter[groupKey][groupId].count += 1
        // check if valueKey exists in object and make sure it's a number
        if (valueKey && Number(item[valueKey])) {
          const value = item[valueKey] as number
          // running sum of values
          if (getSum) totalCounter[groupKey][groupId].sum += value
          // running average value
          if (getAverage) totalCounter[groupKey][groupId].average = totalCounter[groupKey][groupId].sum / totalCounter[groupKey][groupId].count
        }




      }

    })

  })


  return totalCounter
}

*/
