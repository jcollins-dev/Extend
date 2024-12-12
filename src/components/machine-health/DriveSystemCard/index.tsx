// 3rd party libs
import React from 'react';
import styled, { useTheme } from 'styled-components';

// Component
import { KPICard } from 'components';
import { DataRenderer } from 'components/machine-health';
import TwoColumnCard from 'components/KPICard/TwoColumnCard';

// API
import { useGetDriveSystemStatesLatestQuery } from 'api';

// Types
import { ProteinMachineState } from 'types/protein';

interface Props {
  machineId: string;
}

const StyledKPICard = styled((props) => <KPICard {...props} />)`
  height: 100%;
`;

const DriveSystemCard = ({ machineId }: Props): JSX.Element => {
  const colorMap = useTheme().colors.proteinMachineStateColors;

  const { data, isLoading, error } = useGetDriveSystemStatesLatestQuery(
    { machineId },
    { pollingInterval: 30000 }
  );

  // We are only using one value at the moment, but this will be multiple values soon,
  // so we use TwoColumnCard for consistency with PP page.
  const formattedData = data
    ? [
        {
          unit: 'Drive System',
          key: 'driveSystem',
          value: `${data.stateName} (${data.stateCode})`,
          color: colorMap[data.stateCode as ProteinMachineState]
        }
      ]
    : [];

  return (
    <StyledKPICard heading="Drive System Overview">
      <DataRenderer isLoading={isLoading} error={error && 'Failed to load data'}>
        {formattedData && <TwoColumnCard values={formattedData} />}
      </DataRenderer>
    </StyledKPICard>
  );
};

export default DriveSystemCard;
