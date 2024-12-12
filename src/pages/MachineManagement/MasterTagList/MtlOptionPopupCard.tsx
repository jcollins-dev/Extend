// 3rd party
import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import styled, { useTheme } from 'styled-components';

// Components
import { PopUpCard } from 'components';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faPencil } from '@fortawesome/free-solid-svg-icons';
import { faClock, faTrashCan } from '@fortawesome/free-regular-svg-icons';

// Types
import { MtlOption } from 'types/machine-management';

interface MtlOptionPopupCardProps {
  visible: boolean;
  mtlId: string;
  posX?: number;
  posY?: number;
  handleClose: () => void;
  handleOption: (optionType: MtlOption, mtlId: string) => void;
  baseRef?: React.MutableRefObject<HTMLDivElement | null>;
}

const InvisibleLayer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
`;

const MtlOptionsContainer = styled.div`
  height: auto;
  width: 100%;
`;

const MtlOptionItem = styled.div`
  width: 100%;
  height: 2.5rem;
  padding: 0.6875rem 0.875rem 0.6875rem 1rem;
  display: flex;
  border-bottom: 0.0625rem solid ${(props) => props.theme.colors.lightMediumGrey};
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.lightGrey1};
  }
`;

const MtlOptionLabel = styled.div`
  flex-grow: 1;
  font-weight: 500;
  font-size: 0.8125rem;
  line-height: 1.125rem;
  color: ${(props) => props.theme.colors.darkGrey};
`;

const MtlOptionIcon = styled.div`
  flex-grow: 0;
`;

const InvisibleInteractionLayer = ({
  onClose,
  posY
}: {
  onClose: () => void;
  posY: number;
}): React.ReactElement => {
  return ReactDOM.createPortal(
    <InvisibleLayer style={{ height: posY + 100 }} onClick={() => onClose()} />,
    document.body
  );
};

const MtlOptionsModal = ({
  visible,
  mtlId,
  posX,
  posY,
  handleClose,
  handleOption,
  baseRef
}: MtlOptionPopupCardProps): ReactElement => {
  const theme = useTheme();

  return (
    <>
      <InvisibleInteractionLayer onClose={handleClose} posY={posY ?? 0} />
      <PopUpCard
        show={visible}
        setShowFunction={handleClose}
        // Subtract 160 (i.e. almost the full 10rem width of this pop-up)
        positionX={posX ? posX - 140 : 0}
        positionY={posY ? posY : 0}
        widthRem={10}
        hideCloseButton={true}
        padChildren={false}
        baseRef={baseRef}
      >
        <MtlOptionsContainer>
          <MtlOptionItem
            role="button"
            onClick={() => {
              handleOption(MtlOption.Edit, mtlId);
            }}
          >
            <MtlOptionLabel>Edit</MtlOptionLabel>
            <MtlOptionIcon>
              <FontAwesomeIcon icon={faPencil} color={theme.colors.darkGrey} />
            </MtlOptionIcon>
          </MtlOptionItem>
          <MtlOptionItem
            role="button"
            onClick={() => {
              handleOption(MtlOption.Duplicate, mtlId);
            }}
          >
            <MtlOptionLabel>Duplicate</MtlOptionLabel>
            <MtlOptionIcon>
              <FontAwesomeIcon icon={faCopy} color={theme.colors.darkGrey} />
            </MtlOptionIcon>
          </MtlOptionItem>
          <MtlOptionItem
            role="button"
            onClick={() => {
              handleOption(MtlOption.Versions, mtlId);
            }}
          >
            <MtlOptionLabel>Version Histroy</MtlOptionLabel>
            <MtlOptionIcon>
              <FontAwesomeIcon icon={faClock} color={theme.colors.darkGrey} />
            </MtlOptionIcon>
          </MtlOptionItem>
          <MtlOptionItem
            role="button"
            onClick={() => {
              handleOption(MtlOption.Delete, mtlId);
            }}
          >
            <MtlOptionLabel style={{ color: theme.colors.negativeRed }}>Delete</MtlOptionLabel>
            <MtlOptionIcon>
              <FontAwesomeIcon icon={faTrashCan} color={theme.colors.negativeRed} />
            </MtlOptionIcon>
          </MtlOptionItem>
        </MtlOptionsContainer>
      </PopUpCard>
    </>
  );
};

export default MtlOptionsModal;
