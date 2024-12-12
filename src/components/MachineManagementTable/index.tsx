// 3rd party
import React, { ReactElement, useMemo, useState } from 'react';
import styled, { useTheme, DefaultTheme } from 'styled-components';
import { JBTRoutes } from 'constants/routes';
import { useHistory } from 'react-router';

// Components
import { BaseTable, Indicator, Button } from 'components';

// Types
import { ColumnConfig, SortClickHandler, SortState, BaseType } from 'types';
import { MachineProgressType, OnboardingMachine, MasterTagList } from 'types/machine-management';
import { useSort } from 'hooks';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface GroupRow extends BaseType {
  rowType: 'group';
  title: string;
  countStr?: string;
  key: string;
}

type TableRow = GroupRow | OnboardingMachine;
/* End interfaces */

const Root = styled.div`
  width: 100%;
  height: auto;
`;

const BodyRowContainer = styled.tr<{ isGroup: boolean }>`
  background-color: ${(props) => {
    if (props.isGroup) {
      return props.theme.colors.lightGrey1;
    }

    return 'transparent';
  }} !important; // !important needed to override BaseTable alternatingRowColoring styling
`;

const ActionsButton = styled(Button)`
  border: none;
  box-shadow: none;
  border-radius: 0.5rem;
  padding: 0.25rem 0.375rem;
  width: 1%;
  svg {
    margin-left: 0;
  }
`;

const StyledIndicator = styled(Indicator)`
  cursor: pointer;
  display: inline;
  margin: 0;
`;

const TagListDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const makeIndicator = (
  onboardingMachine: OnboardingMachine,
  data: string,
  theme: DefaultTheme,
  goTo: (onboardingMachine: OnboardingMachine) => void
) => {
  switch (data) {
    case MachineProgressType.NONE:
      return (
        <StyledIndicator onClick={() => goTo(onboardingMachine)} color={theme.colors.lightGrey6}>
          Not Started
        </StyledIndicator>
      );
    case MachineProgressType.UPLOADING:
      return (
        <StyledIndicator onClick={() => goTo(onboardingMachine)} color={theme.colors.richGold}>
          Uploading
        </StyledIndicator>
      );
    case MachineProgressType.INPROGRESS:
      return (
        <StyledIndicator onClick={() => goTo(onboardingMachine)} color={theme.colors.atRiskYellow}>
          In Progress
        </StyledIndicator>
      );
    case MachineProgressType.DONE:
      return (
        <StyledIndicator onClick={() => goTo(onboardingMachine)} color={theme.colors.onTrackGreen}>
          Done
        </StyledIndicator>
      );
    default:
      return <div>{data}</div>;
  }
};

