// 3rd party
import React from 'react';
import styled from 'styled-components';

// API
import { useGetMachineAssetsQuery } from 'api';

// Components
import { CatalogCard, Loader } from 'components';

// Routes
import { JBTRoutes } from 'constants/routes';

// Helpers
import getMachinePlaceholderImage from 'helpers/image';

// Types
import { Machine, ResourceType } from 'types';

const Card = styled.div`
  width: 100%;
`;

interface MachineCardProps {
  machine: Machine;
}

const MachineCard = ({ machine }: MachineCardProps): React.ReactElement => {
  const {
    data: machineImages,
    //error: machineError,
    isLoading: machineAssetsLoading
  } = useGetMachineAssetsQuery({
    machineId: machine.id,
    assetType: ResourceType.MachineImage
  });

  return (
    <Card>
      {machineImages ? (
        <CatalogCard
          name={machine.description}
          link={JBTRoutes.partsMachine.replace(':machineId', machine.id.toString())}
          img={machineImages.length > 0 ? machineImages[0].url : getMachinePlaceholderImage()}
        />
      ) : machineAssetsLoading ? (
        <Loader />
      ) : (
        // Load placeholder if no assets for the machine found.
        <CatalogCard
          name={machine.description}
          link={JBTRoutes.partsMachine.replace(':machineId', machine.id.toString())}
          img={getMachinePlaceholderImage()}
        />
      )}
    </Card>
  );
};

export default MachineCard;
