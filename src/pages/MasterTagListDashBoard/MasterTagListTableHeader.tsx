import React, { ReactElement, Fragment } from 'react';
import { Column, StatusPlaceHolder } from './MasterTagListDetailsTable';
import { MasterTagListColumn } from 'types/machine-management';
export const unSnakeColumnName = (name: string): string => name.replaceAll('_', ' ');
export const insertSpaces = (string: string): string => {
  string = string.replace(/([a-z])([A-Z])/g, '$1 $2');
  string = string.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
  return string;
}
const MasterTagListTableColumn = ({
  columnList
}: {
  columnList: MasterTagListColumn[] | undefined;
}): ReactElement => {
  return (
    <Fragment>
      <Column isStatusColumn>
        <StatusPlaceHolder></StatusPlaceHolder>
      </Column>
      {columnList
        ? columnList.map((column) => {
            return column.name !== 'id' ? (
              <Column key={column.name}>
                <div>{`${column.name == 'scan_rate' ? 'Scan Rate (ms)': column.name.includes('_') ? unSnakeColumnName(column.name) : insertSpaces(column.name) }${column.required ? '*' : ''}`}</div>
              </Column>
            ) : (
              ''
            );
          })
        : ''}
    </Fragment>
  );
};

export default MasterTagListTableColumn;
