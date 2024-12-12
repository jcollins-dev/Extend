// 3rd party libs
import React, { useMemo } from 'react';
import { useTheme } from 'styled-components';

// Components
import { StateOverTimeCard } from 'components';

// Types
import { NestedRow } from 'components/StateOverTimeCard';
import { CleaningState } from 'types/protein';

interface Props {
  data: CleaningState[];
}

const CleaningStateChart = ({ data }: Props): JSX.Element => {
  // Map cleaning state codes to colors
  const colorMap = useTheme().colors.proteinMachineStateColors as { [key: string]: string };

  // Format API response data to match the format StateOverTimeCard expects
  const nestedData = useMemo(
    () => [
      {
        id: 0,
        label: 'Cleaning State',
        parentProperty: 'cleaning-states',
        data
      } as NestedRow
    ],
    [data]
  );

  return (
    <StateOverTimeCard
      title="Cleaning State Categories"
      nestedData={nestedData}
      stateColors={colorMap}
    />
  );
};

export default CleaningStateChart;
