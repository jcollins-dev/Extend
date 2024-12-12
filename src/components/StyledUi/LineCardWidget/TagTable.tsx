// 3rd party libs
import React, { Fragment } from 'react';

// Components
import { UiGridTable } from '../elements/UiGridTable.elements';
export interface TagTableProps {
  tableData: TagProps[];
}

export interface TagProps {
  name: string | undefined;
  unit?: string;
  value: string | number | null;
}

const TagTable = (tableData: TagTableProps): JSX.Element => {
  const GridRows = tableData.tableData.map((row: TagProps) => {
    const tagVal = row.value;
    const tagValUnits = tagVal !== '--' && row.unit ? `${tagVal} ${row.unit}` : tagVal;
    return (
      <Fragment key={row.name}>
        <div className="ui-label ui-cell">{row.name}</div>
        <div className="ui-cell">{tagValUnits}</div>
      </Fragment>
    );
  });

  return (
    <UiGridTable colSizes="2fr 1fr">
      {/* Column titles and spacers go here, examples below */}
      {/* <span className="ui-spacer ui-cell"></span> */}
      {/* <div className="ui-col-title ui-cell">Title</div> */}
      {GridRows}
    </UiGridTable>
  );
};

export default TagTable;
