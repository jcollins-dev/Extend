import React from 'react';
import { TileWidgetContainer, baseClass } from './TileWidgets.elements';

export const TileWidget = (): JSX.Element => {
  return (
    <TileWidgetContainer className={baseClass}>
      <h1>Proseal Machine Health</h1>
      <div className={`${baseClass}__demo`}>demo container</div>
    </TileWidgetContainer>
  );
};
