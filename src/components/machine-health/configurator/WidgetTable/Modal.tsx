// 3rd party libraries
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Components
import { Button, Modal } from 'components';
import { StyledTableForm, StyledTableInput } from './Form';
import { Dropdown } from './Dropdown';

//Context
import { useWidgetTableContext } from './WidgetTableContext';
import { CreateNewWidgetItemProps, WidgetTableDropdownItem } from 'types/machine-health';

// Types
import { ModalSize } from 'types';
import { WidgetType } from 'types/protein';

// Styled components
const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  gap: 1rem;
  padding: 0.25rem 3rem;
`;

const StyledLabel = styled.label``;

const StyledInputGroup = styled.div`
  align-items: center;
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  width: 100%;
`;

interface TableModalProps {
  hideFields: {
    [key: string]: boolean;
  };
  modalType: WidgetType;
  options?: WidgetTableDropdownItem[];
  parentId?: string;
  submitCallback?: ({ value, widgetType, tabId, isTag }: CreateNewWidgetItemProps) => void;
  tabId: string;
}

const TableModal = ({
  hideFields,
  modalType,
  options,
  submitCallback,
  tabId
}: TableModalProps): JSX.Element => {
  const {
    isModalOpenById,
    modalTitle,
    setIsModalOpenById,
    setModalTitle,
    setTagGroupParentId,
    tagGroupParentId
  } = useWidgetTableContext();
  const [isDisabled, setIsDisabled] = useState<{ [key: string]: boolean }>({});
  const [widgetType, setWidgetType] = useState<WidgetTableDropdownItem | undefined>();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!hideFields.name) {
      setIsDisabled((prev) => ({
        ...prev,
        name: value ? false : true
      }));
    } else {
      setIsDisabled((prev) => ({
        ...prev,
        name: false
      }));
    }

    if (!hideFields.type) {
      setIsDisabled((prev) => ({
        ...prev,
        type: widgetType ? false : true
      }));
    } else {
      setIsDisabled((prev) => ({
        ...prev,
        type: false
      }));
    }
  }, [hideFields, value, widgetType]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCancel(null);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const clearModalState = () => {
    setIsModalOpenById(null);
    setModalTitle('');
    setValue('');
    setWidgetType(undefined);
    setTagGroupParentId(undefined);
  };

  const handleSubmit = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
      | null
  ) => {
    e?.preventDefault();
    submitCallback?.({
      isTag: false,
      parentId: tagGroupParentId,
      tabId,
      value: value || '',
      widgetType:
        modalType === WidgetType.TagGroupRow ? WidgetType.TagGroup : WidgetType.MatrixWidget
    });
    clearModalState();
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null) => {
    e?.preventDefault();
    clearModalState();
  };

  return (
    <Modal
      onClose={() => setIsModalOpenById(null)}
      showCloseButton={false}
      size={ModalSize.SMALL}
      title={modalTitle}
      visible={isModalOpenById === tabId}
    >
      <StyledContent>
        <StyledTableForm isVertical>
          {!hideFields.name && (
            <StyledInputGroup>
              <StyledLabel htmlFor="new-item-name">Name</StyledLabel>
              <StyledTableInput
                id="new-item-name"
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(e)}
                type="text"
                value={value}
              />
            </StyledInputGroup>
          )}
          {!hideFields.type && (options?.length || 0) > 0 && (
            <StyledInputGroup>
              <StyledLabel htmlFor="new-item-type">Type</StyledLabel>

              <Dropdown
                onChangeCallback={setWidgetType}
                options={options as WidgetTableDropdownItem[]}
              />
            </StyledInputGroup>
          )}
          <StyledButtonGroup>
            <Button
              width="auto"
              onClick={(e) => handleCancel(e)}
              onKeyDown={(e) => handleKeyDown(e)}
            >
              Cancel
            </Button>
            <Button
              disabled={Object.values(isDisabled).some((v) => v)}
              onClick={handleSubmit}
              onKeyDown={(e) => handleSubmit(e)}
              variant="primary"
              width="auto"
            >
              Create
            </Button>
          </StyledButtonGroup>
        </StyledTableForm>
      </StyledContent>
    </Modal>
  );
};

export default TableModal;
