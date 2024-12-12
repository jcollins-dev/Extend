// 3rd party
import React, { ReactElement, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';

// Components
import { Button, Input, Modal, TextInputWithOptions } from 'components';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

// Types
import { Bubble, ChangeEvent } from 'types';
import { Part } from 'types/parts';
import { EditedBubbleRecord } from 'types/machine-management';

interface EditBubbleModalProps {
  visible: boolean;
  handleClose: () => void;
  handleSubmit: (bubble: Bubble, partSku: string) => void;
  availableSkus?: Set<string>;
  selectedBubble?: Bubble;
  selectedPart?: Part;
  bubbleEdit?: EditedBubbleRecord;
}

const EditBubbleContainer = styled.div`
  height: auto;
  width: 100%;
`;

const EditBubbleHeader = styled.div`
  border-bottom: 0.0625rem solid ${(props) => props.theme.colors.lightMediumGrey};
  padding: 0.625rem;
  height: 3.125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.black};
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1rem;
  text-align: center;
  background-color: ${(props) => props.theme.colors.lightGrey1};
`;

const EditBubbleBody = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
`;

const EditBubbleMessageContainer = styled.div`
  width: 100%;

  & > input {
    margin-bottom: 1.25rem;
  }

  & > div {
    margin-bottom: 1.25rem;
  }
`;

const EditBubbleMessageContent = styled.div`
  color: ${(props) => props.theme.colors.darkGrey};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 400;
`;

const BubbleInput = styled(Input)`
  width: 100%;
`;

const BubbleMessageActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BubbleMessageAction = styled.div`
  width: 8.375rem;
  height: 2.5rem;
`;

const EditContainer = styled.div`
  width: 100%;
  height: 3.25rem;
  padding: 0.5rem 1rem;
  border: 0.0625rem solid #d0d5dd;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
`;

const EditIcon = styled.div`
  margin-right: 0.875rem;
`;

const EditContent = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const EditLabel = styled.div`
  flex-grow: 1;
  margin-right: 0.875rem;
`;

const EditAction = styled.div`
  flex-shrink: 0;
`;

const EditBubbleModal = ({
  visible,
  handleClose,
  handleSubmit,
  availableSkus,
  selectedBubble,
  selectedPart,
  bubbleEdit
}: EditBubbleModalProps): ReactElement => {
  const theme = useTheme();
  const [bubbleLabel, setBubbleLabel] = useState<string>('');
  const [partSku, setPartSku] = useState<string>('');
  const [bubbleRadius, setBubbleRadius] = useState<number>(40);

  // Context helper variables
  const isBubblePreviouslyAddedByUser =
    selectedBubble && !selectedBubble.id.includes('edit-') ? false : true;

  const isNewBubble = isBubblePreviouslyAddedByUser
    ? true
    : selectedBubble && !selectedBubble.index;

  const handleCloseIntercept = () => {
    setBubbleLabel('');
    setPartSku('');
    setBubbleRadius(40);
    handleClose();
  };

  const handleSubmitIntercept = () => {
    if (selectedBubble)
      handleSubmit(
        {
          ...selectedBubble,
          id: isBubblePreviouslyAddedByUser ? '' : selectedBubble.id,
          index: bubbleLabel,
          radius: bubbleRadius ? bubbleRadius : selectedBubble.radius
        },
        partSku
      );
    handleCloseIntercept();
  };

  useEffect(() => {
    if (selectedPart?.sku && !isBubblePreviouslyAddedByUser) {
      setPartSku(selectedPart?.sku);
    } else {
      setPartSku('');
    }
  }, [selectedPart]);

  useEffect(() => {
    if (selectedBubble && !isBubblePreviouslyAddedByUser) {
      setBubbleLabel(selectedBubble.index);
    } else {
      setBubbleLabel('');
    }
  }, [selectedBubble]);

  useEffect(() => {
    if (selectedBubble && selectedBubble.radius > 0) {
      setBubbleRadius(selectedBubble.radius);
    } else {
      setBubbleRadius(40);
    }
  }, [selectedBubble]);

  return (
    <Modal
      visible={visible}
      size="xsmall_auto_height"
      showCloseButton={false}
      onClose={handleClose}
      widthOverride="20.5rem"
      allowContentScroll={false}
    >
      <EditBubbleContainer>
        <EditBubbleHeader>{isNewBubble ? 'Add Missing Bubble' : 'Edit Bubble'}</EditBubbleHeader>
        <EditBubbleBody>
          <EditBubbleMessageContainer>
            <EditBubbleMessageContent>
              {`${isNewBubble ? 'Enter' : 'Edit'} the item name and part number below${
                isNewBubble ? ' to add a bubble to the diagram' : ''
              }:`}
            </EditBubbleMessageContent>
            {bubbleEdit &&
              bubbleEdit.newIndex &&
              (isNewBubble || selectedBubble?.index !== bubbleEdit.newIndex) && (
                <>
                  <EditContainer>
                    <EditIcon>
                      <FontAwesomeIcon icon={faExclamationCircle} fontSize="1rem" />
                    </EditIcon>
                    <EditContent>
                      <EditLabel>
                        <EditBubbleMessageContent>
                          Previous label <b>{bubbleEdit.newIndex}</b>
                        </EditBubbleMessageContent>
                      </EditLabel>
                      <EditAction>
                        <Button
                          variant="inline-link"
                          onClick={() => {
                            if (bubbleEdit.newIndex) setBubbleLabel(bubbleEdit.newIndex);
                          }}
                        >
                          Use Last Edit
                        </Button>
                      </EditAction>
                    </EditContent>
                  </EditContainer>
                </>
              )}
            <BubbleInput
              variant="white"
              placeholder="Bubble label"
              width="100%"
              value={bubbleLabel}
              onChange={(event: ChangeEvent) => {
                const updatedBubbleLabel = event.target.value as string;
                setBubbleLabel(updatedBubbleLabel);
              }}
            />
            {bubbleEdit &&
              bubbleEdit.newSku &&
              (isNewBubble || selectedPart?.sku !== bubbleEdit.newSku) && (
                <>
                  <EditContainer>
                    <EditIcon>
                      <FontAwesomeIcon icon={faExclamationCircle} fontSize="1rem" />
                    </EditIcon>
                    <EditContent>
                      <EditLabel>
                        <EditBubbleMessageContent>
                          Previous part number <b>{bubbleEdit.newSku}</b>
                        </EditBubbleMessageContent>
                      </EditLabel>
                      <EditAction>
                        <Button
                          variant="inline-link"
                          onClick={() => {
                            if (bubbleEdit.newSku) setPartSku(bubbleEdit.newSku);
                          }}
                        >
                          Use Last Edit
                        </Button>
                      </EditAction>
                    </EditContent>
                  </EditContainer>
                </>
              )}
            <TextInputWithOptions
              elementId="edit-bubble-sku-input"
              value={partSku ? partSku : ''}
              onValueChange={(newValue) => {
                if (newValue) setPartSku(newValue);
                else setPartSku('');
              }}
              placeholder="Part number"
              options={availableSkus ? Array.from(availableSkus) : []}
            />
            <BubbleInput
              variant="white"
              placeholder="Radius (e.g., 40)"
              width="100%"
              type="number"
              min="10"
              value={bubbleRadius}
              onChange={(event: ChangeEvent) => {
                const updatedRadius = parseFloat(event.target.value);
                if (updatedRadius >= 10) setBubbleRadius(updatedRadius);
              }}
            />
          </EditBubbleMessageContainer>
          <BubbleMessageActions>
            <BubbleMessageAction>
              <Button
                variant="secondary"
                bgColor={theme.colors.documentationGrey}
                onClick={handleCloseIntercept}
              >
                Cancel
              </Button>
            </BubbleMessageAction>
            <BubbleMessageAction>
              <Button
                disabled={!bubbleLabel || !partSku || !bubbleRadius}
                variant="primary"
                bgColor={theme.colors.mediumBlue}
                onClick={handleSubmitIntercept}
              >
                {isNewBubble ? 'Add Bubble' : 'Update Bubble'}
                {isNewBubble && <FontAwesomeIcon fontSize="1rem" icon={faPlus} />}
              </Button>
            </BubbleMessageAction>
          </BubbleMessageActions>
        </EditBubbleBody>
      </EditBubbleContainer>
    </Modal>
  );
};

export default EditBubbleModal;
