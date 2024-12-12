import React, { useState, createContext } from 'react';
import { useFleetMachineAccountData } from '../hooks';
import { IntensifierViewChartsContainer } from './MachineHealth.elements';
import { IntensifierAlarmsWidget } from './components/IntensifierAlarmsWidget/IntensifierAlarmsWidget';
import { SkidUtilizationCharts } from './components/SkidUtilizationChart/SkidUtilizationCharts';

interface SelectedSkitContextReturnProps {
  selected?: string[] | undefined;
  setSelected?: (x?: string[] | undefined) => void;
}

export const SelectedSkidContext = createContext<SelectedSkitContextReturnProps>({
  setSelected: (x?: string[] | undefined) => console.log('not used', { x })
});

export const AlarmsAndSkidsArea = (): JSX.Element => {
  // setup the seleted states for fiters and passdown to the charts
  const [selected, setSelected] = useState<string[] | undefined>(undefined);
  // get the skids for this machine from useFleetMachineAccountData hook, this gets skid info from
  // salesforce i think
  const { hasSkids } = useFleetMachineAccountData();
  // set defaults to prevent crashing
  const skids = !hasSkids ? [1] : hasSkids;
  return (
    <IntensifierViewChartsContainer skidCount={skids.length} className="intensifiers-charts-area">
      <SelectedSkidContext.Provider value={{ selected, setSelected }}>
        <SkidUtilizationCharts />
        <IntensifierAlarmsWidget />
      </SelectedSkidContext.Provider>
    </IntensifierViewChartsContainer>
  );
};
