// 3rd party
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { toast } from 'react-toastify';

// Components
import { BaseTable, Button, Loader, Modal, SearchInput, Typography } from 'components';

// Hooks
import { useSearch, useSort } from 'hooks';

// API
import { useAddBubbleMutation, useUpdateBubbleMutation } from 'api';

// Types
import { Id, SortClickHandler, SortState } from 'types';
import { PreviousEditRecord } from 'types/machine-management';

// Utilities
import { defaultEditsSortState, editsColumnConfigs } from './utils';

interface BubbleEditsModalProps {
  visible: boolean;
  handleClose: (shouldRefresh?: boolean) => void;
  bubbleEdits?: PreviousEditRecord[];
}

const RootContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  flex-grow: 0;
  padding: 1.5rem 2rem;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: calc(100% - 3.75rem);
  flex-grow: 1;
  overflow-y: scroll;
  padding: 1.5rem 2rem;
`;

const Footer = styled.div`
  flex-grow: 0;
  width: 100%;
  height: 3.75rem;
  padding: 1.5rem 2rem;
  padding-right: 0.75rem;
  float: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: white;
  border-top: 0.0625rem solid ${(props) => props.theme.colors.lightMediumGrey};

  button {
    margin: 0 1rem;
    width: auto;
    height: 2.5rem;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 0.625rem;
`;

const propsToSearch = ['partDescription', 'oldSku', 'newSku', 'oldIndex', 'newIndex'];

const BubbleEditsModal = ({
  visible,
  handleClose,
  bubbleEdits
}: BubbleEditsModalProps): ReactElement => {
  const theme = useTheme();
  // API hooks
  const [addBubble] = useAddBubbleMutation();
  const [updateBubble] = useUpdateBubbleMutation();
  // State variables
  const [selectableEdits, setSelectableEdits] = useState<PreviousEditRecord[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultEditsSortState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchedEdits = useSearch<PreviousEditRecord>(searchValue, selectableEdits, propsToSearch);
  const sortedEdits = useSort<PreviousEditRecord>(sortState, searchedEdits);

  useEffect(() => {
    if (visible) {
      if (bubbleEdits) {
        setSelectableEdits(bubbleEdits.map((edit) => ({ ...edit, checked: false })));
      } else {
        setSelectableEdits([]);
        setIsLoading(false);
      }
    }
  }, [bubbleEdits, visible]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value);
  };

  const sortHandler: SortClickHandler = (key, currentSortState) => {
    const newSortState = {
      ...defaultEditsSortState,
      [key]:
        currentSortState === SortState.ascending
          ? SortState.descending
          : currentSortState === SortState.descending
          ? SortState.unsorted
          : SortState.ascending
    };
    setSortState(newSortState);
  };

  const handleRowCheck = (editId: Id, checked: boolean) => {
    setSelectableEdits(
      selectableEdits.map((edit) => {
        return {
          ...edit,
          checked: editId === 'all' || editId === edit.id ? checked : edit.checked
        };
      })
    );
  };

  const numChecked = selectableEdits.filter((edit) => edit.checked).length;
  const allChecked = numChecked === selectableEdits.length;

  const handleSubmit = async () => {
    setIsLoading(true);
    const checkedEdits = selectableEdits.filter((edit) => edit.checked);
    const successIds: Id[] = [];
    const errorIds: Id[] = [];
    for (const editToSubmit of checkedEdits) {
      // If it is a new bubble
      if (!editToSubmit.oldSku && !editToSubmit.oldIndex) {
        if (editToSubmit.newSku && editToSubmit.newIndex) {
          const response = await addBubble({
            index: editToSubmit.newIndex,
            x: editToSubmit.x,
            y: editToSubmit.y,
            radius: editToSubmit.radius,
            resourceId: editToSubmit.resourceId as Id,
            sku: editToSubmit.newSku,
            parentSku: editToSubmit.parentSku,
            machineId: editToSubmit.machineId
          });
          if (Object.hasOwn(response, 'error')) {
            errorIds.push(editToSubmit.id);
          } else {
            successIds.push(editToSubmit.id);
          }
        } else {
          errorIds.push(editToSubmit.id);
        }
      } else if (editToSubmit.bubbleId) {
        // For updated existing bubbles
        const response = await updateBubble({
          id: editToSubmit.bubbleId,
          index: editToSubmit.newIndex ? editToSubmit.newIndex : (editToSubmit.oldIndex as string),
          partSku: editToSubmit.newSku ? editToSubmit.newSku : (editToSubmit.oldSku as string),
          machineId: editToSubmit.machineId,
          radius: editToSubmit.radius
        });
        if (Object.hasOwn(response, 'error')) {
          errorIds.push(editToSubmit.id);
        } else {
          successIds.push(editToSubmit.id);
        }
      }
    }

    if (successIds.length > 0)
      toast.success(
        `${successIds.length} previous edit${successIds.length > 1 ? 's' : ''} applied.`
      );
    if (errorIds.length > 0)
      toast.error(`${errorIds.length} previous edit${errorIds.length > 1 ? 's' : ''} failed.`);

    // Set loading to false
    setIsLoading(false);
    // Close and trigger a refresh
    handleClose(true);
  };

  return (
    <Modal
      visible={visible}
      widthOverride="96%"
      showCloseButton={true}
      onClose={() => handleClose()}
    >
      <RootContainer>
        <Header>
          <Typography variant="h3">{`All Previous Edits (${selectableEdits.length})`}</Typography>
          <SearchContainer>
            <SearchInput
              variant="white"
              borderRadius="0.5rem"
              placeholder="Search previous edits"
              onChange={handleSearchChange}
              value={searchValue}
            />
          </SearchContainer>
        </Header>
        <ContentContainer>
          {isLoading ? (
            <Loader />
          ) : (
            <BaseTable
              columnConfigs={editsColumnConfigs(sortState, handleRowCheck, allChecked)}
              alternatingRowColoring={false}
              sortHandler={sortHandler}
              data={sortedEdits && sortedEdits.length > 0 ? sortedEdits : []}
              borderBottomRow
              outerBorderColor={theme.colors.lightGrey3}
              borderRadius="0.5rem"
            />
          )}
        </ContentContainer>
        <Footer>
          <Button disabled={false} variant="thin" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button
            bgColor={theme.colors.mediumBlue}
            variant="primary"
            disabled={numChecked === 0}
            onClick={async () => await handleSubmit()}
          >
            {allChecked
              ? 'Apply All Changes'
              : numChecked > 0
              ? `Apply Changes (${numChecked})`
              : 'Apply Changes'}
          </Button>
        </Footer>
      </RootContainer>
    </Modal>
  );
};

export default BubbleEditsModal;
