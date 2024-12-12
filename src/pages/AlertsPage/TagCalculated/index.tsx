import React, { useState } from 'react';
import Header from './Header';
import { MainSection } from './index.elements';
import CreateNewTag from './CreateNewTag';
import TagsTable from './TagsTable';
import { useFleetMachineAccountData } from 'pages/FleetMachineDetail/hooks';

const TagCalculated = (): JSX.Element => {
  const [isNewAlertToggle, setIsNewAlertToggle] = useState(false);
  const { machineId } = useFleetMachineAccountData();

  return (
    <>
      <div
        style={{
          margin: '0.5rem'
        }}
      >
        <Header setIsNewAlertToggle={setIsNewAlertToggle} />
        <MainSection>
          {isNewAlertToggle ? <CreateNewTag machineId={machineId} /> : null}
          <TagsTable />
        </MainSection>
      </div>
    </>
  );
};

export default TagCalculated;
