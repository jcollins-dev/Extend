// 3rd party
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';

// Theming
import { default as theme } from 'themes';

// Components
import { AvgLeadTimeCell, BaseTable, Checkbox, PartStockCell } from 'components';

// Types
import {
  BaseType,
  InputChangeHandlerWithIndex,
  ColumnConfig,
  PreventativeMaintenancePart,
  SortClickHandler,
  SortState
} from 'types';
import { Product } from 'types/parts';

// Hooks
import { useSort } from 'hooks';

// Helpers
import { currency } from 'helpers';

// Styling
const PartImageContainer = styled.div`
  width: 100%;
  display: flex;
`;

const PartImage = styled.img`
  width: 2.5rem;
  height: 2.25rem;
  object-fit: contain;
`;

const EditableQuantity = styled.input`
  width: 1.875rem;
  height: 1.5rem;
  text-align: center;
`;

const CustomHeader = styled.thead`
  tr {
    background-color: ${(props) => props.theme.colors.background.background7};

    th {
      font-size: ${(props) => props.theme.typography.components.tableHeader.size};
      font-weight: ${(props) => props.theme.typography.components.tableHeader.weight};
      line-height: ${(props) => props.theme.typography.components.tableHeader.lineHeight};
      border-bottom: ${(props) => props.theme.colors.borders.border02.border};
      border-top: none;

      padding: 0.75rem;
    }
  }
`;

// Initial state for sorting
const defaultSortState: Record<string, SortState> = {
  quantity: SortState.unsorted,
  label: SortState.unsorted,
  sku: SortState.unsorted,
  leadTime: SortState.unsorted
};

// Generate the configurations for each column of this table
const generateColumnConfigs = (
  sortState: Record<string, SortState>,
  selectionHandler: (id: string) => void,
  quantityInputChangeHandler: InputChangeHandlerWithIndex,
  leadTimeThreshold?: number,
  stockThreshold?: number,
  firstHeader?: JSX.Element
): ColumnConfig[] => {
  return [
    {
      title: '',
      dataIndex: 'selected',
      key: 'selected',
      width: '10rem',
      customHeader: firstHeader,
      render(value, record, index) {
        return (
          <>
            <Checkbox
              key={`checkbox-${index}`}
              checked={value as boolean}
              onChange={() => {
                selectionHandler((record as PreventativeMaintenancePart).id);
              }}
            />
          </>
        );
      }
    },
    {
      title: '',
      dataIndex: 'imgURL',
      key: 'imgURL',
      width: '3.125rem',
      render(value, record, index) {
        return (
          <PartImageContainer key={`part-image-${index}`}>
            <PartImage
              src={value ? (value as string) : '/assets/placeholder/machines/default.jpg'}
            />
          </PartImageContainer>
        );
      }
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '3.125rem',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'quantity')
        ? sortState['quantity']
        : SortState.unsorted,
      render(value, record, index) {
        return (
          <EditableQuantity
            key={`quantity-${index}`}
            type="number"
            min={0}
            // TODO - Add maximum based on the number available when the backend provides this
            defaultValue={value as number}
            onBlur={(event) => {
              quantityInputChangeHandler(event, (record as PreventativeMaintenancePart).id);
            }}
          />
        );
      }
    },
    {
      title: 'Auto Order',
      dataIndex: 'autoOrder',
      key: 'autoOrder',
      width: '3.125rem',
      render(value, record, index) {
        return (
          <Switch
            key={`switch-${index}`}
            checked={!!value}
            offColor={theme.colors.field.switch.trackOff}
            onColor={theme.colors.field.switch.trackOn}
            offHandleColor={theme.colors.field.switch.handleOff}
            onHandleColor={theme.colors.field.switch.handleOn}
            uncheckedIcon={false}
            checkedIcon={false}
            width={32}
            height={12}
            handleDiameter={20}
            onChange={() => {
              // TODO - provide real action here once POs determine what it is
              console.log('switch pressed: ', value);
            }}
          />
        );
      }
    },
    {
      title: 'Part',
      dataIndex: 'description',
      key: 'description',
      width: '19.375rem',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'description')
        ? sortState['description']
        : SortState.unsorted
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: '6.25rem',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'sku')
        ? sortState['sku']
        : SortState.unsorted
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: '3.125rem',
      render(value) {
        return (
          <PartStockCell thresholdValue={stockThreshold} value={value as number}>
            {value}
          </PartStockCell>
        );
      }
    },
    {
      title: 'Avg Lead Time',
      dataIndex: 'leadTime',
      key: 'leadTime',
      width: '8rem',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'leadTime')
        ? sortState['leadTime']
        : SortState.unsorted,
      render(_, record) {
        return <AvgLeadTimeCell purchasable={record as Product} />;
      }
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '5.625rem',
      render(value, record) {
        return <>{currency(value as number, (record as PreventativeMaintenancePart).priceUnit)}</>;
      }
    }
  ];
};

interface Props {
  data: PreventativeMaintenancePart[];
  leadTimeThreshold: number;
  stockThreshold: number;
  selectionHandler: (id: string) => void;
  quantityInputChangeHandler: InputChangeHandlerWithIndex;
  selectAllControl?: JSX.Element;
  isDataLoading?: boolean;
}

const PmPartsTable = ({
  data,
  leadTimeThreshold,
  stockThreshold,
  selectionHandler,
  quantityInputChangeHandler,
  selectAllControl,
  isDataLoading
}: Props): ReactElement => {
  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);
  const sortedData = useSort<PreventativeMaintenancePart>(sortState, data);

  const sortHandler: SortClickHandler = (key, currentSortState) => {
    const newSortState = {
      ...defaultSortState,
      [key]:
        currentSortState === SortState.ascending
          ? SortState.descending
          : currentSortState === SortState.descending
          ? SortState.unsorted
          : SortState.ascending
    };
    setSortState(newSortState);
  };

  return (
    <BaseTable
      columnConfigs={generateColumnConfigs(
        sortState,
        selectionHandler,
        quantityInputChangeHandler,
        leadTimeThreshold,
        stockThreshold,
        selectAllControl
      )}
      data={sortedData}
      sortHandler={sortHandler}
      rowKey={(record: BaseType, index?: number) =>
        `${(record as PreventativeMaintenancePart).id}-${index}`
      }
      customHeader={CustomHeader}
      isDataLoading={isDataLoading}
    />
  );
};

export default PmPartsTable;
