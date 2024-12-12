// Third Party
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faFolderPlus,
  faPencil,
  faTrashCan,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';

// Components
import {
  BaseTable,
  Button,
  Input,
  Loader,
  Modal,
  SearchInput,
  Typography,
  WarningPrompt
} from 'components';
import { ButtonBar, TutorialButton } from 'components/machine-health';

// Types
import { BaseType, ColumnConfig, ModalSize, SortState } from 'types';
import { MachineClassUnit, MachineUnitClass } from 'types/protein';

// Theme
import theme from 'themes';

// API
import {
  useCreateMachineTagUnitClassMutation,
  useDeleteMachineTagUnitClassMutation,
  useGetMachineTagUnitClassesQuery,
  useUpdateMachineTagUnitClassMutation
} from 'api';

// Hooks
import { useSearch, useSort } from 'hooks';

// Constants
import { SEARCH_COOLDOWN } from 'constants/search';
import { tutorialPlaceholderStepsData } from 'constants/machineConfig';

// Styled Components
const Container = styled.div`
  flex-grow: 1;
  width: 100%;
  padding-left: 6rem;
  padding-right: 6rem;
  padding-bottom: 3rem;
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  width: 2.75rem;
  height: 2.75rem;
`;

const IconContainer = styled.div`
  display: flex;
  margin-bottom: 0;
`;

const StyledAddUnitButtonGroup = styled.div`
  align-items: center;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.mediumBlue};
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: ${(props) => props.theme.typography.components.tableHeader.size};
  font-weight: ${(props) => props.theme.typography.components.tableRowLight.weight};
  line-height: ${(props) => props.theme.typography.components.tableRowLight.lineHeight};
  padding: 0 0 0 1.25rem;
  transition: all 0.2s ease-in-out;
  width: fit-content;

  svg,
  span {
    transition: color 0.3s ease-in-out;
  }

  :hover {
    svg,
    span {
      color: ${({ theme }) => theme.colors.mediumBlue2};
      transition: color 0.3s ease-in-out;
    }
  }
`;

const StyledModalContent = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  gap: 1rem;
  padding: 0.25rem 3rem;
`;

const StyledLabel = styled.p`
  padding-left: 0.5rem;
`;

const StyledModalInputLabel = styled.p`
  margin-bottom: 0;
`;

const StyledModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  width: 100%;
`;

const WordBreak = styled.span`
  word-break: break-all;
`;

export const StyledModalInput = styled.input<{ isTitle?: boolean }>`
  border-radius: 0.5rem;
  border: ${({ theme }) => theme.colors.borders.border02.border};
  color: ${(props) => props.theme.colors.table.primary};
  flex-grow: 1;
  font-size: ${({ isTitle }) => isTitle && '1rem'};
  font-weight: ${({ isTitle }) => isTitle && 'bold'};
  height: ${({ isTitle }) => (isTitle ? '3rem' : '2.25rem')};
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  transition: all 0.2s ease-in-out;
  outline: 0.125rem solid transparent;

  &:hover,
  :active,
  :focus {
    border: 0.0625rem solid ${({ theme }) => theme.colors.mediumBlue};
    outline: 0.125rem solid ${({ theme }) => theme.colors.mediumBlue3};
  }
`;

const StyledColumn = styled.div<{ justify: 'start' | 'end' }>`
  display: flex;
  justify-content: ${({ justify }) => justify};
`;

const StyledSearchWrapper = styled.div`
  height: 2.625rem;
  width: 19.25rem;
`;

/* Initial states for searching */
const alarmListSearchByProps = ['name'];

// Instantiate sort state outside of the component
// otherwise we get an infinite loop in the useSort hook
// because the object is a different instance each time
const SORT_STATE = { name: SortState.ascending };

interface UnitClass extends BaseType {
  className: string;
  unitClassEMEA?: string;
  unitClassNA?: string;
}

type UnitClassTableEditableColumns = keyof Pick<UnitClass, 'unitClassEMEA' | 'unitClassNA'>;

export const EditField = (props: {
  unitClassName: string;
  columnId: UnitClassTableEditableColumns;
  displayValue: string;
  placeholder: string;
  currentlyEditingValue: MutableRefObject<string>;
}): JSX.Element => {
  const [value, setValue] = useState(props.displayValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    props.currentlyEditingValue.current = e.target.value;
  };

  return (
    <Input
      placeholder={props.placeholder}
      value={value}
      onChange={handleChange}
      borderRadius="0.5rem"
    />
  );
};

