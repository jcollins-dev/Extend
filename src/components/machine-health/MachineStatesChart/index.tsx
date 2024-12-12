// 3rd party libs
import React from 'react';
import styled from 'styled-components';

// Components
import { StateOverTimeCard } from 'components';
import { NestedRow } from 'components/StateOverTimeCard';

// Theme
import theme from 'themes';

// Types
import { BaseTag, BaseTagStateValue } from 'types/protein';

// Providers
import { useSyncZoom } from 'providers';

// Constants
import { NO_SELECTION } from 'constants/machineTags';

// Styling
const Graph = styled.div`
  width: 100%;
  flex: 1;
  margin: auto;
`;

type Props = {
  hideSubStepIds?: boolean;
  title: string;
  states: BaseTag[] | undefined;
  isStringTagChart?: boolean;
};

const toNestedData = (states: BaseTag[], isStringTagChart: boolean): NestedRow[] => {
  if (!states?.length) {
    return [];
  }

  if (isStringTagChart) {
    const visitedCodes = new Map();

    return states?.map((state, idx) => ({
      id: idx,
      label: state.name || state.id,
      parentProperty: state.name || state.id,
      data: (state.values as BaseTagStateValue[]).map((value, i) => {
        // Assign numerical codes to string tags since they do not come with any
        const stringEndTimeStamp =
          i === state.values.length - 1 ? value.timestamp : state.values[i + 1].timestamp;

        const stringTagCode = visitedCodes.has(value.value)
          ? visitedCodes.get(value.value)
          : visitedCodes.size + 1;

        !visitedCodes.has(value.value) && visitedCodes.set(value.value, stringTagCode);

        return {
          stateCode: stringTagCode,
          stateName: value.value.toString() || NO_SELECTION,
          startTimestamp: value.timestamp,
          endTimestamp: stringEndTimeStamp
        };
      })
    }));
  }

  return states?.map((state, idx) => ({
    id: idx,
    label: state.name || state.id,
    parentProperty: state.id,
    data: (state.values as BaseTagStateValue[]).map((value) => {
      return {
        stateCode: value.value,
        stateName: value.name,
        startTimestamp: value.timestamp,
        endTimestamp: value.endTimestamp
      };
    })
  }));
};

const MachineStatesChart = ({
  isStringTagChart = false,
  hideSubStepIds,
  title,
  states
}: Props): JSX.Element => {
  const { zoomedDomain, onBrushDomainChangeEnd, resetZoom } = useSyncZoom();
  const colorMap = isStringTagChart
    ? theme.colors.randomColorMap
    : (theme.colors.proteinMachineStateColors as { [key: string]: string });

  return (
    <Graph>
      <StateOverTimeCard
        title={title}
        nestedData={toNestedData(states || [], isStringTagChart)}
        stateColors={colorMap}
        sync={true}
        brush={{
          zoomedDomain,
          onBrushDomainChangeEnd,
          resetZoom
        }}
        hideStateCodes={isStringTagChart}
        hideSubStepIds={hideSubStepIds}
      />
    </Graph>
  );
};

export default MachineStatesChart;
