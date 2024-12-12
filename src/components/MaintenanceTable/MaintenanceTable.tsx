// 3rd party
import React, { ReactElement, useEffect, useState } from 'react';
import styled, { useTheme, DefaultTheme } from 'styled-components';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { BaseTable, Checkbox, PermissionWrapper, Typography } from 'components';

// Types
import { ColumnConfig, SortClickHandler, SortState, BaseType, UserScopes } from 'types';
import {
  MaintenanceCreator,
  MaintenanceEventStatus,
  MaintenanceEventTableRow,
  MaintenanceScheduleTableRow
} from 'types/maintenance';
import { PermissionScopeName } from 'types/user-management';

// Helpers
// TODO - use getNextStepCell when next steps are given with events
import {
  getNextStepCell,
  getStatusCellEvent,
  maintenanceEventGroupBy,
  maintenanceScheduleGroupBy
} from './helpers';
import { toISO8601 } from 'helpers';
// Custom hooks
import { useUser } from 'selectors';
import { getCreatorCopyString, getCreatorCopyStringPlanned } from 'helpers';
import {
  useCreateMaintenanceEventsMutation,
  useClearRecentlyCompletedMaintenanceSchedulesMutation
} from 'api';

/* Interfaces used for styling and local objects */

// The date fields that we are able to group tasks by
type GroupableDateFields = 'dueDate' | 'completionDate';

type GroupableStringFields = 'machineDescription';

interface GroupRow extends BaseType {
  rowType: 'group';
  title: string;
  countStr?: string;
  key: string;
}

type TableRow = GroupRow | MaintenanceEventTableRow;
type TableRowPlanned = GroupRow | MaintenanceScheduleTableRow;
/* End interfaces */

const Root = styled.div`
  width: 100%;
  height: auto;
`;

const TwoStackedTextContainer = styled.div`
  margin: 0;
  p {
    margin-bottom: 0;
    word-break: break-word;
  }
  p:last-child {
    margin-top: 0.125rem;
  }
`;

const BodyRowContainer = styled.tr<{ isGroup: boolean }>`
  background-color: ${(props) => {
    if (props.isGroup) {
      return props.theme.colors.lightGrey1;
    }

    return 'transparent';
  }} !important; // !important needed to override BaseTable alternatingRowColoring styling
`;

const GroupRowContainer = ({ data }: { data: GroupRow }): ReactElement => {
  const theme = useTheme();
  return (
    <Typography weight="medium" mb={0}>
      {data.title} <span style={{ color: theme.colors.mediumBlue }}>{data.countStr}</span>
    </Typography>
  );
};

/* End styling */

/* Helper functions */
/**
 * Generate the rows for the table.
 * These are grouped by date if groupByDateField is set.
 * Otherwise it just returns the rows unchanged.
 */
const generateRows = (
  inputRows: MaintenanceEventTableRow[],
  groupByDateField?: GroupableDateFields,
  groupByStringField?: GroupableStringFields
) => {
  let rows: TableRow[] = [];

  if (groupByDateField) {
    // Loop through the rows and find unique days. When we find a new day, add a group row.
    let lastRoundedDay = '';
    inputRows.forEach((inputRow) => {
      const roundedDay = moment(inputRow[groupByDateField] as Date)
        .startOf('day')
        .format();

      if (lastRoundedDay !== roundedDay) {
        rows.push({
          rowType: 'group',
          title: moment(roundedDay).format('D MMM YYYY'),
          key: roundedDay
        });
        lastRoundedDay = roundedDay;
      }
      rows.push(inputRow);
    });
  } else if (groupByStringField) {
    const result = maintenanceEventGroupBy(
      inputRows,
      (ir: MaintenanceEventTableRow) => ir.machineId as string
    );
    Array.from(result.entries()).map((entry) => {
      const items = entry[1];
      const groupByName = items[0].machineDescription;
      rows.push({
        rowType: 'group',
        title: `${groupByName}`,
        countStr: ` (${items.length})`,
        key: `${groupByName}`
      });
      rows.push(...items);
    });
  } else {
    rows = inputRows;
  }
  return rows;
};