export const generateColumnConfigs = (
  editableRow: string,
  onEditIconClick: (unit: MachineUnitClass) => void,
  onConfirmButtonClick: (unit: MachineUnitClass) => void,
  onDeleteIconClick: (unit: MachineUnitClass) => void,
  onResetIconClick: () => void,
  currentlyEditingEmeaUnit: MutableRefObject<string>,
  currentlyEditingNaUnit: MutableRefObject<string>
): ColumnConfig[] => {
  return [
    {
      title: 'Class',
      dataIndex: 'name',
      key: 'name',
      render: (_, value) => {
        const { name } = value as MachineUnitClass;
        return (
          <StyledColumn justify="start">
            <WordBreak>{name}</WordBreak>
          </StyledColumn>
        );
      }
    },
    {
      title: 'EMEA',
      dataIndex: 'unitClassEMEA',
      key: 'unitClassEMEA',
      render: (_, value) => {
        const { id, units } = value as MachineUnitClass;
        const matchedUnit = units.find((unit) => unit.businessUnitId === 3);
        const displayValue = matchedUnit ? matchedUnit.unit : '--';

        return editableRow === id ? (
          <EditField
            unitClassName={id}
            columnId={'unitClassEMEA'}
            displayValue={displayValue}
            placeholder={'Localized Value'}
            currentlyEditingValue={currentlyEditingEmeaUnit}
          />
        ) : (
          <StyledColumn justify="start">
            <WordBreak>{displayValue}</WordBreak>
          </StyledColumn>
        );
      }
    },
    {
      title: 'NA',
      dataIndex: 'unitClassNA',
      key: 'unitClassNA',
      render: (_, value) => {
        const { id, units } = value as MachineUnitClass;
        const matchedUnit = units.find((unit) => unit.businessUnitId === 1);
        const displayValue = matchedUnit ? matchedUnit.unit : '--';

        return editableRow === id ? (
          <EditField
            unitClassName={id}
            columnId={'unitClassNA'}
            displayValue={displayValue}
            placeholder={'Localized Value'}
            currentlyEditingValue={currentlyEditingNaUnit}
          />
        ) : (
          <StyledColumn justify="start">
            <WordBreak>{displayValue}</WordBreak>
          </StyledColumn>
        );
      }
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, value) => {
        const unit = value as MachineUnitClass;
        return (
          <StyledColumn justify="end">
            {editableRow === unit?.id ? (
              <IconContainer>
                <IconButton onClick={() => onConfirmButtonClick(unit)}>
                  <FontAwesomeIcon
                    color={theme.colors.onTrackGreen}
                    style={{ fontSize: '1rem' }}
                    icon={faCheck}
                  />
                </IconButton>
                <IconButton onClick={() => onResetIconClick()}>
                  <FontAwesomeIcon
                    color={theme.colors.atRiskYellow}
                    style={{ fontSize: '1rem' }}
                    icon={faXmark}
                  />
                </IconButton>
              </IconContainer>
            ) : (
              <IconContainer>
                <IconButton onClick={() => onEditIconClick(unit)}>
                  <FontAwesomeIcon style={{ fontSize: '1rem' }} icon={faPencil} />
                </IconButton>
                <IconButton onClick={() => onDeleteIconClick(unit)}>
                  <FontAwesomeIcon style={{ fontSize: '1rem' }} icon={faTrashCan} />
                </IconButton>
              </IconContainer>
            )}
          </StyledColumn>
        );
      }
    }
  ];
};

