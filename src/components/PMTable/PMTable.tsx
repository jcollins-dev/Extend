// 3rd party libs
import React, { ReactElement, useState } from 'react';
import { faUser, faBan, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

// Components
import { BaseTable, Typography, Button, Flyout } from 'components';
import PMActionMenu from './PMActionMenu';

// Custom hooks
import { useSort } from 'hooks';

// Helpers
import { formatDate } from 'helpers';

// Types
import {
  PM,
  PMTask,
  PMTaskWithKey,
  ColumnConfig,
  SortState,
  BaseType,
  SortClickHandler
} from 'types';
import { Variant as ButtonVariant } from 'components/Button';

/* Interfaces used for styling and local objects */
interface PMTableProps {
  data: PM[];
}

interface GroupRow extends BaseType {
  rowType: 'group';
  title: string;
  key: string;
}

type TableRow = GroupRow | PMTaskWithKey;

type BodyRowContainerProps = Pick<PMTask, 'priority'> & {
  isGroup?: boolean;
};

interface AssignedContainerProps {
  grayed: boolean;
}

interface FilterProps {
  onClick: () => void;
}

type SetSelectedTask = (task: PMTask) => void;

/* End interfaces */

/* Styling */
const Root = styled.div`
  width: 100%;
  height: auto;
`;

const BodyRowContainer = styled.tr<BodyRowContainerProps>`
  background-color: ${(props) => {
    if (props.isGroup) {
      return props.theme.colors.background.background2;
    }
    if (props.priority === 'high') {
      return '#FFE8E8';
    }
    if (props.priority === 'medium') {
      return '#FFF2E8';
    }

    return props.theme.colors.background.background1;
  }} !important; // !important needed to override BaseTable alternatingRowColoring styling

  // colored vertical line on the left of highlighted rows
  > *:first-child {
    position: relative;
    :before {
      content: '';
      display: ${(props) => (props.isGroup ? 'none' : 'block')};
      position: absolute;
      left: 0;
      top: 0;
      background-color: ${(props) => {
        if (props.priority === 'high') {
          return props.theme.colors.indicators.bad;
        }
        if (props.priority === 'medium') {
          return props.theme.colors.indicators.warning;
        }
        return 'transparent';
      }};
      width: 3px;
      height: 100%;
    }
  }
`;

const AssignedContainer = styled.div<AssignedContainerProps>`
  opacity: ${(props) => (props.grayed ? 0.5 : 1)};
  display: flex;
  align-items: center;
  > svg {
    margin-right: 1rem;
  }
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const ActionButton = styled(Button)`
  margin: 0;
`;

const FilterButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
`;
/* End styling */

/* Subcomponents */
const Description = ({ data }: { data: PMTaskWithKey }): ReactElement => (
  <>
    <Typography weight="bold" mb="0.5rem">
      {data.description}
    </Typography>
    <Typography mb={0}>{data.subDescription}</Typography>
  </>
);

const GroupRowContainer = ({ data }: { data: GroupRow }): ReactElement => (
  <Typography weight="bold" mb={0}>
    {data.title}
  </Typography>
);

const Assigned = ({ data }: { data: PMTaskWithKey }): ReactElement => (
  <AssignedContainer grayed={!data.assigned}>
    <FontAwesomeIcon icon={data.assigned ? faUser : faBan} />
    <div>
      <Typography weight="bold" mb={0}>
        Assigned
      </Typography>
      <Typography mb={0}>{data.assigned ? data.assigned.name : 'Unassigned'}</Typography>
    </div>
  </AssignedContainer>
);

const Action = ({
  data,
  setSelectedTask
}: {
  data: PMTaskWithKey;
  setSelectedTask: SetSelectedTask;
}): ReactElement => {
  let variant: ButtonVariant = 'default';
  if (data.priority === 'high') {
    variant = 'danger';
  }
  if (data.priority === 'medium') {
    variant = 'warning';
  }

  return (
    <ActionButton
      variant={variant}
      size="small"
      onClick={() => {
        setSelectedTask(data);
      }}
    >
      {data.assigned ? 'Take action' : 'Manage'}
    </ActionButton>
  );
};

const MachineName = ({ data }: { data: PMTaskWithKey }): ReactElement => (
  <Typography weight="bold" mb={0}>
    {data.machineId}
  </Typography>
);

const Filter = ({ onClick }: FilterProps): ReactElement => {
  return (
    <FilterButton onClick={onClick}>
      <FontAwesomeIcon icon={faFilter} />
    </FilterButton>
  );
};
/* End subcomponents */

/* Helper functions */

/**
 * Flatten the PM data structure to generate a list of rows of different types (groups, or tasks)
 */
const generateRows = (PMs: PM[]) => {
  const rows: TableRow[] = [];

  PMs.forEach((PM) => {
    let title = '';
    switch (PM.type) {
      case 'date':
        title = formatDate(PM.date as Date, 'day-of-week');
        break;
      // TODO - we aren't using these PM types right now, this table only renders dates
      case 'runtime':
        title = `${PM.runtime} hours`;
        break;
      case 'cycle-count':
        title = `${PM.cycleCount} cycles`;
        break;
    }

    const groupRow: GroupRow = {
      rowType: 'group',
      key: `group-${PM.id}`,
      title
    };

    rows.push(groupRow);

    PM.tasks.forEach((task) => {
      const taskWithKey: PMTaskWithKey = {
        ...task,
        key: `task-${PM.id}-${task.id}`
      };
      rows.push(taskWithKey);
    });
  });

  return rows;
};

/**
 * Returns a cell for a row. If the row is a group, returns an empty cell with colspan 0.
 * Otherwise returns a cell of colspan 1 with the given child.
 */
const maybeEmptyCell = (data: TableRow, child: React.ReactNode) => {
  let colSpan = 1;
  let children = child;

  if ((data as TableRow)?.rowType === 'group') {
    colSpan = 0;
    children = null;
  }
  const cell: React.ReactNode = {
    children,
    props: {
      colSpan
    }
  };
  return cell;
};

// Generate the configurations for each column of this table
const generateColumnConfigs = (
  sortState: Record<string, SortState>,
  setSelectedTask: SetSelectedTask
): ColumnConfig[] => {
  return [
    {
      title: 'Due date',
      dataIndex: 'date',
      key: 'date',
      width: '10rem',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'date')
        ? sortState['date']
        : SortState.unsorted,
      render(_, data) {
        // If the row is of type 'group', make a cell that spans the whole width of the table
        // Otherwise return a cell of colspan 1
        let colSpan = 1;
        let children = <MachineName data={data as PMTaskWithKey} />;

        if ((data as TableRow)?.rowType === 'group') {
          colSpan = 6;
          children = <GroupRowContainer data={data as GroupRow} />;
        }

        const cell: React.ReactNode = {
          children,
          props: {
            colSpan
          }
        };
        return cell;
      }
    },
    {
      title: 'Sub component',
      dataIndex: 'subcomponent',
      key: 'subcomponent',
      width: '10rem',
      render(value, data) {
        return maybeEmptyCell(data as TableRow, value);
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render(_, data) {
        return maybeEmptyCell(data as TableRow, <Description data={data as PMTaskWithKey} />);
      }
    },
    {
      title: 'Assigned',
      dataIndex: 'assigned',
      key: 'assigned',
      width: '10rem',
      render(_, data) {
        return maybeEmptyCell(data as TableRow, <Assigned data={data as PMTaskWithKey} />);
      }
    },
    {
      title: Filter({
        onClick: () => {
          console.log('TODO - launch filter flyout');
        }
      }),
      dataIndex: '',
      key: 'action',
      width: '10rem',
      align: 'right',
      render(_, data) {
        return maybeEmptyCell(
          data as TableRow,
          <Action data={data as PMTaskWithKey} setSelectedTask={setSelectedTask} />
        );
      }
    }
  ];
};
/* End helper functions */

/* Initial states for sorting and filtering */
const defaultSortState: Record<string, SortState> = {
  date: SortState.descending
};

/* End initial states */

const PMTable = ({ data = [] }: PMTableProps): ReactElement => {
  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);

  const sortedData = useSort<PM>(sortState, data);
  const tableData = generateRows(sortedData);
  const [selectedTask, setSelectedTask] = useState<PMTask | null>();

  // Interaction handler functions
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

  const closeFlyout = () => {
    setSelectedTask(null);
  };

  return (
    <Root>
      <Typography variant="h2">Upcoming PMs</Typography>
      <BaseTable
        columnConfigs={generateColumnConfigs(sortState, setSelectedTask)}
        data={tableData}
        alternatingRowColoring={false}
        bodyRowComponent={BodyRowContainer}
        sortHandler={sortHandler}
        onRow={(record) => {
          // Pass through props to the BodyRow styled component
          return {
            isGroup: record.rowType === 'group',
            priority: record.priority
          } as React.HTMLAttributes<TableRow>;
        }}
      />
      <Flyout width="22.5rem" visible={!!selectedTask} onClose={closeFlyout}>
        {selectedTask && <PMActionMenu task={selectedTask} onClose={closeFlyout} />}
      </Flyout>
    </Root>
  );
};

export default PMTable;
