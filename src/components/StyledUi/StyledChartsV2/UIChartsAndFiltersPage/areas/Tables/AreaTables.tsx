import React from 'react';
import { UiChartsAndFiltersPageProps } from '../../UiChartsAndFiltersPage';
import { VirtualizedTableUi } from '../../../VirtualizedTable/VirtualizedTableUi';

export const AreaTables = ({ tables }: UiChartsAndFiltersPageProps): JSX.Element => {
  if (!tables) return <></>;

  const TablesToUse = (
    <>
      {tables.map((table, index) => (
        <VirtualizedTableUi key={`table${index}`} {...table} />
      ))}
    </>
  );

  return <div className="charts-and-flters-page__tables-area">{TablesToUse}</div>;
};
