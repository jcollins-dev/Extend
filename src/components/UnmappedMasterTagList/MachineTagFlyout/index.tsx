// 3rd party libs
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useState, useEffect } from 'react';

// Components
import { Flyout, FlyoutHeader, Loader, Button } from 'components';
import { default as VersionRow } from './MachineTagRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// API
import { useGetUnmappedMachineTagListQuery, useGetUnmappedMasterTagListQuery } from 'api';
import {
  KdmUnmappedMachineTagList,
  KdmUnmappedMasterTagList,
  MachineTagListMappingArgs,
  MasterTagListMappingArgs,
  UnmappedMachineTagList,
  UnmappedMasterTagListType,
  WipTagListRowData
} from 'types/machine-management';
import { DigitalEdgeType } from 'types';

// Styling
const OuterContainer = styled.div`
  width: 100%;
  height: auto;
  padding: 1.25rem;
  overflow-y: scroll;
`;
const VersionsContainer = styled.div`
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 0.0625rem solid ${(props) => props.theme.colors.lightGrey3};
`;

const ButtonsContainer = styled.div`
  width: 100%;
  padding-right: 0.75rem;
  float: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: white;
  border-top: 0.0625rem solid ${(props) => props.theme.colors.lightMediumGrey};

  button {
    margin: 1rem;
    width: auto;
  }
`;

const SearchBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2rem 2.625rem;
  gap: 0.5625rem;
  width: 100%;
  height: 2.5rem;
`;

const IconContainer = styled.div`
  display: flex;
  margin-bottom: 0;
`;

const SearchBox = styled.input`
  width: 100%;
  height: 2.5rem;
  font-size: 0.8125rem;
  border-radius: 0.5rem;
  border: 0.0625rem solid ${(props) => props.theme.colors.lightGrey4};
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  &:focus {
    outline-color: ${(props) => props.theme.colors.mediumBlue3};
  }
