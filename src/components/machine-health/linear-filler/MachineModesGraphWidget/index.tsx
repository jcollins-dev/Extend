// 3rd party libs
import React, { ReactElement } from 'react';
// components
import { KPICard, StateOverTimeCard, Typography } from 'components';
// data
import styled from 'styled-components';
import { NestedRow } from 'components/StateOverTimeCard';
import theme from 'themes';
// Hook
import { DataRenderer } from 'components/machine-health';

interface Props {
  title?: string;
  data: NestedRow[];
  intervalSpacing?: boolean;
  isLoading?: boolean;
  error?: string;
}
const MachineModesContainer = styled.div`
  > * {
    border: none;
    border-radius: 0;
  }
`;

const MachineModesGraphWidget = ({
  title,
  data,
  intervalSpacing = true,
  isLoading = false,
  error
}: Props): ReactElement => {
  const colors = {
    '0': theme.colors.asepticMachineUtilizationColors.idle,
    '1': theme.colors.asepticMachineUtilizationColors.maintenance,
    '2': theme.colors.asepticMachineUtilizationColors.productionUptime,
    '3': theme.colors.asepticMachineUtilizationColors.cleaning,
    '4': theme.colors.asepticMachineUtilizationColors.sterilization,
    '5': theme.colors.asepticMachineUtilizationColors.productionDowntime
  };

  const heading = title ? title : 'Machine Modes';

  return (
    <DataRenderer isLoading={isLoading}>
      <KPICard>
        <MachineModesContainer>
          {error && (
            <Typography color="negativeRed" style={{ marginLeft: '2rem', marginTop: '1.5rem' }}>
              {error}
            </Typography>
          )}
          <StateOverTimeCard
            subHeadingComponent={
              <Typography weight="bold" size="1rem" mb="1.25rem">
                {heading}
              </Typography>
            }
            title={''}
            nestedData={data}
            stateColors={colors}
            barCornerRadius={6}
            intervalSpacing={intervalSpacing ? 5 : 0}
            tickLabelPadding={30}
            chartPadding={{ top: 75, right: 30, bottom: 5, left: 150 }}
            hideStateCodes={true}
          />
        </MachineModesContainer>
      </KPICard>
    </DataRenderer>
  );
};

export default MachineModesGraphWidget;
