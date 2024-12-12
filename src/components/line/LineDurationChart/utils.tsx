// Components
import { NestedRow } from 'components/StateOverTimeCard';

// Types
import {
  LineMachineStates,
  LineStates,
  ProteinMachineCategoryStates,
  ProteinMachineStateCategoryName
} from 'types/protein';

// Contants
import {
  proteinMachineCategoryStatesToString,
  proteinMachineCategoryValuesToString
} from 'constants/proteinMachineCategoryStates';

export const toNestedData = (
  lineAndMachinesTuple: [LineStates, LineMachineStates[]] | undefined,
  lineName: string
): NestedRow[] => {
  if (!lineAndMachinesTuple) return [];

  const [line, lineMachines] = lineAndMachinesTuple;

  const parentRow: NestedRow = {
    id: -1,
    label: lineName,
    parentProperty: line.entityId,
    data: line.values.map((state) => {
      const stateValue = state.value as ProteinMachineCategoryStates;
      return {
        stateCode: state.value,
        stateName: proteinMachineCategoryValuesToString[stateValue],
        startTimestamp: state.timestamp,
        endTimestamp: state.endTimestamp
      };
    }),
    children: lineMachines.map((machine, i) => {
      return {
        id: i,
        label: machine.meta.description,
        parentProperty: machine.entityId,
        data: machine.values.map((state) => {
          const stateName = state.name as ProteinMachineStateCategoryName;
          return {
            stateCode: state.value,
            stateName: proteinMachineCategoryStatesToString[stateName],
            startTimestamp: state.timestamp,
            endTimestamp: state.endTimestamp
          };
        })
      };
    })
  };

  return [parentRow];
};
