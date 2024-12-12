// 3rd party
import React, { ReactElement, useMemo, useState } from 'react';
import styled from 'styled-components';

// Components
import { Checkbox, BaseTable } from 'components';

// Types
import { ColumnConfig, SortClickHandler, SortState, BaseType, WithId } from 'types';
import { MasterTagList } from 'types/machine-management';
import { useSort } from 'hooks';

// Helpers
import { formatDate } from 'helpers';

export type TableRow = SortableMasterTagList;
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

// Generate the configurations for each column of this table
const generateColumnConfigs = (
  sortState: Record<string, SortState>,
  handleCheck: (checked: boolean, id: string) => void,
  selectedMasterTagList: string[]
): ColumnConfig[] => {
  return [
    {
      title: '',
      dataIndex: '',
      key: '',
      width: '3.75rem',
      render(value, record) {
        const data = record as SortableMasterTagList;
        return (
          <Checkbox
            id={data.id}
            checked={
              selectedMasterTagList.some((id) => id === data.id)
            }
            onChange={(e) => {
              handleCheck(e.target.checked, data.id);
            }}
          />
        );
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '14%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'name')
        ? sortState['name']
        : SortState.unsorted,
      render(value, record) {
        const data = record as SortableMasterTagList;
        return data.name;
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '14%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'description')
        ? sortState['description']
        : SortState.unsorted,
      render(value, record) {
        const data = record as SortableMasterTagList;
        return data.description;
      }
    },
    {
      title: 'BU',
      dataIndex: 'bu',
      key: 'bu',
      width: '12%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'bu')
        ? sortState['bu']
        : SortState.unsorted,
      render(value, record) {
        const data = record as SortableMasterTagList;
        return data.bu;
      }
    },
    {
      title: 'Machine',
      dataIndex: 'machine',
      key: 'machine',
      width: '12%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'machine')
        ? sortState['machine']
        : SortState.unsorted,
      render(value, record) {
        const data = record as SortableMasterTagList;
        return data.machine;
      }
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      width: '12%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'model')
        ? sortState['model']
        : SortState.unsorted,
      render(value, record) {
        const data = record as SortableMasterTagList;
        return data.model;
      }
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: '12%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'createdBy')
        ? sortState['createdBy']
        : SortState.unsorted,
      render(value, record) {
        const data = record as SortableMasterTagList;
        return data.createdBy;
      }
    },
    {
      title: 'Date Modified',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '12%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'updatedAt')
        ? sortState['updatedAt']
        : SortState.unsorted,
      render(value, record) {
        const data = record as SortableMasterTagList;
        return formatDate(data.updatedAt, 'short');
      }
    },
    {
      title: 'Versions',
      dataIndex: 'versions',
      key: 'versions',
      width: '12%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'versions')
        ? sortState['versions']
        : SortState.unsorted,
      render(value, record) {
        const data = record as SortableMasterTagList;
        return data.versions;
      }
    }
  ];
};

interface MasterTagListTableProps {
  data: MasterTagList[];
  isDataLoading?: boolean;
  headerBgColor?: string;
  onSelectMasterTagList?: (checked: boolean, id: string) => void;
  selectedMasterTagList: string[];
}

/* Initial states for sorting and filtering */
const defaultSortState: Record<string, SortState> = {
  name: SortState.unsorted,
  description: SortState.unsorted,
  bu: SortState.unsorted,
  machine: SortState.unsorted,
  model: SortState.unsorted,
  createdBy: SortState.unsorted,
  updatedAt: SortState.unsorted,
  versions: SortState.unsorted
};

interface SortableMasterTagList extends BaseType, WithId {
  name: string;
  description?: string;
  bu?: string;
  machine?: string;
  model?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  versions?: number;
  selected?: boolean;
}

const SelectedMasterTagListTable = ({
  data,
  isDataLoading,
  headerBgColor,
  onSelectMasterTagList,
  selectedMasterTagList
}: MasterTagListTableProps): ReactElement => {
  const sortableData: SortableMasterTagList[] = useMemo(() => {
    return data.map((mtl) => {
      return {
        bu: mtl.businessUnit?.name,
        machine: mtl.machineType?.name,
        model: mtl.machineModel?.name,
        ...mtl
      } as SortableMasterTagList;
    });
  }, [data]);

  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);
  const sortedData = useSort<SortableMasterTagList>(sortState, sortableData);

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

  const handleCheck = (selected: boolean, id: string) => {
    if (onSelectMasterTagList) {
      onSelectMasterTagList(selected, id);
    }
  };
  return (
    <Root>
      <BaseTable
        alternatingRowColoring={false}
        columnConfigs={generateColumnConfigs(sortState, handleCheck, selectedMasterTagList)}
        data={sortedData}
        sortHandler={sortHandler}
        isDataLoading={isDataLoading}
        rowKey={(record: BaseType, index?: number) =>
          `${(record as SortableMasterTagList).id}-${index}`
        }
        borderBottomRow
        bodyRowComponent={BodyRowContainer}
        headerBgColor={headerBgColor}
      />
    </Root>
  );
};

export default SelectedMasterTagListTable;
