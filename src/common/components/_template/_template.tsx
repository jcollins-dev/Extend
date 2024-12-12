import React from 'react';
import { _templateContainer, baseClass } from './_template.elements';

export const _template = (): JSX.Element => {
  return (
    <_templateContainer className={baseClass}>
      <h1>Proseal Machine Health</h1>
      <div className={`${baseClass}__demo`}>demo container</div>
    </_templateContainer>
  );
};