const generateRowsPlanned = (
  inputRows: MaintenanceScheduleTableRow[],
  groupByDateField?: GroupableDateFields,
  groupByStringField?: GroupableStringFields
) => {
  let rows: TableRowPlanned[] = [];

  if (groupByDateField) {
    // Loop through the rows and find unique days. When we find a new day, add a group row.
    let lastRoundedDay = '';
    inputRows.forEach((inputRow) => {
      const roundedDay = moment(inputRow[groupByDateField] as Date)
        .startOf('day')
        .format();

      if (lastRoundedDay !== roundedDay) {
        rows.push({
          rowType: 'group',
          title: moment(roundedDay).format('D MMM YYYY'),
          key: roundedDay
        });
        lastRoundedDay = roundedDay;
      }
      rows.push(inputRow);
    });
  } else if (groupByStringField) {
    const result = maintenanceScheduleGroupBy(
      inputRows,
      (ir: MaintenanceScheduleTableRow) => ir.machineId as string
    );
    Array.from(result.entries()).forEach((entry) => {
      const items = entry[1];
      const groupByName = items[0].machineDescription;
      rows.push({
        rowType: 'group',
        title: `${groupByName}`,
        countStr: ` (${items.length})`,
        key: `${groupByName}`
      });
      rows.push(...items);
    });
  } else {
    rows = inputRows;
  }
  return rows;
};

/**
 * Returns a cell for a row. If the row is a group, returns an empty cell with colspan 0.
 * Otherwise returns a cell of colspan 1 with the given child and background color.
 */
const maybeEmptyCell = (data: TableRow, child: React.ReactNode, bg?: string) => {
  let colSpan = 1;
  let children = child;

  if ((data as TableRow)?.rowType === 'group') {
    colSpan = 0;
    children = null;
  }
  const cell: React.ReactNode = {
    children,
    props: {
      colSpan,
      style: {
        background: bg ? bg : 'transparent'
      }
    }
  };
  return cell;
};

const maybeEmptyCellPlanned = (data: TableRowPlanned, child: React.ReactNode, bg?: string) => {
  let colSpan = 1;
  let children = child;

  if ((data as TableRowPlanned)?.rowType === 'group') {
    colSpan = 0;
    children = null;
  }
  const cell: React.ReactNode = {
    children,
    props: {
      colSpan,
      style: {
        background: bg ? bg : 'transparent'
      }
    }
  };
  return cell;
};

