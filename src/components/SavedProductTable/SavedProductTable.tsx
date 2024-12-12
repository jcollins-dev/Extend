// 3rd party
import React, { ReactElement, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import {
  AvgLeadTimeCell,
  BaseTable,
  Button,
  CustomerPrice,
  InformationTooltip,
  Typography
} from 'components';

// Constants
import { sfEnabled } from 'constants/featureFlags';

// Types
import { BaseType, ColumnConfig, Filter, SortClickHandler, SortState, User } from 'types';
import { AlternateRow, TableRow, Part, PartDataWithKey, Product, SavedPart } from 'types/parts';

// API
import { useAddProductToCartMutation, useDeleteSavedProductMutation } from 'api';

// Custom hooks
import { useFilter, useSearch, useSort } from 'hooks';

// State management
import { cartActions } from 'actions';
import { useCart, useUser } from 'selectors';

// Constants
import { JBTRoutes } from 'constants/routes';
import { AnalyticsCategories, ECommerceAnalyticEventActions } from 'constants/analytics';

// Helpers
import { generateAnalyticsEvent } from 'helpers/analytics';
import { CartState } from 'types/parts/cart';

/* Interfaces used for styling and local objects */
interface SavedProductTableProps {
  data: SavedPart[];
  onRefresh: CallableFunction;
  title?: string;
  showHeader?: boolean;
  isDataLoading?: boolean;
  showSearch?: boolean;
  machineId?: string;
}

/* End interfaces */

/* Styling */
const RowCtaContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Root = styled.div`
  width: 100%;
  height: auto;
`;

const ActionLink = styled.a`
  color: ${(props) => props.theme.colors.table.link};
  text-decoration: none;
`;

const PartDescription = styled(Typography)<{ isAlternate?: boolean }>`
  margin-left: ${({ isAlternate }) => (isAlternate ? '2rem' : '0rem')};
  display: flex;
  justify-content: space-between;
`;

const DescriptionText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 12rem;
  float: left;
`;

const BodyRowContainer = styled.tr<{ alternate: boolean }>`
  background-color: ${(props) => {
    if (props.alternate) {
      return props.theme.colors.lightGrey2;
    }
    return 'transparent';
  }};
`;

const AlternativeContainer = styled.div`
  color: ${(props) => props.theme.colors.onTrackGreen};
`;

const SavedProductsTableContainer = styled.div`
  padding: 2rem;
  table {
    width: 100%;
    table-layout: fixed !important;
    border-left: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
    border-right: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
    border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
  }
`;

export const RemoveFromProductsIcon = styled.div`
  display: block;
  text-align: center;
  align-items: center;
  min-width: 10%;
  max-width: 10rem;
  cursor: pointer;
`;

/* End styling */

/* Helper functions */

const GroupRowContainer = ({ data }: { data: AlternateRow }): ReactElement => {
  const theme = useTheme();
  return (
    <Typography weight="medium" mb={0}>
      <div style={{ color: theme.colors.darkRed }}>Discontinued</div>
      <div>{data.description}</div>
    </Typography>
  );
};

/**
 * Returns a cell for a row. If the row is a group, returns an empty cell with colspan 0.
 * Otherwise returns a cell of colspan 1 with the given child and background color.
 */
const maybeEmptyCell = (data: TableRow, child: React.ReactNode, bg?: string) => {
  let colSpan = 1;
  let children = child;

  if ((data as TableRow)?.rowType === 'alternate') {
    colSpan = 0;
    children = null;
  }
  const cell: React.ReactNode = {
    children,
    props: {
      colSpan,
      style: {
        background: bg ? bg : 'transparent'
      }
    }
  };
  return cell;
};

const getAttributeValue = (data: TableRow, attrName: string) => {
  return data?.alternateProduct ? data?.alternateProduct[attrName] : data[attrName];
};

// Generate the configurations for each column of this table
const generateColumnConfigs = (
  sortState: Record<string, SortState>,
  addToCartHandler: (product: Product) => void,
  isLoading: boolean,
  selectedCartItem: Product,
  setSelectedCartItem: React.Dispatch<React.SetStateAction<Product | undefined>>,
  dataWithKeys: PartDataWithKey[],
  onRefresh: CallableFunction,
  t: TFunction<'fpns'[], undefined>,
  machineId?: string
): ColumnConfig[] => {
  const [deleteProduct] = useDeleteSavedProductMutation();

  const handleDelete = (id: string, tableRow: TableRow) => {
    deleteProduct({
      productId: id,
      priceUnit: tableRow.priceUnit
    })
      .unwrap()
      .then(() => {
        onRefresh();
        toast.success(tableRow.description + t('saved_product_remove'));
      })
      .catch((error) => {
        console.warn('Delete saved product error: ', error);
        toast(t('saved_product_delete_error'));
      });
  };

  return [
    {
      title: t('remove', { ns: 'common' }) as string,
      dataIndex: 'remove',
      key: 'remove',
      width: '5%',
      render(value, record) {
        const tableRow = record as TableRow;
        const colSpan = 1;
        const children = (
          <RemoveFromProductsIcon onClick={() => handleDelete(tableRow.id, tableRow)}>
            <FontAwesomeIcon icon={faTimes} />
          </RemoveFromProductsIcon>
        );

        const cell: React.ReactNode = {
          children,
          props: {
            colSpan
          }
        };
        return cell;
      }
    },
    {
      title: t('parts_table_product') as string,
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'description')
        ? sortState['description']
        : SortState.unsorted,
      render(value, record) {
        let children = value;
        const tableRow = record as TableRow;
        if (tableRow?.rowType === 'alternate') {
          children = <GroupRowContainer data={record as AlternateRow} />;
        } else {
          const tableRow = record as TableRow;
          const val = getAttributeValue(tableRow, 'description') as string;
          children = (
            <PartDescription weight="medium" mb={0} isAlternate={tableRow.alternateProduct}>
              {tableRow.alternateProduct && (
                <AlternativeContainer>{t('alternative')}</AlternativeContainer>
              )}

              <DescriptionText>{val}</DescriptionText>
              <InformationTooltip placement="top" tooltipText={val} />
            </PartDescription>
          );
        }
        const cell: React.ReactNode = {
          children
        };
        return cell;
      }
    },
    {
      title: t('parts_table_sku') as string,
      dataIndex: 'sku',
      key: 'sku',
      width: '10%',
      render(value, record) {
        // If the row is of type 'group', make a cell that spans the whole width of the table
        // Otherwise return a cell of colspan 1
        const tableRow = record as TableRow;
        const colSpan = tableRow?.rowType === 'alternate' ? 7 : 1;
        const children =
          tableRow?.rowType === 'alternate' ? (
            <>{value as string}</>
          ) : (
            <Typography mb={0} style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
              {getAttributeValue(tableRow, 'sku') as string}
            </Typography>
          );

        const cell: React.ReactNode = {
          children,
          props: {
            colSpan
          }
        };
        return cell;
      }
    },
    {
      title: t('parts_table_price') as string,
      dataIndex: 'price',
      key: 'price',
      width: '15%',
      render(value, record: TableRow) {
        return (
          <CustomerPrice
            product={record}
            fontSizeInREM={0.953}
            marginBottomInREM={0}
            inline={true}
          />
        );
      }
    },
    {
      title: t('parts_table_qty') as string,
      dataIndex: 'quantity',
      key: 'quantity',
      width: '5.125rem',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'quantity')
        ? sortState['quantity']
        : SortState.unsorted,
      render(value) {
        return (
          <Typography mb={0} style={{ whiteSpace: 'nowrap' }}>
            {value as string}
          </Typography>
        );
      }
    },
    {
      title: t('parts_table_avg_lead_time') as string,
      dataIndex: 'leadTime',
      key: 'leadTime',
      width: '15%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'leadTime')
        ? sortState['leadTime']
        : SortState.unsorted,
      render(_, record) {
        return <AvgLeadTimeCell purchasable={record as Product} />;
      }
    },
    {
      title: '',
      dataIndex: '',
      key: 'f',
      width: '15%',
      render(value, record) {
        const tableRow = record as TableRow;
        const product = tableRow.alternateProduct ? tableRow.alternateProduct : tableRow;
        return maybeEmptyCell(
          tableRow,
          <RowCtaContainer>
            <Button
              variant="primary"
              size="small"
              disabled={isLoading && selectedCartItem.id === product.id}
              onClick={() => {
                setSelectedCartItem(product);
                addToCartHandler(product);
              }}
            >
              {t('add_to_cart')}
            </Button>
          </RowCtaContainer>
        );
      }
    },
    {
      title: '',
      dataIndex: '',
      key: 'f',
      width: '7%',
      render(value, record) {
        const tableRow = record as TableRow;
        const product = tableRow.alternateProduct ? tableRow.alternateProduct : tableRow;
        const pdpLink =
          `${JBTRoutes.partsProduct.replace(':productId', product.id)}` +
          (machineId ? `?machineId=${machineId}` : '') +
          (product.priceUnit ? `?priceUnit=${product.priceUnit}` : '');
        return maybeEmptyCell(
          tableRow,
          <ActionLink href={pdpLink}>{t('view', { ns: 'common' })}</ActionLink>
        );
      }
    }
  ];
};

const addKeysToPartData = (keyPrefix: string, data: Part[]): PartDataWithKey[] => {
  return data.map((item) => {
    return {
      ...item,
      key: `${keyPrefix}-${item.sku}`
    };
  });
};

const generateAlternateParts = (partRows: PartDataWithKey[]): TableRow[] => {
  const rows: TableRow[] = [];
  partRows.forEach((partRow) => {
    if (partRow.alternateSku && partRow.alternateProduct) {
      rows.push({
        rowType: 'alternate',
        ...partRow
      });
    }
    rows.push(partRow);
  });
  return rows;
};

/* End helper functions */

/* Initial states for sorting and filtering */
const defaultSortState: Record<string, SortState> = {
  label: SortState.unsorted,
  sku: SortState.unsorted,
  leadTime: SortState.unsorted
};

const defaultFilterState = [{ property: 'partTypes', value: '' }];

const searchByProps = ['description', 'sku'];
/* End initial states */

const SavedProductTable = ({
  data,
  onRefresh,
  isDataLoading,
  showSearch = true,
  machineId = undefined
}: SavedProductTableProps): ReactElement => {
  const dispatch = useDispatch();
  const keyPrefix = 'm-parts';
  const [searchVal] = useState<string>('');
  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);
  const [filters] = useState<Filter[]>(defaultFilterState);
  const [selectedCartItem, setSelectedCartItem] = useState<Product>();
  const [addProductToCart, addCartResult] = useAddProductToCartMutation();
  const user = useUser() as User;
  const cart = useCart() as CartState;
  const { t } = useTranslation(['fpns']);

  const searchedData = useSearch<SavedPart>(searchVal, data, searchByProps);
  const filteredData = useFilter<SavedPart>(filters, showSearch ? searchedData : data);
  const sortedData = useSort<Part>(sortState, filteredData);

  const dataWithKeys: PartDataWithKey[] = addKeysToPartData(keyPrefix, sortedData);
  const dataWithAlternates: TableRow[] = generateAlternateParts(dataWithKeys);

  const addToCartHandler = (product: Product) => {
    try {
      if (sfEnabled()) {
        addProductToCart({
          accountId: user.plants[0],
          cart: cart,
          product: product,
          productId: product.sfProductId as string,
          quantity: 1,
          machineId: machineId
        });
      } else {
        dispatch({
          type: cartActions.ADD_TO_CART,
          item: product,
          quantity: product.quantity,
          groupId: machineId
        });
      }
      generateAnalyticsEvent({
        category: AnalyticsCategories.ECOMMERCE,
        action: ECommerceAnalyticEventActions.ADD_TO_CART_FROM_SEARCH_RESULTS
      });
    } catch (error) {
      console.warn('Add to cart failed! Error:', error);
      toast(`⚠️ There was a problem adding ${product.sku} to the cart`);
    }
  };

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
    <Root>
      <SavedProductsTableContainer>
        <BaseTable
          columnConfigs={generateColumnConfigs(
            sortState,
            addToCartHandler,
            addCartResult.isLoading,
            selectedCartItem as Product,
            setSelectedCartItem,
            dataWithKeys,
            onRefresh,
            t,
            machineId
          )}
          data={dataWithAlternates}
          sortHandler={sortHandler}
          isDataLoading={isDataLoading}
          bodyRowComponent={BodyRowContainer}
          onRow={(record) => {
            return {
              alternate: record.rowType === 'alternate',
              alternateRowColoring: true
            } as React.HTMLAttributes<TableRow>;
          }}
          rowKey={(record: BaseType, index?: number) =>
            `${(record as PartDataWithKey).id}-${index}`
          }
        />
      </SavedProductsTableContainer>
    </Root>
  );
};

export default SavedProductTable;
