// 3rd party
import React, { ReactElement } from 'react';
import styled from 'styled-components';

// Types
import { BaseType, ColumnConfig, SFOrder } from 'types';

// Components
import BaseTable from 'components/BaseTable/BaseTable';
import Typography from 'components/Typography/Typography';
import Button from 'components/Button';

// Helpers
import { formatDate } from 'helpers';

interface SFOrdersTableProps {
  data: SFOrder[];
  isDataLoading?: boolean;
}

// Styling
const PurchaseOrderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowCtaContainer = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const POTypography = styled(Typography)`
  font-size: 0.8125rem;
`;

const CustomHeader = styled.thead(({ theme }) => ({
  tr: {
    background: theme.colors.lightGrey1,
    th: {
      fontSize: '0.8125rem',
      fontWeight: 'bold',
      lineHeight: theme.typography.components.tableHeader.lineHeight,
      borderBottom: theme.colors.borders.border02.border,
      padding: '0.75rem',
      height: '3.625rem',
      ':first-child': {
        borderTopLeftRadius: '0.5rem'
      },
      ':last-child': {
        borderTopRightRadius: '0.5rem'
      }
    }
  }
}));

const generateColumnConfigs = (): ColumnConfig[] => {
  return [
    {
      title: 'Purchase Order No.',
      dataIndex: 'poNumber',
      key: 'poNumber',
      render(_, record) {
        const { poNumber, createdDate } = record as SFOrder;
        return (
          <PurchaseOrderContainer>
            <POTypography mb={0}>{formatDate(createdDate, 'short')}</POTypography>
            <POTypography mb={0}>{poNumber}</POTypography>
          </PurchaseOrderContainer>
        );
      }
    },
    {
      title: 'No. of Items',
      dataIndex: 'quantity',
      key: 'quantity',
      render(_, record) {
        const { quantity } = record as SFOrder;
        return <POTypography mb={0}>{quantity}</POTypography>;
      }
    },
    {
      title: 'Total Cost',
      dataIndex: 'total',
      key: 'total',
      render(_, record) {
        const { total } = record as SFOrder;
        return <POTypography mb={0}>{total}</POTypography>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render(_, record) {
        const { status } = record as SFOrder;
        return <POTypography mb={0}>{status}</POTypography>;
      }
    },
    {
      title: 'Order form',
      dataIndex: '',
      key: 'f',
      render(_, record) {
        const sfOrder = record as SFOrder;
        return (
          <RowCtaContainer>
            <Button
              variant="primary"
              size="small"
              onClick={() => {
                console.log('Show pdf' + JSON.stringify(sfOrder));
              }}
            >
              View PDF
            </Button>
          </RowCtaContainer>
        );
      }
    }
  ];
};

const SFOrdersTable = ({ data, isDataLoading }: SFOrdersTableProps): ReactElement => {
  return (
    <BaseTable
      columnConfigs={generateColumnConfigs()}
      customHeader={CustomHeader}
      data={data}
      alternatingRowColoring={true}
      isDataLoading={isDataLoading}
      borderBottomRow
      rowKey={(record: BaseType, index?: number) => `${(record as SFOrder).id}-${index}`}
    />
  );
};

export default SFOrdersTable;
