// 3rd party libs
import React, { useState } from 'react';
import styled from 'styled-components';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Components
import { RadioButton } from 'components';

// Types
import { KdmUnmappedMachineTagList, KdmUnmappedMasterTagList } from 'types/machine-management';
import { DigitalEdgeType } from 'types';
import { insertSpaces } from 'pages/MasterTagListDashBoard/MasterTagListTableHeader';
// Styling
interface RowProps {
  isHeader?: boolean;
  expanded?: boolean;
  isSuggested?: boolean;
}

const Row = styled.div<RowProps>`
  width: 100%;
  display: flex;
  height: ${(props) => (props.expanded ? 'auto' : '4.25rem')};
  min-height: 4.25rem;
  transition: height 0.5s;
  border-bottom: 0.0625rem solid ${(props) => props.theme.colors.lightGrey3};
  padding: 0.875rem 1rem;
  background-color: ${(props) =>
    !props.isHeader ? (props.isSuggested ? '#edf8f2' : 'white') : ''};

  &:last-child {
    border-bottom: none;
  }
`;

const LabelRow = styled(Row)`
  background-color: ${(props) => props.theme.colors.lightGrey2};
  height: 3.625rem;

  div {
    font-weight: 700;
  }
`;

const Cell = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 0.8125rem;
  line-height: 1.125rem;
  overflow: hidden;
  padding: 0 0.75rem;
`;

const ArrowCell = styled(Cell)`
  width: 2.625rem;
  svg {
    cursor: pointer;
  }
`;

const DetailsCell = styled(Cell)`
  width: 20.875rem;
  word-break: break-all;
`;

const ButtonCell = styled(Cell)`
  width: 3.8125rem;
`;

const SuggestedLabel = styled.p`
  margin-top: 0rem;
  color: #2bb881;
  font-weight: bold;
`;

interface MachineTagRowProps {
  isHeader?: boolean;
  machineTagDetails?: KdmUnmappedMachineTagList;
  masterTagDetails?: KdmUnmappedMasterTagList;
  machineTagOnSelect?: (selectedMachineTag: KdmUnmappedMachineTagList) => void;
  masterTagOnSelect?: (selectedMachineTag: KdmUnmappedMasterTagList) => void;
  digitalEdgeType?: DigitalEdgeType;
  selectedMachineTag?: KdmUnmappedMachineTagList;
  selectedMasterTag?: KdmUnmappedMasterTagList;
  machineToMaster?: boolean;
  isSuggestedTag?: boolean;
}

const MachineTagRow = ({
  isHeader,
  machineTagDetails,
  masterTagDetails,
  machineTagOnSelect,
  masterTagOnSelect,
  digitalEdgeType,
  selectedMachineTag,
  selectedMasterTag,
  machineToMaster,
  isSuggestedTag
}: MachineTagRowProps): JSX.Element => {
  const [expanded, setExpanded] = useState<boolean>(false);

  type MachineTagDigitalType = {
    [key: string]: string[];
  };

  const InsertSpacesToColumn = (column: string) => {
    return (
      insertSpaces(column).charAt(0).toLocaleUpperCase() +
      insertSpaces(column).substring(1, insertSpaces(column).length)
    );
  };

  const MachineTagsByDigitalEdgeId: MachineTagDigitalType = {
    KDM: machineToMaster ? ['masterTagName', 'description'] : ['plcTagName', 'description'],
    DSDM: machineToMaster
      ? ['sqlTableName', 'sqlColumnName', 'description']
      : ['tableName', 'indexColumn', 'description'],
    MQTT: machineToMaster
      ? ['topicName', 'masterTagName', 'description']
      : ['topicName', 'tagName', 'description']
  };

  const handleMachineTagsRadioButtonCheck = (
    unmappedMachineTag: KdmUnmappedMachineTagList | undefined
  ) => {
    machineTagOnSelect && unmappedMachineTag && machineTagOnSelect(unmappedMachineTag);
  };
  const handleMasterTagsRadioButtonCheck = (
    unmappedMasterTag: KdmUnmappedMasterTagList | undefined
  ) => {
    masterTagOnSelect && unmappedMasterTag && masterTagOnSelect(unmappedMasterTag);
  };
  const isSuggested = (isSuggested: boolean | undefined, index: number) => {
    return isSuggested && index === 0;
  };

  const row = isHeader ? (
    <LabelRow>
      <ArrowCell />
      {digitalEdgeType &&
        MachineTagsByDigitalEdgeId[digitalEdgeType].map((column, index) => {
          return <DetailsCell key={index}>{InsertSpacesToColumn(column)}</DetailsCell>;
        })}
      <ButtonCell />
    </LabelRow>
  ) : (
    <Row expanded={expanded} isSuggested={isSuggestedTag}>
      <ArrowCell>
        <FontAwesomeIcon
          icon={expanded ? faCaretDown : faCaretRight}
          fontSize="1.25rem"
          onClick={() => setExpanded(!expanded)}
        />
      </ArrowCell>
      {digitalEdgeType &&
        MachineTagsByDigitalEdgeId[digitalEdgeType].map((column, index) => {
          return (
            <DetailsCell key={index}>
              {machineTagDetails ? (
                isSuggested(machineTagDetails?.suggested, index) ? (
                  <div>
                    {machineTagDetails[column] as string}
                    <SuggestedLabel>{'(suggested)'}</SuggestedLabel>
                  </div>
                ) : (
                  (machineTagDetails[column] as string)
                )
              ) : masterTagDetails ? (
                isSuggested(masterTagDetails?.suggested, index) ? (
                  <div>
                    {masterTagDetails[column] as string}
                    <SuggestedLabel>{'(suggested)'}</SuggestedLabel>
                  </div>
                ) : (
                  (masterTagDetails[column] as string)
                )
              ) : (
                ''
              )}
            </DetailsCell>
          );
        })}
      <ButtonCell>
        <RadioButton
          onChange={
            !machineToMaster
              ? () => {
                  handleMachineTagsRadioButtonCheck(
                    machineTagDetails ? machineTagDetails : undefined
                  );
                }
              : () => {
                  handleMasterTagsRadioButtonCheck(masterTagDetails ? masterTagDetails : undefined);
                }
          }
          checked={
            !machineToMaster
              ? machineTagDetails?.id === selectedMachineTag?.id
              : masterTagDetails?.id === selectedMasterTag?.id
          }
        />
      </ButtonCell>
    </Row>
  );

  return row;
};

export default MachineTagRow;
