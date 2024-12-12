// 3rd party
import React, { Fragment, ReactElement, useState } from 'react';
import styled from 'styled-components';

// Types
import { BaseType, WithId, DigitalEdgeType } from 'types';
import {
  KdmUnmappedMachineTagList,
  KdmUnmappedMasterTagList,
  MasterTagListColumn,
  TagListRowStatus,
  UnmappedMachineTagList,
  WipTagListRowData
} from 'types/machine-management';

// Helpers
import theme from 'themes';
import { TagColumnData } from 'pages/MasterTagListDashBoard/MasterTagListDetailsTable';
import MasterTagListTableColumn from 'pages/MasterTagListDashBoard/MasterTagListTableHeader';
import UnmappedNewTagListRow from 'pages/MasterTagListDashBoard/UnmappedNewTagListRow';
import MachineTagFlyout from 'components/UnmappedMasterTagList/MachineTagFlyout';
import { useParams } from 'react-router-dom';

export type TableRow = SortableUnmappedMasterTagList;
/* End interfaces */

interface RowProps {
  selected?: boolean;
}
const MTLTableRow = styled.tr<RowProps>`
  border: 0.0625rem solid ${(props) => props.theme.colors.lightGrey1};
  border-collapse: collapse;
  width: auto;
  text-transform: capitalize;
  height: 3.625rem;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primaryBlue4 : theme.colors.white};
  &:hover {
    background-color: #f1f3f4;
  }
  cursor: pointer;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

interface TagTableProps {
  numColumns: number;
}
const TagTableSection = styled.table<TagTableProps>`
  border: 0.0625rem solid ${(props) => props.theme.colors.lightGrey1};
  border-collapse: collapse;
  height: auto;
  width: ${({ numColumns }) => 5.625 + 11.125 * (numColumns - 1)}rem;
`;

interface UnmappedMachineTagListProps {
  unmappedData?: UnmappedMachineTagList;
  isDataLoading?: boolean;
  headerBgColor?: string;
  digitalEdgeType?: DigitalEdgeType;
  tagListData?: WipTagListRowData[];
  updateRowData: (val: TagColumnData) => void;
  columnList?: MasterTagListColumn[] | undefined;
  assignMachineTag?: (
    machineTagId: KdmUnmappedMachineTagList,
    selectedRowData: WipTagListRowData
  ) => void;
  assignMasterTag?: (
    machineTagId: KdmUnmappedMasterTagList,
    selectedRowData: WipTagListRowData
  ) => void;
}

interface SortableUnmappedMasterTagList extends BaseType, WithId {
  masterTagName: string;
  machineTagName: string;
  omniBluTagName: string;
  description?: string;
  unitOfMeasure?: string;
  module?: string;
  function?: string;
  scope?: string;
  userBy?: string;
}

const UnmappedMachineTags = ({
  unmappedData,
  updateRowData,
  columnList,
  assignMachineTag,
  digitalEdgeType,
  assignMasterTag
}: UnmappedMachineTagListProps): ReactElement => {
  const { machineId } = useParams<{ machineId: string }>();
  const [tagMachineId, setTagMachineId] = useState<string | undefined>('');
  const [selectedCustomUnmappedMasterTagRow, setSelectedCustomUnmappedMasterTagRow] =
    useState<WipTagListRowData>();

  const handleRowClick = (rowData: WipTagListRowData) => {
    setTagMachineId(machineId);
    setSelectedCustomUnmappedMasterTagRow(rowData);
  };

  const handleFlyoutClose = () => {
    setTagMachineId(undefined);
  };
  type MachineTagDigitalType = {
    [key: string]: MachineTagColumnsType[];
  };
  type MachineTagColumnsType = {
    dataType: string;
    name: string;
    required: boolean;
  };
  const MachineTagsColumnsByDigitalEdgeId: MachineTagDigitalType = {
    MQTT: [
      {
        name: 'topicName',
        dataType: 'str',
        required: false
      },
      {
        name: 'tagName',
        dataType: 'str',
        required: true
      },
      {
        name: 'masterMqttTopic',
        dataType: 'str',
        required: false
      },
      {
        name: 'masterMqttTag',
        dataType: 'str',
        required: false
      },
      {
        name: 'description',
        dataType: 'str',
        required: true
      }
    ],
    KDM: [
      {
        name: 'plcTagName',
        dataType: 'str',
        required: true
      },
      {
        name: 'masterTagName',
        dataType: 'str',
        required: false
      },
      {
        name: 'plcTagAddress',
        dataType: 'str',
        required: false
      },
      {
        name: 'description',
        dataType: 'str',
        required: true
      },
      {
        name: 'dataType',
        dataType: 'str',
        required: true
      }
    ],
    DSDM: [
      {
        name: 'tableName',
        dataType: 'str',
        required: false
      },
      {
        name: 'indexColumn',
        dataType: 'str',
        required: false
      },
      {
        name: 'masterSqlTable',
        dataType: 'str',
        required: false
      },
      {
        name: 'masterSqlColumn',
        dataType: 'str',
        required: false
      },
      {
        name: 'description',
        dataType: 'str',
        required: false
      },
      {
        name: 'dataType',
        dataType: 'str',
        required: false
      },
      {
        name: 'isPrimaryKey',
        dataType: 'isPrimaryKey',
        required: false
      }
    ]
  };
  return (
    <Fragment>
      <TableContainer>
        <TagTableSection numColumns={columnList ? columnList.length : 0}>
          <MTLTableRow style={{ backgroundColor: theme.colors.lightGrey2 }}>
            <MasterTagListTableColumn
              columnList={MachineTagsColumnsByDigitalEdgeId[digitalEdgeType ? digitalEdgeType : '']}
            />
          </MTLTableRow>
          {unmappedData &&
            unmappedData.data &&
            unmappedData.data.map((row, index) => {
              const wipTagList: WipTagListRowData = {
                row: index,
                rowStatus: TagListRowStatus.Unmapped,
                data: row
              };
              return (
                <MTLTableRow
                  key={index}
                  selected={false}
                  onClick={() => handleRowClick(wipTagList)}
                >
                  <UnmappedNewTagListRow
                    columnList={
                      MachineTagsColumnsByDigitalEdgeId[digitalEdgeType ? digitalEdgeType : '']
                    }
                    updateRowData={updateRowData}
                    rowData={wipTagList}
                    isSelected={true}
                    showCheckBox={false}
                    disabledColumns={true}
                    machineToMaster={true}
                  />
                </MTLTableRow>
              );
            })}
        </TagTableSection>
        {tagMachineId && (
          <MachineTagFlyout
            machineId={tagMachineId}
            onClose={handleFlyoutClose}
            selectedRowData={selectedCustomUnmappedMasterTagRow}
            assignMachineTag={assignMachineTag}
            assignMasterTag={assignMasterTag}
            digitalEdgeType={digitalEdgeType}
            machineToMaster={true}
          />
        )}
      </TableContainer>
    </Fragment>
  );
};

export default UnmappedMachineTags;
