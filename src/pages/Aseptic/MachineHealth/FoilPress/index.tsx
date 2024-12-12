// 3rd party libs
import React, { ReactElement } from 'react';
import styled from 'styled-components';
// Components
import { KPIPanel, Column, Row, Loader } from 'components';
import { MachineVisionKpiItem } from 'types/machine-vision';
import { VictoryLine } from 'victory';
// Themes
import theme from 'themes';
// Hooks
import useMachineHealthKpi from 'hooks/useMachineHealthKpi';
import { AsepticMachineHealthInterval, AsepticMachineHealthType } from 'types/machine-health';
import { isEmpty } from 'lodash';
// Styling
const Container = styled.div`
  width: 100%;
  padding: 1.5rem 3.125rem 0 3.125rem;
  margin-top: 2rem;
`;
const FoilPress = (): ReactElement => {
  // TODO once the API is ready :

  const {
    machineHealth: resultFoil,
    isLoading: isLoadingFoil,
    error
  } = useMachineHealthKpi(
    AsepticMachineHealthType.Foil,
    AsepticMachineHealthInterval.Last8Hours,
    true
  );
  // Then replace AsepticFoilPressMockData per resultFoil if it's the same API as machine health

  // Target throughput rate
  const targetRate = (throughput: MachineVisionKpiItem) => {
    const { values } = throughput;
    if (isEmpty(values)) return <div />;

    const start = new Date(values[0].timestamp);
    const end = new Date(values[values.length - 1].endTimestamp);
    return (
      <VictoryLine
        style={{
          data: { stroke: theme.colors.negativeRed, strokeDasharray: '10, 10' }
        }}
        data={[
          { x: start, y: throughput.target },
          { x: end, y: throughput.target }
        ]}
      />
    );
  };
  return (
    <Container>
      <Row>
        <Column size={6}>
          {isLoadingFoil ? (
            <Loader />
          ) : (
            <KPIPanel
              isLoading={isLoadingFoil}
              isError={error as boolean}
              KPIData={(resultFoil ? resultFoil[0] : {}) as MachineVisionKpiItem}
              showxAxis={true}
              roundAxisFormat={true}
              custom={targetRate((resultFoil ? resultFoil[0] : {}) as MachineVisionKpiItem)}
            />
          )}
        </Column>
        {
          <Column size={6}>
            {isLoadingFoil ? (
              <Loader />
            ) : (
              <KPIPanel
                isLoading={isLoadingFoil}
                isError={error as boolean}
                KPIData={(resultFoil ? resultFoil[1] : {}) as MachineVisionKpiItem}
                custom={targetRate((resultFoil ? resultFoil[1] : {}) as MachineVisionKpiItem)}
              />
            )}
          </Column>
        }
      </Row>
      <Row>
        {
          <Column size={6}>
            {isLoadingFoil ? (
              <Loader />
            ) : (
              <KPIPanel
                isLoading={isLoadingFoil}
                isError={error as boolean}
                KPIData={(resultFoil ? resultFoil[2] : {}) as MachineVisionKpiItem}
                showxAxis={true}
                roundAxisFormat={false}
                custom={targetRate((resultFoil ? resultFoil[2] : {}) as MachineVisionKpiItem)}
              />
            )}
          </Column>
        }
        <Column size={6}>
          {isLoadingFoil ? (
            <Loader />
          ) : (
            <KPIPanel
              isLoading={isLoadingFoil}
              isError={error as boolean}
              KPIData={(resultFoil ? resultFoil[3] : {}) as MachineVisionKpiItem}
              showxAxis={true}
              roundAxisFormat={false}
              custom={targetRate((resultFoil ? resultFoil[3] : {}) as MachineVisionKpiItem)}
            />
          )}
        </Column>
      </Row>
    </Container>
  );
};

export default FoilPress;
