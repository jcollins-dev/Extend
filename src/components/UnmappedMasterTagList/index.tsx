// 3rd party
import React, { Fragment, ReactElement, useState } from 'react';
import styled from 'styled-components';

// Types
import { BaseType, WithId, DigitalEdgeType } from 'types';
import {
  KdmUnmappedMachineTagList,
  MasterTagListColumn,
  TagListRowStatus,
  UnmappedMasterTagListType,
  WipTagListRowData
} from 'types/machine-management';

// Helpers
import theme from 'themes';
import { TagColumnData } from 'pages/MasterTagListDashBoard/MasterTagListDetailsTable';
import MasterTagListTableColumn from 'pages/MasterTagListDashBoard/MasterTagListTableHeader';
import UnmappedNewTagListRow from 'pages/MasterTagListDashBoard/UnmappedNewTagListRow';
import MachineTagFlyout from './MachineTagFlyout';
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

interface UnmappedMasterTagListProps {
  unmappedData: UnmappedMasterTagListType;
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

const UnmappedMasterTagList = ({
  unmappedData,
  columnList,
  assignMachineTag,
  digitalEdgeType
}: UnmappedMasterTagListProps): ReactElement => {
  const { machineId } = useParams<{ machineId: string }>();
  const [tagMachineId, setTagMachineId] = useState<string | undefined>('');
  const [selectedUnmappedMasterTagRow, setSelectedUnmappedMasterTagRow] =
    useState<WipTagListRowData>();

  const handleRowClick = (rowData: WipTagListRowData) => {
    setTagMachineId(machineId);
    setSelectedUnmappedMasterTagRow(rowData);
  };

  const handleFlyoutClose = () => {
    setTagMachineId(undefined);
  };
  return (
    <Fragment>
      <TableContainer>
        <TagTableSection numColumns={columnList ? columnList.length : 0}>
          <MTLTableRow style={{ backgroundColor: theme.colors.lightGrey2 }}>
            <MasterTagListTableColumn columnList={columnList} />
          </MTLTableRow>
          {unmappedData &&
            unmappedData.data.map((row, index) => {
              const wipTagList: WipTagListRowData = {
                row: index,
                rowStatus: row?.machineTagName
                  ? TagListRowStatus.Mapped
                  : TagListRowStatus.Unmapped,
                data: row
              };
              return (
                <MTLTableRow
                  key={index}
                  selected={false}
                  onClick={() => {
                    handleRowClick(wipTagList);
                  }}
                >
                  <UnmappedNewTagListRow
                    columnList={columnList}
                    rowData={wipTagList}
                    isSelected={true}
                    showCheckBox={false}
                    disabledColumns={true}
                  />
                </MTLTableRow>
              );
            })}
        </TagTableSection>
        {tagMachineId && (
          <MachineTagFlyout
            machineId={tagMachineId}
            onClose={handleFlyoutClose}
            selectedRowData={selectedUnmappedMasterTagRow}
            assignMachineTag={assignMachineTag}
            digitalEdgeType={digitalEdgeType}
          />
        )}
      </TableContainer>
    </Fragment>
  );
};

export default UnmappedMasterTagList;