// Generate the configurations for each column of this table
const generateColumnConfigs = ({
  sortState,
  theme,
  setSelectedPm,
  showSecondDescription = true,
  onClickCreateService,
  t
}: {
  sortState: Record<string, SortState>;
  theme: DefaultTheme;
  // TODO - use again when tasks are added
  setSelectedPm?: (pm: MaintenanceEventTableRow) => void;
  showSecondDescription?: boolean;
  onClickCreateService?: (data: MaintenanceEventTableRow) => void;
  t: TFunction<'fpns'[], undefined>;
}): ColumnConfig[] => {
  return [
    {
      title: t('mm_table_machine_model') as string,
      dataIndex: 'machineDescription',
      key: 'machineDescription',
      width: '20%',
      sortState: sortState['machineDescription'],
      render(value, data) {
        // If the row is of type 'group', make a cell that spans the whole width of the table
        // Otherwise return a cell of colspan 1
        let colSpan = 1;
        let children = <>{value}</>;

        if ((data as TableRow)?.rowType === 'group') {
          colSpan = 5;
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
      title: t('mm_table_sub_component') as string,
      dataIndex: 'subcomponent',
      key: 'subcomponent',
      width: '15%',
      sortState: sortState['subcomponent'],
      render(value, data) {
        // TODO - provide subcomponent when available from backend
        return maybeEmptyCell(data as TableRow, value);
      }
    },
    {
      title: t('mm_table_description') as string,
      dataIndex: 'description',
      key: 'description',
      width: '38%',
      sortState: SortState.none,
      render(value, data: MaintenanceEventTableRow) {
        return maybeEmptyCell(
          data as TableRow,
          <TwoStackedTextContainer>
            <Typography variant="body1">{value}</Typography>
            {showSecondDescription && (
              <Typography
                variant="body2"
                color={
                  data.creator === MaintenanceCreator.Predictive
                    ? theme.colors.darkRed
                    : theme.colors.black
                }
              >
                {getCreatorCopyString(data)}
              </Typography>
            )}
          </TwoStackedTextContainer>
        );
      }
    },
    {
      title: t('mm_table_status') as string,
      dataIndex: 'suggestedDue',
      key: 'suggestedDue',
      width: '12%',
      sortState: sortState['suggestedDue'],
      render(_, data: MaintenanceEventTableRow) {
        const { cell, cellColor } = getStatusCellEvent(data, theme, t);
        return maybeEmptyCell(data as TableRow, cell, cellColor);
      }
    },
    {
      title: t('mm_table_next_step') as string,
      dataIndex: 'nextStep',
      key: 'nextStep',
      width: '15%',
      sortState: SortState.none,
      render(value, data) {
        // TODO - provide subcomponent when available from backend
        const { cell, cellColor } = getNextStepCell(
          data as MaintenanceEventTableRow,
          theme,
          t,
          setSelectedPm,
          onClickCreateService
        );
        return maybeEmptyCell(data as TableRow, cell, cellColor);
      }
    }
  ];
};

const generateColumnConfigsPlanned = (
  sortState: Record<string, SortState>,
  theme: DefaultTheme,
  tempEventsState: MaintenanceScheduleTableRow[] | undefined,
  handleCheckedEvent: (
    eventId: string,
    machineId: string,
    recentlyCompleted: boolean | undefined
  ) => void,
  t: TFunction<'fpns'[], undefined>
  // TODO - use again when tasks are added
): ColumnConfig[] => {
  return [
    {
      title: t('mm_table_machine_model') as string,
      dataIndex: 'machineDescription',
      key: 'machineDescription',
      width: '20%',
      sortState: SortState.none,
      render(value, data) {
        // If the row is of type 'group', make a cell that spans the whole width of the table
        // Otherwise return a cell of colspan 1
        let colSpan = 1;
        let children = <>{value}</>;

        if ((data as TableRowPlanned)?.rowType === 'group') {
          colSpan = 5;
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
      title: t('mm_table_sub_component') as string,
      dataIndex: 'subcomponent',
      key: 'subcomponent',
      width: '15%',
      sortState: sortState['subcomponent'],
      render(value, data) {
        // TODO - provide subcomponent when available from backend
        return maybeEmptyCellPlanned(data as TableRowPlanned, value);
      }
    },
    {
      title: t('mm_table_description') as string,
      dataIndex: 'description',
      key: 'description',
      width: '23%',
      sortState: SortState.none,
      render(value, data: MaintenanceScheduleTableRow) {
        return maybeEmptyCellPlanned(
          data as TableRowPlanned,
          <TwoStackedTextContainer>
            <Typography variant="body1">{value}</Typography>
            <Typography
              variant="body2"
              color={
                data.creator === MaintenanceCreator.Predictive
                  ? theme.colors.darkRed
                  : theme.colors.black
              }
            >
              {getCreatorCopyStringPlanned(data)}
            </Typography>
          </TwoStackedTextContainer>
        );
      }
    },
    {
      title: t('mm_table_mark_complete') as string,
      dataIndex: 'recentlyCompleted',
      key: 'recentlyCompleted',
      width: '15%',
      sortState: SortState.none,
      render(value, data: MaintenanceScheduleTableRow) {
        const thisEvent = tempEventsState?.find((event) => event.id === data.id);
        const recentlyCompleted = thisEvent !== undefined ? thisEvent.recentlyCompleted : false;
        return maybeEmptyCellPlanned(
          data as TableRowPlanned,
          <div>
            <PermissionWrapper
              page={PermissionScopeName.MAINTENANCE_MANAGER}
              scope={UserScopes.Write}
            >
              <Checkbox
                width={20}
                height={20}
                label=""
                checked={recentlyCompleted}
                onChange={() => {
                  handleCheckedEvent(data.id, data.machineId, recentlyCompleted);
                }}
              />
            </PermissionWrapper>
          </div>
        );
      }
    }
  ];
};

export type SortableColumn = 'subcomponent' | 'machineDescription' | 'suggestedDue';
interface MaintenanceTableProps {
  data: MaintenanceEventTableRow[];
  isDataLoading?: boolean;
  groupByDateField?: GroupableDateFields;
  groupByStringField?: GroupableStringFields;
  headerBgColor?: string;
  sortState: Record<string, SortState>;
  sortColumnClicked: (column: SortableColumn) => void;
  setSelectedPm?: (pm: MaintenanceEventTableRow) => void;
  showSecondDescription?: boolean;
  onClickCreateService?: (data: MaintenanceEventTableRow) => void;
}

interface MaintenanceTablePropsPlanned {
  data: MaintenanceScheduleTableRow[];
  isDataLoading?: boolean;
  groupByDateField?: GroupableDateFields;
  groupByStringField?: GroupableStringFields;
  headerBgColor?: string;
  selectedSecondaryTab?: number | undefined;
  sortState: Record<string, SortState>;
  sortColumnClicked: (column: SortableColumn) => void;
  setSelectedPm?: (pm: MaintenanceScheduleTableRow) => void;
  markAllCompleted?: boolean;
  pageNumber: number;
  scheduleFrequency: number | undefined;
  showCompletedText?: boolean;
  setShowCompletedText: React.Dispatch<React.SetStateAction<boolean>>;
  isMarkerReset: boolean;
  setIsMarkerReset: React.Dispatch<React.SetStateAction<boolean>>;
  setCompletedMaintenanceEvents?: (ce: MaintenanceScheduleTableRow[]) => void;
}

interface MarkedMaintenancePage {
  pageNumber: number;
  scheduleFrequency: number | undefined;
  isFullyCompletedPage: boolean;
  isUnmarkedPage: boolean;
  items: MaintenanceScheduleTableRow[] | undefined;
}

const MaintenanceTable = ({
  data,
  isDataLoading,
  groupByDateField,
  groupByStringField,
  headerBgColor,
  sortState,
  sortColumnClicked,
  setSelectedPm,
  showSecondDescription,
  onClickCreateService
}: MaintenanceTableProps): ReactElement => {
  const theme = useTheme();
  const { t } = useTranslation(['fpns']);

  const tableData = generateRows(data, groupByDateField, groupByStringField);

  // Interaction handler functions
  const sortHandler: SortClickHandler = (key) => {
    if (key === 'subcomponent' || key === 'machineDescription' || key === 'suggestedDue') {
      sortColumnClicked(key);
    }
  };

  return (
    <Root>
      <BaseTable
        alternatingRowColoring={false}
        columnConfigs={generateColumnConfigs({
          sortState,
          theme,
          setSelectedPm,
          showSecondDescription,
          onClickCreateService,
          t
        })}
        data={tableData}
        sortHandler={sortHandler}
        isDataLoading={isDataLoading}
        rowKey={(record: BaseType, index?: number) =>
          `${(record as MaintenanceEventTableRow).id}-${index}`
        }
        borderBottomRow
        bodyRowComponent={BodyRowContainer}
        onRow={(record) => {
          // Pass through props to the BodyRow styled component
          return {
            isGroup: record.rowType === 'group'
          } as React.HTMLAttributes<TableRow>;
        }}
        headerBgColor={headerBgColor}
      />
    </Root>
  );
};

export const MaintenanceScheduleTableQuery = ({
  data,
  isDataLoading,
  groupByDateField,
  groupByStringField,
  headerBgColor,
  sortState,
  sortColumnClicked,
  markAllCompleted,
  pageNumber,
  scheduleFrequency,
  showCompletedText,
  setShowCompletedText,
  isMarkerReset,
  setIsMarkerReset,
  setCompletedMaintenanceEvents
}: MaintenanceTablePropsPlanned): ReactElement => {
  const [tempEventsState, setTempEventsState] = useState<MaintenanceScheduleTableRow[]>();
  const [markedAsCompletedEvents, setMarkedAsCompletedEvents] = useState<MarkedMaintenancePage[]>(
    []
  );
  const theme = useTheme();
  const user = useUser();
  const { t } = useTranslation(['fpns']);
  const [createEvent] = useCreateMaintenanceEventsMutation();
  const [clearMaintenanceEvents] = useClearRecentlyCompletedMaintenanceSchedulesMutation();

  const tableData = generateRowsPlanned(data, groupByDateField, groupByStringField);

  useEffect(() => {
    if (
      !markedAsCompletedEvents.some(
        (e) => e.pageNumber === pageNumber && e.scheduleFrequency === scheduleFrequency
      )
    ) {
      setTempEventsState(data);
    }
  }, [tableData]);

  useEffect(() => {
    //Populate the download array with selected events on tab load.
    if (markedAsCompletedEvents && markedAsCompletedEvents.length > 0) {
      const completed: MaintenanceScheduleTableRow[] = [];
      markedAsCompletedEvents.forEach((event) => {
        if (event.items && event.scheduleFrequency === scheduleFrequency) {
          event.items.forEach((item) => {
            if (item.recentlyCompleted) {
              completed.push(item);
            }
          });
        }
      });

      /* eslint-disable  @typescript-eslint/no-non-null-assertion */
      setCompletedMaintenanceEvents!(completed);
    }
  }, [markedAsCompletedEvents]);

  useEffect(() => {
    if (markedAsCompletedEvents && markedAsCompletedEvents.length > 0) {
      const currentPage = markedAsCompletedEvents.filter(
        (m) => m.pageNumber === pageNumber && m.scheduleFrequency === scheduleFrequency
      );
      if (currentPage.length === 1) {
        setTempEventsState(currentPage[0].items);
        setShowCompletedText(true);
      }
    }
  }, [pageNumber, scheduleFrequency]);

  useEffect(() => {
    const completedEvents: MaintenanceScheduleTableRow[] = [];
    const resetEvents: MaintenanceScheduleTableRow[] = [];
    const clearedMaintenanceEventIds: string[] = [];
    if (markAllCompleted && !showCompletedText) {
      markAllCompleted = false;
    }
    if (markAllCompleted && tempEventsState) {
      tempEventsState.forEach((event) => {
        createEvent([
          {
            machineId: event.machineId,
            maintenanceScheduleId: event.id,
            status: MaintenanceEventStatus.Completed,
            creator: MaintenanceCreator.User,
            owner: user?.id,
            priority: 0,
            completion: toISO8601(new Date())
          }
        ]);
        completedEvents.push({ ...event, recentlyCompleted: true });
      });
      if (completedEvents.length > 0) {
        // setTimeout(() => {
        setTempEventsState(completedEvents);
        // }, 2000);
        const markedPage: MarkedMaintenancePage = {
          pageNumber: pageNumber,
          scheduleFrequency: scheduleFrequency,
          isFullyCompletedPage: true,
          isUnmarkedPage: false,
          items: completedEvents
        };
        setMarkedAsCompletedEvents([...markedAsCompletedEvents, markedPage]);
      }
    } else if (tempEventsState && !isMarkerReset) {
      tempEventsState?.forEach((event) => {
        clearedMaintenanceEventIds.push(event.id);
        resetEvents.push({ ...event, recentlyCompleted: false });
      });
      const markedPage: MarkedMaintenancePage = {
        pageNumber: pageNumber,
        scheduleFrequency: scheduleFrequency,
        isFullyCompletedPage: true,
        isUnmarkedPage: false,
        items: resetEvents
      };
      if (resetEvents.length > 0) {
        setMarkedAsCompletedEvents([markedPage]);
        setTempEventsState(resetEvents);
        clearMaintenanceEvents(clearedMaintenanceEventIds).then(() => {
          if (markedAsCompletedEvents.length > 0) {
            setMarkedAsCompletedEvents((prev) => {
              return prev.filter(
                (f) => f.pageNumber !== pageNumber && f.scheduleFrequency !== scheduleFrequency
              );
            });
          }
        });
      }
    } else if (isMarkerReset) {
      setIsMarkerReset(false);
    }
  }, [markAllCompleted]);

  // Interaction handler functions
  const sortHandler: SortClickHandler = (key) => {
    if (key === 'subcomponent') {
      sortColumnClicked(key);
    }
  };

  const handleCheckedEvent = (
    eventId: string,
    machineId: string,
    recentlyCompleted: boolean | undefined
  ) => {
    if (!recentlyCompleted) {
      createEvent([
        {
          machineId,
          maintenanceScheduleId: eventId,
          status: MaintenanceEventStatus.Completed,
          creator: MaintenanceCreator.Manufacturer,
          owner: user?.id,
          priority: 0,
          completion: toISO8601(new Date())
        }
      ]).then(() => {
        const newEvents = tempEventsState?.map((event) =>
          event.id === eventId ? { ...event, recentlyCompleted: true } : event
        );

        setTempEventsState(newEvents);
        if (markedAsCompletedEvents.length === 0) {
          const markedPage: MarkedMaintenancePage = {
            pageNumber: pageNumber,
            scheduleFrequency: scheduleFrequency,
            isFullyCompletedPage: false,
            isUnmarkedPage: false,
            items: newEvents
          };
          setMarkedAsCompletedEvents([...markedAsCompletedEvents, markedPage]);
        } else {
          setMarkedAsCompletedEvents([
            ...updateModifiedPage(markedAsCompletedEvents, eventId, true, newEvents)
          ]);
        }
      });
    } else {
      clearMaintenanceEvents([eventId]).then(() => {
        const newEvents = tempEventsState?.map((event) =>
          event.id === eventId ? { ...event, recentlyCompleted: false } : event
        );
        setTempEventsState(newEvents);
        setMarkedAsCompletedEvents([
          ...updateModifiedPage(markedAsCompletedEvents, eventId, false, newEvents)
        ]);

        for (let i = 0; i < markedAsCompletedEvents.length; i++) {
          const isMarked = markedAsCompletedEvents[i].items?.some((s) => s.recentlyCompleted);
          if (!isMarked) {
            markedAsCompletedEvents[i].isUnmarkedPage = true;
            break;
          }
        }
        setMarkedAsCompletedEvents(markedAsCompletedEvents.filter((f) => !f.isUnmarkedPage));
      });
    }
  };

  const updateModifiedPage = (
    pages: MarkedMaintenancePage[],
    eventId: string,
    toggleState: boolean,
    newEvents: MaintenanceScheduleTableRow[] | undefined
  ): MarkedMaintenancePage[] => {
    let foundEventPage = false;
    if (pages) {
      pages.forEach((m) => {
        if (m.pageNumber == pageNumber && m.scheduleFrequency === scheduleFrequency) {
          foundEventPage = true;
          m.items = m.items?.map((event) =>
            event.id === eventId ? { ...event, recentlyCompleted: toggleState } : event
          );
        }
      });
      if (!foundEventPage) {
        const markedPage: MarkedMaintenancePage = {
          pageNumber: pageNumber,
          scheduleFrequency: scheduleFrequency,
          isFullyCompletedPage: false,
          isUnmarkedPage: false,
          items: newEvents
        };
        pages = [...pages, markedPage];
      }
    }
    return pages;
  };
  return (
    <Root>
      <BaseTable
        alternatingRowColoring={false}
        columnConfigs={generateColumnConfigsPlanned(
          sortState,
          theme,
          tempEventsState,
          handleCheckedEvent,
          t
        )}
        data={tableData}
        sortHandler={sortHandler}
        isDataLoading={isDataLoading}
        rowKey={(record: BaseType, index?: number) =>
          `${(record as MaintenanceEventTableRow).id}-${index}`
        }
        borderBottomRow
        bodyRowComponent={BodyRowContainer}
        onRow={(record) => {
          // Pass through props to the BodyRow styled component
          return {
            isGroup: record.rowType === 'group'
          } as React.HTMLAttributes<TableRow>;
        }}
        headerBgColor={headerBgColor}
      />
    </Root>
  );
};

export default MaintenanceTable;
