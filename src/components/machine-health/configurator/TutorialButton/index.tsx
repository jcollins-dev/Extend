import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { v4 as uuidv4 } from 'uuid';

// Components
import { Button, Modal, Step, Stepper } from 'components';

// Types
import { ModalSize } from 'types';

interface TutorialProps {
  stepsData: {
    header: string;
    description: string;
    imgSrc: string;
  }[];
}

const TutorialButton = ({ stepsData }: TutorialProps): JSX.Element => {
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);

  return (
    <>
      <Button marginLeft="0" onClick={() => setTutorialModalOpen(true)} size="small" width="2rem">
        <FontAwesomeIcon fontSize="1.5rem" icon={faCircleQuestion} />
      </Button>
      <Modal
        onClose={() => setTutorialModalOpen(false)}
        showCloseButton={false}
        size={ModalSize.XSMALL_AUTO_HEIGHT}
        visible={tutorialModalOpen}
      >
        <Stepper
          onCancelCallback={() => setTutorialModalOpen(false)}
          steps={stepsData.map(({ description, header, imgSrc }) => (
            <Step description={description} header={header} imgSrc={imgSrc} key={uuidv4()} />
          ))}
        />
      </Modal>
    </>
  );
};

export default TutorialButton;