// Generate the configurations for each column of this table
const generateColumnConfigs = ({
  sortState,
  theme,
  goTo,
  onOpenActions
}: {
  sortState: Record<string, SortState>;
  theme: DefaultTheme;
  goTo: (onboardingMachine: OnboardingMachine) => void;
  onOpenActions?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, mtlId: string) => void;
}): ColumnConfig[] => {
  return [
    {
      title: 'Customer/Location',
      dataIndex: 'customer',
      key: 'customer',
      width: '18%',
      sortState: sortState['customer'],
      render(value, record) {
        const data = record as OnboardingMachine;
        return (
          <div style={{ cursor: 'pointer' }} onClick={() => goTo(data)}>
            {data.customer}
          </div>
        );
      }
    },
    {
      title: 'Machine',
      dataIndex: 'description',
      key: 'description',
      width: '18%',
      sortState: sortState['description'],
      render(value, record) {
        const data = record as OnboardingMachine;
        return (
          <div style={{ cursor: 'pointer' }} onClick={() => goTo(data)}>
            {data.description}
          </div>
        );
      }
    },
    {
      title: 'Diagram',
      dataIndex: 'diagrams',
      key: 'diagrams',
      width: '16%',
      sortState: sortState['diagrams'],
      render(value, record) {
        const data = record as OnboardingMachine;
        return makeIndicator(data, data.diagrams || '', theme, goTo);
      }
    },
    {
      title: 'Maintenance Schedule',
      dataIndex: 'maintenanceSchedule',
      key: 'maintenanceSchedule',
      width: '16%',
      sortState: sortState['maintenanceSchedule'],
      render(value, record) {
        const data = record as OnboardingMachine;
        return makeIndicator(data, data.maintenanceSchedule || '', theme, goTo);
      }
    },
    {
      title: 'Gateway ID',
      dataIndex: 'provisionGateway',
      key: 'provisionGateway',
      width: '16%',
      sortState: sortState['provisionGateway'],
      render(value, record) {
        const data = record as OnboardingMachine;
        return makeIndicator(data, data.provisionGateway || '', theme, goTo);
      }
    },
    {
      title: 'Tag List',
      dataIndex: 'tagList',
      key: 'tagList',
      width: '16%',
      sortState: sortState['tagList'],
      render(value, record) {
        const data = record as OnboardingMachine;
        return (
          <TagListDiv>
            <span>{makeIndicator(data, data.tagList || '', theme, goTo)}</span>
          </TagListDiv>
        );
      }
    },
    {
      title: '',
      dataIndex: 'ellipsesMenu',
      key: 'ellipsesMenu',
      width: '16%',
      sortState: undefined,
      render(value, record) {
        return (
          <ActionsButton
            onClick={(event) => {
              if (onOpenActions) onOpenActions(event, (record as MasterTagList).id);
            }}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </ActionsButton>
        );
      }
    } /* ,
    {
      title: 'KPI Threshold',
      dataIndex: 'kpiThreshold',
      key: 'kpiThreshold',
      width: '14%',
      sortState: sortState.column === 'kpiThreshold' ? sortState.state : SortState.unsorted,
      render(value, record) {
        const data = record as OnboardingMachine
        if (data.kpi_threshold) return <StyledIndicator color={theme.colors.onTrackGreen}>Done</StyledIndicator>;
        return <StyledIndicator color={theme.colors.lightGrey6}>Not Started</StyledIndicator>
      }
    }, */
  ];
};

export type SortableColumn =
  | 'customer'
  | 'description'
  | 'diagrams'
  | 'maintenanceSchedule'
  | 'provisionGateway'
  | 'tagList'; //  | 'kpiThreshold'

export interface MachineManagementSortState {
  column: SortableColumn;
  state: SortState;
}

interface MachineManagementTableProps {
  data: OnboardingMachine[];
  isDataLoading?: boolean;
  headerBgColor?: string;
  onOpenActions?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, mtlId: string) => void;
}
const defaultSortState: Record<string, SortState> = {
  customer: SortState.ascending,
  description: SortState.unsorted,
  diagrams: SortState.unsorted,
  maintenanceSchedule: SortState.unsorted,
  provisionGateway: SortState.unsorted,
  tagList: SortState.unsorted
};
const MachineManagementTable = ({
  data,
  isDataLoading,
  headerBgColor,
  onOpenActions
}: MachineManagementTableProps): ReactElement => {
  const sortableData: OnboardingMachine[] = useMemo(() => {
    return data.map((row) => {
      return {
        ...row
      } as OnboardingMachine;
    });
  }, [data]);
  const theme = useTheme();
  const history = useHistory();

  const goTo = (onboardingMachine: OnboardingMachine) => {
    history.push({
      pathname: JBTRoutes.onboardingPage.replace(':machineId', onboardingMachine.id),
      state: {
        machineId: onboardingMachine.id,
        description: onboardingMachine.description,
        data: onboardingMachine
      }
    });
  };
  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);
  const sortedData = useSort<OnboardingMachine>(sortState, sortableData);

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
    <Root>
      <BaseTable
        alternatingRowColoring={false}
        columnConfigs={generateColumnConfigs({
          sortState,
          theme,
          goTo,
          onOpenActions
        })}
        data={sortedData}
        sortHandler={sortHandler}
        isDataLoading={isDataLoading}
        rowKey={(record: BaseType, index?: number) => `${(record as TableRow).id}-${index}`}
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

export default MachineManagementTable;
