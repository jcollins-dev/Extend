import React, { ReactElement } from 'react';
import { SFOrderItem, TableColumnConfigs } from 'types';
import NewBaseTable, { ColumnConfig } from '../../components/NewBaseTable/NewBaseTable';
import Typography from 'components/Typography/Typography';
import { DetailsTableHeader, POItemsTableWrapper } from './NewSFOrdersTableStyled';
import { CellContext } from '@tanstack/react-table';

interface PODetailsProps {
  items: SFOrderItem[];
}
const defaultSortState = {
  id: 'startTime',
  desc: true
};
const generateColumnConfigs = (): ColumnConfig[] => {
  return [
    {
      id: 'description',
      header: 'Description',
      isEnableSorting: false,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => cellValue.getValue()
    },
    {
      id: 'partNumber',
      header: 'Part No',
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => cellValue.getValue()
    },
    {
      id: 'unitPrice',
      header: 'Sales Price',
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) =>
        `${cellValue.row.original.currencySymbol}${cellValue.getValue()}`
    },
    {
      id: 'quantity',
      header: 'Quantity',
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => cellValue.getValue()
    },
    {
      id: 'unitOfMeasurement',
      header: 'U/M',
      isEnableSorting: false,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => cellValue.getValue()
    },
    {
      id: 'subtotal',
      header: 'Subtotal',
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => `${cellValue.getValue()}`
    }
  ];
};
export const POItemsList = ({ items }: PODetailsProps): ReactElement => {
  const currencies: string[] = [];
  items.forEach((item) => {
    if (!currencies.includes(item.currency as string)) {
      currencies.push(item.currency as string);
    }
  });
  return (
    <>
      <DetailsTableHeader>
        <Typography variant="body1" weight="bold">
          Currency: {currencies.toString()}
        </Typography>
      </DetailsTableHeader>
      <POItemsTableWrapper>
        <NewBaseTable
          newTableData={items}
          columnConfigs={generateColumnConfigs()}
          sortState={defaultSortState}
        />
      </POItemsTableWrapper>
    </>
  );
};
