// 3rd party libs
import React, { useMemo, useState } from 'react';

// Components
import { ActionButton, BaseTable, Typography } from 'components';

// Types
import { ColumnConfig, SortClickHandler, SortState } from 'types';

// Custom hooks
import { useSort } from 'hooks';

// Helpers
import { formatDuration } from 'helpers';

// Types
import { CleaningStepGroup } from 'types/protein';
import _ from 'lodash';

// Remove unusable props
type CleaningSteps = Omit<CleaningStepGroup, 'duration' | 'steps' | 'percent'>;

interface CleaningStepGroupWithKey extends CleaningSteps {
  key: string;
  parent?: boolean;
  children: CleaningSteps[];
}

interface Props {
  data: CleaningStepGroup[];
  selectedSteps?: string[];
}

// Initial state for sorting
const defaultSortState: Record<string, SortState> = {
  name: SortState.unsorted,
  averageDuration: SortState.unsorted
};

// Group CleaningStepGroup[] by parent name, and add a key to each row/subRow
const groupByParentNameWithKeys = (data: CleaningStepGroup[]): CleaningStepGroupWithKey[] => {
  const rows: CleaningStepGroupWithKey[] = [];
  // Group steps by their 'parentName'
  const group = _(data)
    .groupBy((step) => step.parentName)
    .map((value, key) => ({
      parent: key,
      steps: value
    }))
    .value();

  // Populate parent row
  group.forEach((d) => {
    rows.push({
      id: d.parent,
      key: d.parent,
      name: d.parent,
      parentName: d.parent,
      parent: true,
      // Aggregate subRows data (cleaning steps)
      averageDuration: d.steps.map((step) => step.averageDuration).reduce((a, b) => a + b, 0),
      maxDuration: Math.max(...d.steps.map((step) => step.maxDuration)),
      minDuration: Math.min(...d.steps.map((step) => step.minDuration)),
      children: d.steps.map((step) => {
        return { ...step, key: `${d.parent}-${step.id}` };
      })
    });
  });

  return rows;
};

// Generate the configurations for each column of this table
const generateColumnConfigs = <T extends { parent?: boolean; key: string }>(
  sortState: Record<string, SortState>,
  expandedRowKeys: string[],
  onExpand: (key: string) => void
): ColumnConfig[] => {
  return [
    {
      title: 'Steps',
      dataIndex: 'name',
      key: 'name',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'name')
        ? sortState['name']
        : SortState.unsorted,
      render(value, data) {
        const { key, parent } = data as T;

        return parent ? (
          <ActionButton downArrow={expandedRowKeys.includes(key)} onClick={() => onExpand(key)}>
            {value}
          </ActionButton>
        ) : (
          <Typography mb={0} weight="bold" size="0.8125rem" style={{ marginLeft: '1rem' }}>
            {value}
          </Typography>
        );
      }
    },
    {
      title: 'Average over time',
      dataIndex: 'averageDuration',
      key: 'averageDuration',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'averageDuration')
        ? sortState['averageDuration']
        : SortState.unsorted,
      render(value) {
        return formatDuration(value as number, 'hours:mins:secs');
      }
    },
    {
      title: 'Min',
      dataIndex: 'minDuration',
      key: 'minDuration',
      render(value, data) {
        const { parent } = data as T;
        return parent ? '—' : formatDuration(value as number, 'hours:mins:secs');
      }
    },
    {
      title: 'Max',
      dataIndex: 'maxDuration',
      key: 'maxDuration',
      render(value, data) {
        const { parent } = data as T;
        return parent ? '—' : formatDuration(value as number, 'hours:mins:secs');
      }
    }
  ];
};

const filter = (data: CleaningStepGroup[], selectedSteps: string[] | undefined) => {
  return selectedSteps?.length ? data.filter(({ id }) => selectedSteps.includes(id)) : data;
};

const CleaningStepsDurationsTable = ({ data, selectedSteps }: Props): JSX.Element => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);

  const dataWithKeys = useMemo(
    () => groupByParentNameWithKeys(filter(data, selectedSteps)),
    [data, selectedSteps]
  );

  const sortedData = useSort<CleaningStepGroupWithKey>(sortState, dataWithKeys);

  const sortHandler: SortClickHandler = (key, currentSortState) => {
    const newSortState = {
      ...defaultSortState,
      [key]:
        currentSortState === SortState.ascending
          ? SortState.descending
          : currentSortState === SortState.descending
          ? SortState.unsorted
          : SortState.ascending
    };
    setSortState(newSortState);
  };

  return (
    <BaseTable
      columnConfigs={generateColumnConfigs(sortState, expandedRowKeys, (key) => {
        const isExpanded = expandedRowKeys.includes(key);
        if (isExpanded) {
          setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
        } else {
          setExpandedRowKeys([...expandedRowKeys, key]);
        }
      })}
      alternatingRowColoring={false}
      data={sortedData}
      sortHandler={sortHandler}
      borderBottomRow
      expandable={{
        expandedRowKeys
      }}
    />
  );
};

export default CleaningStepsDurationsTable;