`;

interface Props {
  machineId?: string;
  onClose: () => void;
  selectedRowData: WipTagListRowData | undefined;
  assignMachineTag?: (
    machineTagId: KdmUnmappedMachineTagList,
    selectedRowData: WipTagListRowData
  ) => void;
  digitalEdgeType?: DigitalEdgeType;
  machineToMaster?: boolean;
  assignMasterTag?: (
    machineTagId: KdmUnmappedMasterTagList,
    selectedRowData: WipTagListRowData
  ) => void;
}
const MachineTagFlyout = ({
  machineId,
  onClose,
  selectedRowData,
  assignMachineTag,
  digitalEdgeType,
  machineToMaster,
  assignMasterTag
}: Props): JSX.Element => {
  const theme = useTheme();
  const [selectedMachineTag, setSelectedMachineTag] = useState<
    KdmUnmappedMachineTagList | undefined
  >();
  const [selectedMasterTag, setSelectedMasterTag] = useState<
    KdmUnmappedMasterTagList | undefined
  >();
  const [machineTagListData, setMachinetagListData] = useState<UnmappedMachineTagList>();
  const [masterTagListData, setMasterTagListData] = useState<UnmappedMasterTagListType>();
  const unmappedMachineTagPaylod: MachineTagListMappingArgs =
    digitalEdgeType == 'DSDM'
      ? {
          machineId: machineId,
          sqlTableName: selectedRowData?.data['sqlTableName'] as string,
          sqlColumnName: selectedRowData?.data['sqlColumnName'] as string
        }
      : digitalEdgeType == 'KDM'
      ? {
          machineId: machineId,
          masterTagName: selectedRowData?.data['masterTagName'] as string
        }
      : {
          machineId: machineId,
          masterTagName: selectedRowData?.data['masterTagName'] as string,
          topicName: selectedRowData?.data['topicName'] as string
        };
  const unmappedMasterTagPaylod: MasterTagListMappingArgs =
    digitalEdgeType == 'DSDM'
      ? {
          machineId: machineId,
          tableName: selectedRowData?.data['tableName'] as string,
          indexColumn: selectedRowData?.data['indexColumn'] as string
        }
      : digitalEdgeType == 'KDM'
      ? {
          machineId: machineId,
          tagName: selectedRowData?.data['plcTagName'] as string
        }
      : {
          machineId: machineId,
          tagName: selectedRowData?.data['tagName'] as string,
          topicName: selectedRowData?.data['topicName'] as string
        };
  const { data: unammppedMachineTags, isLoading: unammppedMachineTagsLoading } =
    useGetUnmappedMachineTagListQuery(unmappedMachineTagPaylod, {
      refetchOnMountOrArgChange: true
    });
  const { data: UnmappedMasterTagListData, isLoading: UnmappedMasterTagListDataLoading } =
    useGetUnmappedMasterTagListQuery(unmappedMasterTagPaylod, { refetchOnMountOrArgChange: true });
  const assignTagOnClick = (selectedRowData: WipTagListRowData | undefined) => {
    assignMachineTag &&
      selectedMachineTag &&
      selectedRowData &&
      assignMachineTag(selectedMachineTag, selectedRowData);
    onClose();
  };
  const assignMasterTagOnClick = (selectedRowData: WipTagListRowData | undefined) => {
    assignMasterTag &&
      selectedMasterTag &&
      selectedRowData &&
      assignMasterTag(selectedMasterTag, selectedRowData);
    onClose();
  };
  const machineTagOnSelect = (selectedMachineTag: KdmUnmappedMachineTagList) => {
    setSelectedMachineTag(selectedMachineTag);
  };
  const masterTagOnSelect = (selectedMasterTag: KdmUnmappedMasterTagList) => {
    setSelectedMasterTag(selectedMasterTag);
  };
  const updateMachineTagList = (machineTagList: UnmappedMachineTagList) => {
    setMachinetagListData(machineTagList);
  };
  const updateMasterTagList = (masterTagList: UnmappedMasterTagListType) => {
    setMasterTagListData(masterTagList);
  };
  useEffect(() => {
    unammppedMachineTags && setMachinetagListData(unammppedMachineTags);
    UnmappedMasterTagListData && setMasterTagListData(UnmappedMasterTagListData);
  }, [unammppedMachineTags, UnmappedMasterTagListData]);

  const handleSearchChange = (searchedValue: string) => {
    if (machineToMaster) {
      const filteredUnmappedMasterTagList = UnmappedMasterTagListData?.data?.filter((mtl) => {
        return (
          mtl.description?.toUpperCase().includes(searchedValue) ||
          mtl.masterTagName?.toUpperCase().includes(searchedValue) ||
          mtl.topicName?.toUpperCase().includes(searchedValue) ||
          mtl.sqlTableName?.toUpperCase().includes(searchedValue) ||
          mtl.sqlColumnName?.toUpperCase().includes(searchedValue)
        );
      });
      if (UnmappedMasterTagListData && filteredUnmappedMasterTagList) {
        updateMasterTagList({
          id: '',
          digitalEdgeType: UnmappedMasterTagListData.digitalEdgeType,
          data: filteredUnmappedMasterTagList
        });
      }
    } else {
      const filteredUnmappedMachineTagList = unammppedMachineTags?.data?.filter((mtl) => {
        return (
          mtl.description?.toUpperCase().includes(searchedValue) ||
          mtl.plcTagName?.toUpperCase().includes(searchedValue) ||
          mtl.topicName?.toUpperCase().includes(searchedValue) ||
          mtl.tableName?.toUpperCase().includes(searchedValue) ||
          mtl.indexColumn?.toUpperCase().includes(searchedValue)
        );
      });
      if (unammppedMachineTags && filteredUnmappedMachineTagList) {
        updateMachineTagList({
          id: '',
          digitalEdgeType: unammppedMachineTags?.digitalEdgeType,
          data: filteredUnmappedMachineTagList
        });
      }
    }
  };
  return (
    <Flyout width="33.125rem" visible={!!machineId} onClose={onClose}>
      <FlyoutHeader
        heading={machineToMaster ? 'Master tags' : 'Machine tags'}
        bgColor={theme.colors.lightGrey2}
        onClose={onClose}
      />
      <SearchBar>
        <IconContainer>
          <FontAwesomeIcon style={{ fontSize: '1rem', cursor: 'auto' }} icon={faSearch} />
        </IconContainer>
        <SearchBox
          type="text"
          placeholder="Search Tags..."
          onChange={(e) => {
            handleSearchChange(e.target.value.toLocaleUpperCase());
          }}
        />
      </SearchBar>
      {!machineToMaster
        ? unammppedMachineTagsLoading && !unammppedMachineTags && <Loader />
        : UnmappedMasterTagListDataLoading && !UnmappedMasterTagListData && <Loader />}
      {!machineToMaster
        ? unammppedMachineTags &&
          machineTagListData &&
          !unammppedMachineTagsLoading && (
            <OuterContainer>
              <VersionsContainer>
                <VersionRow isHeader={true} digitalEdgeType={digitalEdgeType} />
                {machineTagListData.data?.map((machineTag) => {
                  return (
                    <VersionRow
                      machineTagDetails={machineTag}
                      key={machineTag.id}
                      machineTagOnSelect={machineTagOnSelect}
                      digitalEdgeType={digitalEdgeType}
                      selectedMachineTag={selectedMachineTag}
                      isSuggestedTag={machineTag.suggested}
                    />
                  );
                })}
              </VersionsContainer>
            </OuterContainer>
          )
        : UnmappedMasterTagListData &&
          masterTagListData &&
          !UnmappedMasterTagListDataLoading && (
            <OuterContainer>
              <VersionsContainer>
                <VersionRow
                  isHeader={true}
                  digitalEdgeType={digitalEdgeType}
                  machineToMaster={machineToMaster}
                />
                {masterTagListData.data?.map((masterTag) => {
                  return (
                    <VersionRow
                      masterTagDetails={masterTag}
                      key={masterTag.id}
                      masterTagOnSelect={masterTagOnSelect}
                      digitalEdgeType={digitalEdgeType}
                      selectedMasterTag={selectedMasterTag}
                      machineToMaster={machineToMaster}
                      isSuggestedTag={masterTag.suggested}
                    />
                  );
                })}
              </VersionsContainer>
            </OuterContainer>
          )}
      <ButtonsContainer>
        <Button disabled={false} variant="thin" onClick={onClose}>
          Cancel
        </Button>
        <Button
          bgColor={theme.colors.mediumBlue}
          disabled={false}
          variant="primary"
          onClick={() => {
            machineToMaster
              ? assignMasterTagOnClick(selectedRowData)
              : assignTagOnClick(selectedRowData);
          }}
        >
          Assign Tag
        </Button>
      </ButtonsContainer>
    </Flyout>
  );
};

export default MachineTagFlyout;