const MachineConfigUnitClasses = (): JSX.Element => {
  // API Interactions
  const {
    data: machineUnitClasses,
    isFetching: isFetchingMachineTagUnitClasses,
    error: machineUnitClassesError
  } = useGetMachineTagUnitClassesQuery();

  const [deleteMachineTagUnitClass] = useDeleteMachineTagUnitClassMutation();
  const [updateMachineTagUnitClass] = useUpdateMachineTagUnitClassMutation();
  const [createMachineTagUnitClass] = useCreateMachineTagUnitClassMutation();

  // Local state for table interactions
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editableRow, setEditableRow] = useState('');
  const [lastSearchTime, setLastSearchTime] = useState<number>(Date.now());
  const [newUnitClass, setNewUnitClass] = useState('');
  const [newUnitClassEmeaUnit, setNewUnitClassEmeaUnit] = useState('');
  const [newUnitClassNaUnit, setNewUnitClassNaUnit] = useState('');
  const [searchVal, setSearchVal] = useState<string>('');
  const [showWarningPrompt, setShowWarningPrompt] = useState(false);
  const [unitClassToDelete, setUnitClassToDelete] = useState<MachineUnitClass | null>(null);

  const searchedUnitClasses = useSearch<MachineUnitClass>(
    searchVal,
    machineUnitClasses,
    alarmListSearchByProps
  );

  const sortedUnitClasses = useSort<MachineUnitClass>(SORT_STATE, searchedUnitClasses);

  const currentlyEditingEmeaUnit = useRef('');
  const currentlyEditingNaUnit = useRef('');

  const isFetching = isFetchingMachineTagUnitClasses;
  const hasError = machineUnitClassesError;
  const hasData = machineUnitClasses;

  // Event Handlers
  const onEditIconClick = (unit: MachineUnitClass) => {
    setEditableRow(unit?.id ?? '');

    const existingNaUnit = unit.units?.find((unit) => unit.businessUnitId === 3)?.unit ?? '';
    const existingEmeaUnit = unit.units?.find((unit) => unit.businessUnitId === 3)?.unit ?? '';

    // Reset states / refs
    setNewUnitClassEmeaUnit(existingNaUnit);
    setNewUnitClassNaUnit(existingEmeaUnit);
    currentlyEditingEmeaUnit.current =
      unit.units?.find((unit) => unit.businessUnitId === 3)?.unit ?? '';
    currentlyEditingNaUnit.current =
      unit.units?.find((unit) => unit.businessUnitId === 1)?.unit ?? '';
  };

  const onAddUnitClassClick = () => {
    // Close any open edit rows
    setEditableRow('');

    // Reset Refs
    currentlyEditingNaUnit.current = '';

    // Ensure input state is fresh
    setNewUnitClass('');
    setNewUnitClassEmeaUnit('');
    setNewUnitClassNaUnit('');
    currentlyEditingEmeaUnit.current = '';

    // Open modal
    setAddItemModalVisible(true);
  };

  const onResetEdit = () => {
    setEditableRow('');

    // Reset State
    setAddItemModalVisible(false);
    setNewUnitClass('');
    setNewUnitClassEmeaUnit('');
    setNewUnitClassNaUnit('');

    // Reset Refs
    currentlyEditingNaUnit.current = '';
    currentlyEditingEmeaUnit.current = '';
  };

  const onModalCancelButtonClick = () => {
    // Ensure input state is fresh
    setNewUnitClass('');
    setNewUnitClassEmeaUnit('');
    setNewUnitClassNaUnit('');

    // Close modal
    setAddItemModalVisible(false);
  };

  const onModalCreateButtonClick = () => {
    // Explicitly return if trying to create a unit class without a name
    if (!newUnitClass) return;

    const units: MachineClassUnit[] = [];
    if (newUnitClassEmeaUnit) {
      units.push({ businessUnitId: 3, unit: newUnitClassEmeaUnit });
    }
    if (newUnitClassNaUnit) {
      units.push({ businessUnitId: 1, unit: newUnitClassNaUnit });
    }

    createMachineTagUnitClass({ name: newUnitClass, units })
      .unwrap()
      .then((masterTagResponse) => {
        if (masterTagResponse) {
          toast.success('Created unit class!', {
            toastId: 'unit-class-created'
          });
        } else {
          toast('⚠️ There was a problem creating the unit class');
        }
      })
      .catch(async (err) => {
        console.error('Failed to create unit class list', err);
        toast('⚠️ There was a problem creating the unit class');
      });

    // Reset State
    setAddItemModalVisible(false);
    setNewUnitClass('');
    setNewUnitClassEmeaUnit('');
    setNewUnitClassNaUnit('');

    // Reset Refs
    currentlyEditingNaUnit.current = '';
    currentlyEditingEmeaUnit.current = '';
  };

  const onConfirmButtonClick = (unit: MachineUnitClass) => {
    setEditableRow('');

    // Explicitly reject mutations when data is not available
    if (!hasData) return;

    const matchedMachineUnitClass = unit;
    if (!matchedMachineUnitClass) return;

    const units: MachineClassUnit[] = [];
    if (currentlyEditingEmeaUnit.current) {
      units.push({ businessUnitId: 3, unit: currentlyEditingEmeaUnit.current });
    }
    if (currentlyEditingNaUnit.current) {
      units.push({ businessUnitId: 1, unit: currentlyEditingNaUnit.current });
    }

    updateMachineTagUnitClass({
      id: unit.id,
      name: unit.name,
      units
    })
      .unwrap()
      .then((masterTagResponse) => {
        if (masterTagResponse) {
          toast.success('Updated unit class!', {
            toastId: 'unit-class-updated'
          });
        } else {
          toast('⚠️ There was a problem updating the unit class');
        }
      })
      .catch(async (err) => {
        console.error('Failed to update unit class list', err);
        toast('⚠️ There was a problem updating the unit class');
      });

    // Reset refs
    currentlyEditingEmeaUnit.current = '';
    currentlyEditingNaUnit.current = '';
  };

  const onDeleteIconClick = (unit: MachineUnitClass) => {
    // prompt user to confirm delete
    setShowWarningPrompt(true);
    setUnitClassToDelete(unit);
  };

  useEffect(() => {
    if (confirmDelete && unitClassToDelete) {
      deleteMachineTagUnitClass(unitClassToDelete)
        .unwrap()
        .catch((err) => {
          console.error('Failed to delete machine tag unit class', err);
          toast('⚠️ There was a problem deleting the tag unit class');
        });

      // Reset refs
      currentlyEditingEmeaUnit.current = '';
      currentlyEditingNaUnit.current = '';
      setShowWarningPrompt(false);
      setConfirmDelete(false);
      setUnitClassToDelete(null);
    }
  }, [confirmDelete, unitClassToDelete]);

  // Update table columns based on user action
  const columnConfigs = useMemo(
    () =>
      generateColumnConfigs(
        editableRow,
        onEditIconClick,
        onConfirmButtonClick,
        onDeleteIconClick,
        onResetEdit,
        currentlyEditingEmeaUnit,
        currentlyEditingNaUnit
      ),
    [
      editableRow,
      onEditIconClick,
      onConfirmButtonClick,
      onDeleteIconClick,
      onResetEdit,
      currentlyEditingEmeaUnit,
      currentlyEditingNaUnit
    ]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const elapsedTimeSinceLastSearch = Date.now() - lastSearchTime;
    // if the search goes to 0, re-search the base query regardless of timing
    if (elapsedTimeSinceLastSearch > SEARCH_COOLDOWN || event.target.value.length === 0) {
      setSearchVal(event.target.value);
      setLastSearchTime(Date.now());
    }
  };

  if (hasError) {
    <Typography color="negativeRed">Failed to load data</Typography>;
  }

  if (isFetching) {
    return <Loader />;
  }

  return (
    <Container>
      <ButtonBar columnGap="1.5rem" title="" padding="1.375rem 0">
        <StyledSearchWrapper>
          <SearchInput
            borderRadius="0.625rem"
            placeholder="Search by Class"
            onChange={handleSearchChange}
            variant="white"
          />
        </StyledSearchWrapper>
        <TutorialButton stepsData={tutorialPlaceholderStepsData} />
      </ButtonBar>
      <BaseTable
        title="Unit Class"
        columnConfigs={columnConfigs}
        data={sortedUnitClasses}
        rowKey={(record: BaseType) => `${record.id}`}
        renderCustomFooter={() => {
          return (
            <StyledAddUnitButtonGroup onClick={() => onAddUnitClassClick()}>
              <FontAwesomeIcon icon={faFolderPlus} />
              <StyledLabel>Add Unit Class</StyledLabel>
            </StyledAddUnitButtonGroup>
          );
        }}
        renderCustomEmptyText={() => {
          return (
            <Typography
              color="darkGrey"
              weight="medium"
              style={{ marginLeft: '1.25rem', marginTop: '1.5rem' }}
            >
              No unit classes available.
            </Typography>
          );
        }}
      />
      <Modal
        size={ModalSize.SMALL}
        visible={addItemModalVisible}
        onClose={() => setAddItemModalVisible(false)}
        showCloseButton={false}
      >
        <StyledModalContent>
          <Typography variant="h2">Add New Unit Class</Typography>
          <StyledModalInputLabel>Class Name</StyledModalInputLabel>
          <StyledModalInput
            id="new-item-name"
            onChange={(e) => setNewUnitClass(e.target.value)}
            type="text"
            value={newUnitClass}
          />
          <StyledModalInputLabel>Emea Unit Name</StyledModalInputLabel>
          <StyledModalInput
            id="new-item-name"
            onChange={(e) => setNewUnitClassEmeaUnit(e.target.value)}
            type="text"
            value={newUnitClassEmeaUnit}
          />
          <StyledModalInputLabel>NA Unit Name</StyledModalInputLabel>
          <StyledModalInput
            id="new-item-name"
            onChange={(e) => setNewUnitClassNaUnit(e.target.value)}
            type="text"
            value={newUnitClassNaUnit}
          />
          <StyledModalButtonGroup>
            <Button width="auto" onClick={() => onModalCancelButtonClick()}>
              Cancel
            </Button>
            <Button
              disabled={!newUnitClass}
              onClick={() => onModalCreateButtonClick()}
              variant="primary"
              width="auto"
            >
              Create
            </Button>
          </StyledModalButtonGroup>
        </StyledModalContent>
      </Modal>
      <WarningPrompt
        helperText={`The Unit Class ${unitClassToDelete?.name} will be no longer available for the tags in machine health. Are you sure you want to delete it?`}
        isConfirmPrompt
        isVisible={showWarningPrompt}
        onCancelCallback={() => setShowWarningPrompt(false)}
        onConfirmCallback={() => setConfirmDelete(true)}
        title="Confirm Deletion"
      />
    </Container>
  );
};

export default MachineConfigUnitClasses;
