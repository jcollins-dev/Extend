// 3rd party
import React, { ReactElement } from 'react';
import styled, { useTheme } from 'styled-components';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';

// Components
import { Button, Modal } from 'components';

interface BubbleHelpModalProps {
  visible: boolean;
  handleClose: () => void;
}

const BubbleHelpContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.5rem 2rem;
`;

const BubbleHelpMessageContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 0.125rem;

  ol {
    list-style-position: outside;
    padding-left: 0;
    margin-top: 0;
    margin-left: 0.875rem;
  }

  li {
    margin-bottom: 0.25rem;
  }
`;

const BubbleHelpHeading = styled.div`
  font-size: 1rem;
  line-height: 1.1875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.gray900};
  margin-bottom: 0.5rem;
`;

const BubbleHelpMessageIcon = styled.div`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.buttonPrimary};
  margin-right: 0.875rem;
`;

const BubbleMessageActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.75rem;
`;

const BubbleHelpMessageContent = styled.div`
  & > * {
    margin-bottom: 0.5rem;
    padding-bottom: 0;
    font-weight: 400;
    color: ${(props) => props.theme.colors.darkGrey};
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
`;

const BubbleMessageAction = styled.div`
  width: 4.9375rem;
  height: 2.5rem;
`;

const BubbleHelpModal = ({ visible, handleClose }: BubbleHelpModalProps): ReactElement => {
  const theme = useTheme();

  return (
    <Modal visible={visible} size="xsmall_auto_height" showCloseButton={true} onClose={handleClose}>
      <BubbleHelpContainer>
        <BubbleHelpMessageContainer>
          <BubbleHelpMessageIcon>
            <FontAwesomeIcon fontSize="1.25rem" icon={faCircleQuestion} />
          </BubbleHelpMessageIcon>
          <BubbleHelpMessageContent>
            <BubbleHelpHeading>Add and Edit Bubbles</BubbleHelpHeading>
            <ol type="1">
              <li>{`Click "Turn on Edit mode" to enter edit mode.`}</li>
              <li>Click on an unidentified bubble on the diagram. A pop-up opens</li>
              <li>Enter the details for that bubble.</li>
              <li>{`To edit an existing bubble, simply click on a bubble that you've already added.`}</li>
            </ol>
          </BubbleHelpMessageContent>
        </BubbleHelpMessageContainer>
        <BubbleMessageActions>
          <BubbleMessageAction>
            <Button variant="primary" bgColor={theme.colors.mediumBlue} onClick={handleClose}>
              Got it
            </Button>
          </BubbleMessageAction>
        </BubbleMessageActions>
      </BubbleHelpContainer>
    </Modal>
  );
};

export default BubbleHelpModal;
