import React from 'react';
import { ViewContainer, baseClass } from './_templateMachineHealth.elements';

export const ProsealMachineHealth = (): JSX.Element => {
  return (
    <ViewContainer className={baseClass}>
      <h1>Proseal Machine Health</h1>
      <div className={`${baseClass}__demo`}>demo container</div>
    </ViewContainer>
  );
};
