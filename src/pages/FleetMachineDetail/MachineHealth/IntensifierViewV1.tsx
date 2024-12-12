import React from 'react';
import { IntensifierViewContainer } from './MachineHealth.elements';
import { AlarmsAndSkidsArea } from './IntensifierViewAlarmsAndSkids';

export const IntensifierView = (): JSX.Element => {
  return (
    <IntensifierViewContainer className="page-view--intensifiers">
      <AlarmsAndSkidsArea />
    </IntensifierViewContainer>
  );
};
