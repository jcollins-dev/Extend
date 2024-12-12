// 3rd party
import React, { ChangeEvent, ReactElement, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import {
  AvgLeadTimeCell,
  Button,
  Loader,
  SearchInput,
  CustomerPrice,
  InformationTooltip
} from 'components';
// Importing Typography separately so it plays nicely with Styled Components extension
import Typography from 'components/Typography/Typography';

// Types
import { User, TableColumnConfigs } from 'types';
import { Part, Product, PartDataWithKey, TableRow, AlternateRow } from 'types/parts';

// Custom hooks
import { useSearch } from 'hooks';
import { useLanguage } from 'providers';

// API
import { useAddProductToCartMutation, useGetMachineByIdQuery } from 'api';

// Constants
import { JBTRoutes } from 'constants/routes';
import { AnalyticsCategories, ECommerceAnalyticEventActions } from 'constants/analytics';
import { sfEnabled } from 'constants/featureFlags';
import { UNIVERSAL_PRODUCTS_KEY } from 'constants/cart';

// State management
import { CartState } from 'types/parts/cart';
import { useCart, useUser } from 'selectors';
import { cartActions } from 'actions';

// Helpers
import { getStockText } from 'helpers';
import { generateAnalyticsEvent } from 'helpers/analytics';
//TanStack table
import NewBaseTable, { ColumnConfig } from '../../components/NewBaseTable/NewBaseTable';
import { CellContext } from '@tanstack/react-table';
import { tanStackTableActions as tanStackActions } from 'actions/tanStackTable';
import { tanStackTableFilterOption } from 'reducers/tanStackTable';

/* Interfaces used for styling and local objects */
interface MachinePartsTableProps {
  data: Part[];
  title?: string;
  showHeader?: boolean;
  isDataLoading?: boolean;
  showSearch?: boolean;
  machineId?: string;
  updateTableOnFilterChange?: (option: string) => void;
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

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

const SearchContainer = styled.div`
  width: 24.375rem;
  height: 2.5rem;
`;
const ActionLink = styled.a`
  color: ${(props) => props.theme.colors.table.link};
  text-decoration: none;
`;

const PartDescription = styled(Typography)<{ isAlternate?: boolean }>`
  margin-left: ${({ isAlternate }) => (isAlternate ? '0rem' : '0rem')};
  display: flex;
  justify-content: space-between;
`;

const StockText = styled.span`
  white-space: normal;
`;

const DescriptionText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 6rem;
  float: left;
  margin-right: 0.26rem;
`;

const AlternativeContainer = styled.div`
  color: ${(props) => props.theme.colors.onTrackGreen};
`;

const MachinePartsTableContainer = styled.div`
  table {
    width: 100%;
    table-layout: fixed !important;
    min-width: 850px;
  }
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

const getAttributeValue = (data: TableRow, attrName: string) => {
  return data?.alternateProduct ? data?.alternateProduct[attrName] : data[attrName];
};

const getDescriptionAttributeValue = (data: TableRow, languageId: string) => {
  const multilingualDescObj = data?.alternateProduct
    ? data?.alternateProduct['multilingualDesc']
    : data['multilingualDesc'];

  type MultiligualLanguageKey = keyof typeof multilingualDescObj;
  const multilingualDesc = multilingualDescObj
    ? multilingualDescObj[languageId as MultiligualLanguageKey]
    : undefined;
  const description = getAttributeValue(data, 'description') as string;
  return multilingualDesc ? multilingualDesc : description;
};

// Generate the configurations for each column of this table
const generateColumnConfigs = (
  t: TFunction<'fpns'[], undefined>,
  addToCartHandler: (product: Product) => void,
  isLoading: boolean,
  selectedCartItem: Product,
  setSelectedCartItem: React.Dispatch<React.SetStateAction<Product | undefined>>,
  machineId?: string,
  languageId?: string
): ColumnConfig[] => {
  return [
    {
      id: 'description',
      header: t('parts_table_product') as string,
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        const tableRow = cellValue.row.original as TableRow;
        let children = cellValue.getValue() as unknown as ReactElement;
        if (tableRow?.rowType === 'alternate') {
          children = <GroupRowContainer data={tableRow as AlternateRow} />;
        } else {
          const val = getDescriptionAttributeValue(tableRow, languageId as string) as string;
          children = (
            <PartDescription weight="medium" mb={0} isAlternate={tableRow.alternateProduct}>
              {tableRow.alternateProduct && (
                <AlternativeContainer>Alternative</AlternativeContainer>
              )}

              <DescriptionText>{val}</DescriptionText>
              <InformationTooltip placement="top" tooltipText={val} />
            </PartDescription>
          );
        }
        return children;
      }
    },
    {
      id: 'sku',
      header: t('parts_table_sku') as string,
      isEnableSorting: false,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        const tableRow = cellValue.row.original as TableRow;
        const colVal = tableRow.stockCode || tableRow.sku;
        const attr = tableRow.stockCode ? 'stockCode' : 'sku';
        const children =
          tableRow?.rowType === 'alternate' ? (
            <>{colVal as string}</>
          ) : (
            <Typography mb={0} style={{ whiteSpace: 'normal' }}>
              {getAttributeValue(tableRow, attr) as string}
            </Typography>
          );
        return children;
      }
    },
    {
      id: 'stock',
      header: t('parts_table_stock') as string,
      isEnableSorting: false,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        const product = cellValue.row.original as Product;
        return <StockText>{t(getStockText(product))}</StockText>;
      }
    },
    {
      id: 'leadTime',
      header: t('parts_table_avg_lead_time') as string,
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        const product = cellValue.row.original as Product;
        return <AvgLeadTimeCell purchasable={product} />;
      }
    },
    {
      id: 'price',
      header: t('parts_table_price') as string,
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        const record = cellValue.row.original as TableRow;
        return (
          <CustomerPrice
            product={record}
            fontSizeInREM={0.813}
            marginBottomInREM={0}
            inline={true}
          />
        );
      }
    },
    {
      id: 'siteRef',
      header: t('parts_table_site') as string,
      isEnableSorting: false,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        const tableRow = cellValue.row.original as TableRow;
        const colVal = tableRow?.businessUnit
          ?.split('')
          .map((char, index) => (index === 0 ? char.toUpperCase() : char))
          .join('');
        return colVal;
      }
    },
    {
      id: `isDummy`,
      header: '',
      isEnableSorting: false,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        const product = cellValue.row.original as Product;
        return (
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
              {isLoading && selectedCartItem.id === product.id && <Loader size={10} margin={0} />}
            </Button>
          </RowCtaContainer>
        );
      }
    },
    {
      id: `isDummy`,
      header: '',
      isEnableSorting: false,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        const product = cellValue.row.original as Product;
        const queryParams = `?priceUnit=${product.priceUnit}${
          machineId ? `&machineId=${machineId}` : ''
        }`;
        const pdpLink = `${JBTRoutes.partsProduct.replace(':productId', product.id)}` + queryParams;
        return <ActionLink href={pdpLink}>{t('view', { ns: 'common' })}</ActionLink>;
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
const defaultSortState = {
  id: 'description',
  desc: true
};
const filterOptions: tanStackTableFilterOption[] = [
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_stock', label: 'Out of Stock' }
];

const searchByProps = ['description', 'sku'];
/* End initial states */

const MachinePartsTable = ({
  data,
  title,
  showHeader = true,
  isDataLoading,
  showSearch = false,
  machineId = undefined,
  updateTableOnFilterChange
}: MachinePartsTableProps): ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['fpns']);

  const { languageId } = useLanguage();
  const keyPrefix = 'm-parts';
  const [searchVal, setSearchVal] = useState<string>('');
  const [selectedCartItem, setSelectedCartItem] = useState<Product>();

  const searchedData = useSearch<Part>(searchVal, data, searchByProps);
  const activeData = searchVal ? searchedData : data;

  const dataWithKeys: PartDataWithKey[] = addKeysToPartData(keyPrefix, activeData);

  const dataWithAlternates: TableRow[] = generateAlternateParts(dataWithKeys);

  const user = useUser() as User;
  const cart = useCart() as CartState;
  const [addProductToCart, addCartResult] = useAddProductToCartMutation();

  const { data: machine } = useGetMachineByIdQuery(machineId ?? skipToken);

  //tanStack table filter options

  dispatch(tanStackActions.addFilterOptions(filterOptions));

  // Interaction handler functions
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchVal(event.target.value);
  };

  const addToCartHandler = (product: Product) => {
    try {
      if (sfEnabled()) {
        addProductToCart({
          // Use the machine's plant ID in favor of the user's first plant if available
          accountId: machine ? machine.plantId : user.plants[0],
          cart: cart,
          product: product,
          productId: product.sfProductId as string,
          quantity: 1,
          machineId: machineId,
          machineDescription:
            machine === undefined || machineId === UNIVERSAL_PRODUCTS_KEY
              ? UNIVERSAL_PRODUCTS_KEY
              : machine?.description
        });
      } else {
        dispatch({
          type: cartActions.ADD_TO_CART,
          item: product,
          quantity: product.quantity,
          groupId: machineId,
          groupDescription:
            machine === undefined || machineId === UNIVERSAL_PRODUCTS_KEY
              ? UNIVERSAL_PRODUCTS_KEY
              : machine?.description
        });
      }
      generateAnalyticsEvent({
        category: AnalyticsCategories.ECOMMERCE,
        action: ECommerceAnalyticEventActions.ADD_TO_CART_FROM_SEARCH_RESULTS
      });
    } catch (error) {
      console.warn('Add to cart failed! Error:', error);
      toast(t('problem_adding_to_cart', { item: product.sku }));
    }
  };

  return (
    <Root>
      {showHeader && (
        <>
          {title && <h2>{title}</h2>}
          {
            <ControlsContainer>
              <SearchContainer>
                {showSearch && (
                  <SearchInput
                    placeholder={t('search_product_name_or_sku') as string}
                    onChange={handleSearchChange}
                    value={searchVal}
                  />
                )}
              </SearchContainer>
            </ControlsContainer>
          }
        </>
      )}
      <MachinePartsTableContainer>
        <NewBaseTable
          newTableData={dataWithAlternates}
          columnConfigs={generateColumnConfigs(
            t,
            addToCartHandler,
            addCartResult.isLoading,
            selectedCartItem as Product,
            setSelectedCartItem,
            machineId,
            languageId
          )}
          sortState={defaultSortState}
          enableFilter={true}
          isShowColumnOptions={true}
          handleFilterRequest={updateTableOnFilterChange}
          isDataLoading={isDataLoading}
        />
      </MachinePartsTableContainer>
    </Root>
  );
};

export default MachinePartsTable;
