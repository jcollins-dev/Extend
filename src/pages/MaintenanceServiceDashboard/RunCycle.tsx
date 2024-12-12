// 3rd party libs
import React, { useEffect, useState } from 'react';
import { BaseMultiSelect, Loader, Typography } from 'components';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Machine } from 'types';
import { MaintenanceEvent } from 'types/maintenance';

// Api
import { useGetMachinesCurrentRunMetricQuery } from 'api';

import { skipToken } from '@reduxjs/toolkit/dist/query';

interface TProps {
  allEvents: MaintenanceEvent[] | null;
  machines?: Machine[];
}

const Container = styled.div`
  // padding: 1px;
  // display: inline-block;
  // margin-bottom: 1rem;
`;

const RunCycleContainer = styled.div`
  display: flex;
  align-items: baseline;
`;

export function RunCycle({ allEvents, machines }: TProps): JSX.Element {
  const [selectedMachineCurrentRunMetric, setSelectedMachineCurrentRunMetric] =
    useState<string>('');
  const [selectedMachineCurrentRunMetricValue, setSelectedMachineCurrentRunMetricValue] =
    useState<string>('');
  const [machinesForRunCycle, setMachinesForRunCycle] = useState<Machine[]>();
  const [machineuuids, setMachineuuids] = useState<string[]>();

  const { t } = useTranslation(['fpns']);

  const { data: machineCurrentRunMetric, isFetching } = useGetMachinesCurrentRunMetricQuery(
    machineuuids
      ? {
          machineUuids: machineuuids
        }
      : skipToken
  );

  useEffect(() => {
    const machinesInEvents = machines?.filter((machine) =>
      allEvents?.find((machineEvent) => machineEvent.machineId === machine.id)
    );

    if (machinesInEvents) {
      setMachinesForRunCycle(machinesInEvents);
      setMachineuuids(machinesInEvents?.map((machine) => machine.id));

      if (machinesInEvents.length == 1) {
        setCurrentRunMetric(machinesInEvents[0].id);
      } else {
        setSelectedMachineCurrentRunMetric('Cycle');
        setSelectedMachineCurrentRunMetricValue('');
      }
    }
  }, [allEvents, machineCurrentRunMetric]);

  const setCurrentRunMetric = (machineId: string) => {
    const currentRunMetric = machineCurrentRunMetric?.find(
      (machineWithRunMetric) => machineWithRunMetric.machineId === machineId
    );

    setSelectedMachineCurrentRunMetricValue(
      currentRunMetric?.runMetricValue ? `: ${currentRunMetric.runMetricValue}` : ': Not Found'
    )
    setSelectedMachineCurrentRunMetric(
      currentRunMetric?.runMetricLabel
        ? currentRunMetric.runMetricLabel.replace('run_', ' ')
        : 'Cycle'
    );
  };

  if (isFetching) {
    return <Loader />;
  }

  return (
    <Container>
      {machinesForRunCycle && machinesForRunCycle.length > 0 && (
        <RunCycleContainer>
          <Typography>{t('run_for', { item: selectedMachineCurrentRunMetric })} </Typography>&nbsp;
          {machinesForRunCycle && machinesForRunCycle.length == 1 && (
            <Typography>{machinesForRunCycle[0].description}</Typography>
          )}
          {machinesForRunCycle && machinesForRunCycle.length > 1 && (
            <BaseMultiSelect
              multi={false}
              handleChange={(value: string[]) => {
                setCurrentRunMetric(value[0]);
              }}
              options={
                machinesForRunCycle
                  ? machinesForRunCycle.map((m) => ({ value: m.id, label: m.description }))
                  : []
              }
            />
          )}
          <Typography>{selectedMachineCurrentRunMetricValue}</Typography>
        </RunCycleContainer>
      )}
    </Container>
  );
}
