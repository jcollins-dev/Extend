import React, { ReactElement, useMemo, useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import { ModalSize, SFOrderHistory, SFOrderItem, TableColumnConfigs } from 'types';
import { saveAs } from 'file-saver';
import NewBaseTable, { ColumnConfig } from '../../components/NewBaseTable/NewBaseTable';
import { useGetOrderMachinesQuery, useGetOrdersQuery } from 'api';
import { useDispatch } from 'react-redux';
import { cartActions } from 'actions';
import { formatDate } from 'helpers';
import {
  OrdersContainer,
  OrderTableWrapper,
  OrderModalFooter,
  DetailTextLink,
  OrderFooterTextWrapper,
  ModalButtonsContainer,
  PurchaseOrder,
  OrderIconWrapper,
  OrderHeaderIconWrapper,
  OrderIcon,
  SelectionHeader,
  OrderModalBody,
  OrderSupportColumn,
  OrderItemsContainer,
  AddressCardsContainer,
  POHeaderContainer,
  POItemsTableContainer,
  POAddressCard,
  POAddressText,
  POHeaderTextContainer,
  POHeaderText,
  Totalbox,
  TotalText,
  POPrice,
  POTableHeader,
  HeaderText,
  HeaderTextWrapper,
  HeaderIconContainer,
  DetailTitleContainer,
  POPriceWrapper
} from './NewSFOrdersTableStyled';
import theme from 'themes';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography/Typography';
import { Button, Modal, Pagination } from 'components';
import PDFButtonIcon from '../../img/pdf 1.svg';
import JBTLogo from '../../img/JBT logo.svg';
import JBTSupport from '../../img/support.svg';
import VendorIcon from '../../img/user_plain.svg';
import ShipToIcon from '../../img/truck_short.svg';
import ShipToIconBlue from '../../img/truck_short_blue.svg';
import BillToIcon from '../../img/page.svg';
import CreatorIcon from '../../img/user_framed.svg';
import DateIcon from '../../img/file_cliped.svg';
import ReorderIcon from '../../img/reorder.svg';
import UnpackIcon from '../../img/UnPack.svg';
import { POItemsList } from './POItemsList';
import { Product } from 'types/parts';
import { UNIVERSAL_PRODUCTS_KEY } from 'constants/cart';
import { tanStackTableActions as tanActions } from 'actions/tanStackTable';
import { ITEMS_PER_PAGE } from 'constants/proseal';
const defaultSortState = {
  id: 'startTime',
  desc: true
};
const defaultShippingAddress = 'Art Food Logistics 300 N LaSalle Dr Sacramento, CA 18392, USA';
const defaultVendorAddress = 'John Bean Technologies 6430 Shiloh Rd East Alpharetta, GA 30005, USA';
const NewSFOrdersTable = (): ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['common']);
  const [showOrderDetails, setShowOrderDetails] = useState<boolean>(false);
  const [poItems, setPOItems] = useState<SFOrderItem[]>();
  const [poItemsTotal, setPoItemsTotal] = useState<number>();
  const [currentMachine, setCurrentMachine] = useState<string>('All');
  const [shipToAddress, setShipToAddress] = useState<string>(defaultShippingAddress);
  const [billToAddress, setBillToAddress] = useState<string>(defaultShippingAddress);
  const [vendorAddress, setVendorAddress] = useState<string>(defaultVendorAddress);
  const [poCreator, setPOCreator] = useState<string>('');
  const [poDate, setPODate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [machineId, setMachineId] = useState<string>('all_machine');
  const [linkToPdf, setLinkToPdf] = useState<string>();
  const [poNumber, setPONumber] = useState<string>();

  const { data: orders, isFetching: isDataFetching } = useGetOrdersQuery({
    machineId: machineId,
    limit: ITEMS_PER_PAGE,
    offset: currentPage
  });
  const { data: OrderedOnMachines } = useGetOrderMachinesQuery();
  const sfOrders = useMemo(() => orders?.orderDetails, [orders]) as SFOrderHistory[];
  const machines = useMemo(() => {
    if (OrderedOnMachines?.machineList && OrderedOnMachines.machineList.length > 0) {
      const mlist = OrderedOnMachines.machineList?.map((m) => {
        return { value: m.machineId, label: m.machineName };
      });
      return mlist;
    }
  }, [OrderedOnMachines]);

  if (machines && machines.length > 0) {
    dispatch(tanActions.addFilterOptions(machines));
  }
  //  below comment left for reference for adjoining story
  // const center = {
  //   lat: 37.7749, //plant?.latitude as number,
  //   lng: 122.4194 //plant?.longitude as number
  // };
  // zoom?: number;
  // heading?: string;
  // markerIcon?: string | google.maps.Icon | google.maps.Symbol;
  // height?: number;
  // const mapTypeControl = true;
  const hideOrderModal = () => {
    setShowOrderDetails(!showOrderDetails);
  };
  const showOrderModal = (order: SFOrderHistory) => {
    if (order !== undefined) {
      setShipToAddress(order.shippingAddress as string);
      setBillToAddress(order.billingAddress as string);
      setVendorAddress(order.vendorAddress as string);

      setPOCreator(order.creator as string);
      setPODate(formatPODate(order.poDate));
      setPOItems(order.poDetails as SFOrderItem[]);
      setPoItemsTotal(order.totalPrice);
      setLinkToPdf(order.linkToPdfInBlobStorage as string);
      setPONumber(poNumber as string);
      setShowOrderDetails(!showOrderDetails);
    }
  };
  const formatPODate = (date: string | undefined): string => {
    if (!date) return '';
    return formatDate(date, 'day-month-year');
  };

  const addItemsToCart = (order: SFOrderHistory) => {
    if (sfOrders !== undefined) {
      order.poDetails?.forEach((item) => {
        const product: Product = {
          id: item.productId as string,
          description: item.description as string,
          sku: item.partNumber as string,
          price: Number(item.unitPrice),
          priceUnit: item.currency,
          isPurchasable: true,
          leadTime: 0,
          stock: 1
        };
        dispatch({
          type: cartActions.ADD_TO_CART,
          item: product,
          quantity: item.quantity,
          groupId:
            item.machineInfo !== undefined
              ? item.machineInfo[0].machineId
                ? item.machineInfo[0].machineId
                : UNIVERSAL_PRODUCTS_KEY
              : UNIVERSAL_PRODUCTS_KEY,
          groupDescription:
            item.machineInfo !== undefined
              ? item.machineInfo[0].machineName
                ? item.machineInfo[0].machineName
                : UNIVERSAL_PRODUCTS_KEY
              : UNIVERSAL_PRODUCTS_KEY
        });
      });
    }
  };
  const downloadOrderDetails = () => {
    saveAs(linkToPdf as string, `order-quote-${poNumber}.pdf`);
  };
  const updateTableOnFilterChange = (val: string): void => {
    let label;
    if (val === 'All') {
      label = val;
      setMachineId('all_machine');
    } else {
      const machine = machines?.find((m) => m.value === val);
      label = machine?.label;
      setMachineId(machine?.value as string);
    }
    setCurrentMachine(trimMachineName(label as string));
  };
  const trimMachineName = (label: string): string => {
    return label.length <= 15 ? label : label.substring(0, 15).concat('...');
  };
  const generateColumnConfigs = (): ColumnConfig[] => {
    return [
      {
        id: 'poDate',
        header: 'Date',
        isEnableSorting: true,
        isSelected: true,
        renderer: (cellValue: CellContext<TableColumnConfigs, string>) =>
          formatPODate(cellValue.getValue())
      },
      {
        id: 'poNumber',
        header: 'PO Number',
        isEnableSorting: true,
        isSelected: true,
        renderer: (cellValue: CellContext<TableColumnConfigs, string>) => cellValue.getValue()
      },
      {
        id: 'orderBy',
        header: 'Order by',
        isEnableSorting: true,
        isSelected: true,
        renderer: (cellValue: CellContext<TableColumnConfigs, string>) => (
          <Typography color="darkGrey" mb="0.5rem" as="a">
            {cellValue.getValue()}
          </Typography>
        )
      },
      {
        id: 'totalPrice',
        header: 'Price',
        isEnableSorting: true,
        isSelected: true,
        renderer: (cellValue: CellContext<TableColumnConfigs, string>) => (
          <POPriceWrapper>
            <POPrice>{cellValue.getValue()}</POPrice>
            <OrderIconWrapper
              isClickable={true}
              onClick={() => {
                addItemsToCart(cellValue.row.original as SFOrderHistory);
              }}
              title="Reorder"
            >
              <OrderIcon src={ReorderIcon} />
            </OrderIconWrapper>
          </POPriceWrapper>
        )
      },
      {
        id: 'poNumber',
        header: 'Order Details',
        isEnableSorting: true,
        isSelected: true,
        renderer: (cellValue: CellContext<TableColumnConfigs, string>) => (
          <>
            <PurchaseOrder
              onClick={() => {
                showOrderModal(cellValue.row.original as SFOrderHistory);
              }}
            >
              <OrderIconWrapper isClickable={true}>
                <OrderIcon src={ShipToIconBlue} />
              </OrderIconWrapper>
              {t('see_order_details') as string}
            </PurchaseOrder>
          </>
        )
      }
    ];
  };
  return (
    <>
      <POTableHeader>
        <HeaderTextWrapper>
          {t('orders') as string}-<HeaderText>{currentMachine}</HeaderText>
        </HeaderTextWrapper>
        <HeaderIconContainer>
          <OrderIconWrapper customHeight="5.813rem" customWidth="5.813rem">
            <OrderIcon src={UnpackIcon} />
          </OrderIconWrapper>
        </HeaderIconContainer>
      </POTableHeader>
      <OrdersContainer>
        <Modal
          onClose={hideOrderModal}
          size={ModalSize.SMALL}
          title={
            <DetailTitleContainer>
              <Typography weight="bold" size="2rem">
                Order Details
              </Typography>
            </DetailTitleContainer>
          }
          visible={showOrderDetails as boolean}
          allowContentScroll={true}
        >
          <SelectionHeader>
            <OrderHeaderIconWrapper>
              <OrderIcon src={PDFButtonIcon} />
            </OrderHeaderIconWrapper>
            {t('parts_order') as string}
          </SelectionHeader>
          <OrderModalBody>
            <OrderSupportColumn>
              <OrderIconWrapper customHeight="5.813rem" customWidth="5.813rem">
                <OrderIcon src={JBTLogo} />
              </OrderIconWrapper>

              <div>
                <Typography variant="h2" color={theme.colors.darkBlue} weight="bold">
                  {t('parts_order') as string}
                </Typography>
                <OrderIconWrapper customHeight="0.875rem" customWidth="4.5rem" marginLeft="0">
                  <OrderIcon src={JBTSupport} />
                </OrderIconWrapper>
                <br />
                If you need assistance while placing your order, contact one of our team by phone or
                email.
              </div>
              <div>Please quote your purchase order number.</div>
            </OrderSupportColumn>
            <OrderItemsContainer>
              <AddressCardsContainer>
                <POAddressCard>
                  <Typography variant="h4" color={theme.colors.darkBlue} weight="bold">
                    <OrderIconWrapper>
                      <OrderIcon src={BillToIcon} />
                    </OrderIconWrapper>
                    {t('bill_to') as string}
                  </Typography>
                  <POAddressText>{billToAddress}</POAddressText>
                </POAddressCard>
                <POAddressCard>
                  <Typography variant="h4" color={theme.colors.darkBlue} weight="bold">
                    <OrderIconWrapper>
                      <OrderIcon src={ShipToIcon} />
                    </OrderIconWrapper>
                    {t('ship_to') as string}
                  </Typography>
                  <POAddressText>{shipToAddress}</POAddressText>
                </POAddressCard>
                <POAddressCard>
                  <Typography variant="h4" color={theme.colors.darkBlue} weight="bold">
                    <OrderIconWrapper>
                      <OrderIcon src={VendorIcon} />
                    </OrderIconWrapper>
                    {t('vendor') as string}
                  </Typography>
                  <POAddressText>{vendorAddress}</POAddressText>
                </POAddressCard>
              </AddressCardsContainer>
              <POHeaderContainer>
                <POHeaderTextContainer>
                  <Typography variant="body1" color={theme.colors.lightGrey8} weight="bold">
                    <OrderIconWrapper>
                      <OrderIcon src={CreatorIcon} />
                    </OrderIconWrapper>
                    {t('creator') as string}
                  </Typography>
                  <POHeaderText>
                    <Typography variant="body1" color={theme.colors.lightGrey8} weight="bold">
                      {poCreator}
                    </Typography>
                  </POHeaderText>
                </POHeaderTextContainer>
                <POHeaderTextContainer>
                  <Typography variant="body1" color={theme.colors.lightGrey8} weight="bold">
                    <OrderIconWrapper>
                      <OrderIcon src={DateIcon} />
                    </OrderIconWrapper>
                    {t('date') as string}
                  </Typography>
                  <POHeaderText>
                    <Typography variant="body1" color={theme.colors.lightGrey8} weight="bold">
                      {poDate}
                    </Typography>
                  </POHeaderText>
                </POHeaderTextContainer>
              </POHeaderContainer>
              <POItemsTableContainer>
                <POItemsList items={poItems as SFOrderItem[]} />
              </POItemsTableContainer>
              <Totalbox>
                <TotalText>
                  <div style={{ fontWeight: '400' }}>{t('total' as string)}</div>
                  {poItemsTotal}
                </TotalText>
              </Totalbox>
            </OrderItemsContainer>
          </OrderModalBody>
          <OrderModalFooter>
            <OrderFooterTextWrapper>
              <Typography color={theme.colors.darkGrey} size="0.7rem">
                <DetailTextLink href="https://www.jbtc.com/privacy-and-cookie-policy/">
                  Privacy Notice
                </DetailTextLink>{' '}
                &nbsp;and&nbsp;
                <DetailTextLink href="https://www.jbtc.com/terms-of-use/">
                  Conditions of Use
                </DetailTextLink>
                . Unless otherwise noted, items sold by jbtc.com are subject to sales tax in select
                states in accordance with the applicable laws of that state. Learn more about tax
                and seller information.
              </Typography>
            </OrderFooterTextWrapper>
            <ModalButtonsContainer>
              <Button
                variant="thin"
                height="3rem"
                onClick={downloadOrderDetails}
                bgColor={theme.colors.primaryBlue4}
                icon={<OrderIcon src={PDFButtonIcon} />}
              >
                {t('download_parts_order') as string}
              </Button>
              <Button
                onClick={() => {
                  hideOrderModal();
                }}
                bgColor={theme.colors.mediumBlue}
                variant="primary"
                height="3rem"
              >
                {t('close') as string}
              </Button>
            </ModalButtonsContainer>
          </OrderModalFooter>
        </Modal>

        <OrderTableWrapper>
          <NewBaseTable
            newTableData={sfOrders as SFOrderHistory[]}
            columnConfigs={generateColumnConfigs()}
            sortState={defaultSortState}
            enableFilter={true}
            isShowGlobalSearch={true}
            isShowColumnOptions={true}
            handleFilterRequest={updateTableOnFilterChange}
            isDataLoading={isDataFetching}
          />
        </OrderTableWrapper>
        <Pagination
          onPageChange={(page) => setCurrentPage(page - 1)}
          itemsPerPage={ITEMS_PER_PAGE}
          numItems={orders?.totalRecords}
          currentPage={currentPage + 1}
        />
        {/* <OrderMapWrapper> // do not delete, temporarily deprioritized.
        <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string} render={render}>
          <Map
            mapTypeControl={mapTypeControl ? mapTypeControl : false}
            center={center}
            zoom={2}
            style={{ flexGrow: '1', height: '100%' }}
          >
            <MapMarker key={'key-70 W Madison St #4400, Chicago, IL 60602'} position={center} />
          </Map>
        </Wrapper>
      </OrderMapWrapper> */}
      </OrdersContainer>
    </>
  );
};

export default NewSFOrdersTable;
