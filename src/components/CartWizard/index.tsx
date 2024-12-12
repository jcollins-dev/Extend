// 3rd party
import React, { ReactElement, useState, useEffect } from 'react';
import { Wizard } from 'react-use-wizard';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

// Types
import { User, WizardFooterProps } from 'types';
import {
  ItemOrder,
  OrderInput,
  OrderInputWithSFFlag,
  OrderResponse,
  PriceError
} from 'types/parts';
import { CartOrderDetails, CartState } from 'types/parts/cart';

// Constants
import { defaultOrderDetails } from 'constants/forms';
import { sfEnabled } from 'constants/featureFlags';
import { UNIVERSAL_PRODUCTS_KEY } from 'constants/cart';

// Providers
import { useLanguage } from 'providers';

// Helpers
import { hasRequiredAddressDetails, hasRequiredBilleeDetails, isValidEmail } from 'helpers';

// Components
import { default as CartHeader } from './CartHeader';
import { default as CartFooter } from './CartFooter';
import { default as CartStepOne } from './CartStepOne';
import { default as CartStepTwo } from './CartStepTwo';
import { default as CartStepThree } from './CartStepThree';
import Loader from 'components/Loader';

// API
import { iopsApi } from 'api';

// State actions
import { cartActions } from 'actions';

// State selectors
import { useCart, useUser } from 'selectors';
import { generateAnalyticsEvent } from 'helpers/analytics';
import { AnalyticsCategories, ECommerceAnalyticEventActions } from 'constants/analytics';

// Header content
const stepHeaders = [
  {
    header: 'step_verify_quoting',
    description: 'step_verify_description'
  },
  {
    header: 'step_shipping_billing',
    description: 'step_shipping_billing_description'
  },
  {
    header: 'step_download_form',
    description: 'step_download_form_description'
  }
];

// Props
interface Props {
  active?: boolean;
  handleClose?: () => void;
}

const getOrderInput = (
  orderDetails: CartOrderDetails,
  cart: CartState,
  user: User,
  sfEnabled: boolean,
  lang: string,
  region: string
): OrderInput => {
  const billTo = { ...orderDetails.billee, ...orderDetails.billingAddress };
  const purchasables: ItemOrder[] = [];
  const nonPurchasables: ItemOrder[] = [];
  cart.items.forEach((item) => {
    const updatedItem: ItemOrder = {
      id: item.item.id,
      quantity: item.quantity,
      urgent: item.urgent,
      currency: item.item.priceUnit,
      machineDescription: item.groupDescription
    };
    if (item.groupId !== UNIVERSAL_PRODUCTS_KEY) {
      updatedItem.machineId = item.groupId;
    }
    if (item.item.isPurchasable) {
      purchasables.push(updatedItem);
    } else {
      nonPurchasables.push(updatedItem);
    }
  });

  const order: OrderInputWithSFFlag = {
    creator: orderDetails.creator,
    approver: orderDetails.approver,
    billTo: billTo,
    shipTo:
      !orderDetails.shipMatchBilling && orderDetails.shippingAddress
        ? { ...orderDetails.billee, ...orderDetails.shippingAddress }
        : billTo,
    orders: purchasables,
    unpurchasableItems: nonPurchasables,
    customerPoNumber: orderDetails.customerPoNumber,
    sfAccountId: user?.plants[0],
    sfCartId: cart.sfCart.cartSummary?.cartId,
    allowPartialShipments: orderDetails.allowPartialShipments,
    sfEnabled: sfEnabled,
    lang: lang,
    region: region
  };
  return order;
};

const CartWizard = ({ active, handleClose }: Props): ReactElement => {
  const dispatch = useDispatch();
  // Receiving state at the higher level to manage step progression
  const [orderDetails, updateOrderDetails] = useState<CartOrderDetails>({ ...defaultOrderDetails });
  const [orderRequest, updateOrderRequest] = useState<OrderResponse>();
  const [downloadDraftPDFLoader, setDownloadDraftPDFLoader] = useState(false);
  const [displayItemLossWarning, setDisplayItemLossWarning] = useState<boolean>(false);
  const [displayDraftQuoteWarning, setDisplayDraftQuoteWarning] = useState<boolean>(false);
  const cart = useCart() as CartState;
  const { t } = useTranslation(['fpns']);
  const { languageId, region } = useLanguage();

  const user = useUser() as User;
  useEffect(() => {
    setDisplayItemLossWarning(() => {
      return (
        cart &&
        cart.items.length > 0 &&
        cart.items.some(
          (item) =>
            !item.item.isPurchasable ||
            !item.item.price ||
            item.item.price <= 0 ||
            item.item.priceError ||
            item.item.priceError === PriceError.MISSING
        ) &&
        cart.items.some(
          (item) =>
            (item.item.isPurchasable === undefined || item.item.isPurchasable) &&
            (!item.item.priceError || item.item.priceError === PriceError.NONE) &&
            item.item.price &&
            item.item.price > 0
        )
      );
    });
    setDisplayDraftQuoteWarning(() => {
      return (
        cart &&
        cart.items.length > 0 &&
        cart.items.some(
          (item) =>
            !item.item.isPurchasable ||
            !item.item.price ||
            item.item.price <= 0 ||
            item.item.priceError ||
            item.item.priceError === PriceError.MISSING
        )
      );
    });
  }, [cart]);
  const [createOrder] = iopsApi.useCreateOrderMutation();
  const [confirmOrder] = iopsApi.useConfirmOrderMutation();
  const [draftOrderQuote] = iopsApi.useDraftOrderQuoteMutation();

  const handleUpdate = (updatedDetails: CartOrderDetails) => {
    updateOrderDetails({ ...updatedDetails });
  };

  const handleDownloadDraftPO = () => {
    setDownloadDraftPDFLoader(true);
    if (cart) {
      try {
        const order: OrderInputWithSFFlag = getOrderInput(
          orderDetails,
          cart,
          user,
          sfEnabled(),
          languageId,
          region
        );
        draftOrderQuote(order)
          .unwrap()
          .then((orderResponse) => {
            if (orderResponse && orderResponse.url) {
              saveAs(orderResponse.url, `order-quote-${orderResponse.id}.pdf`);
              setDownloadDraftPDFLoader(false);
            } else {
              console.error('Unable to download order quote pdf');
              toast.error('Unable to download order quote pdf!');
            }
          });
      } catch (err) {
        console.error(`Failed to manually validate token. Forcing logout. Error: ${err}`);
        toast.error('Unable to download order quote pdf!');
      }
    }
  };

  const stepFooters: WizardFooterProps[] = [
    {
      nextText: 'continue',
      continueCondition: () => {
        return (
          (cart &&
            cart.items.length > 0 &&
            cart.items.some(
              (item) =>
                (item.item.isPurchasable === undefined || item.item.isPurchasable) &&
                (!item.item.priceError || item.item.priceError === PriceError.NONE) &&
                item.item.price &&
                item.item.price > 0
            )) ||
          false
        );
      }
    },
    {
      nextText: 'generate_order_quote',
      prevText: 'back',
      continueCondition: () => {
        return Boolean(
          hasRequiredAddressDetails(orderDetails.billingAddress) &&
            (orderDetails.shipMatchBilling ||
              (orderDetails.shippingAddress &&
                hasRequiredAddressDetails(orderDetails.shippingAddress))) &&
            hasRequiredBilleeDetails(orderDetails.billee) &&
            orderDetails.creator &&
            isValidEmail(orderDetails.creator) &&
            (orderDetails.approver === '' || isValidEmail(orderDetails.approver)) &&
            orderDetails.customerPoNumber
        );
      },
      nextAction: async () => {
        if (cart) {
          const order: OrderInputWithSFFlag = getOrderInput(
            orderDetails,
            cart,
            user,
            sfEnabled(),
            languageId,
            region
          );
          createOrder(order)
            .unwrap()
            .then(async (orderResponse) => {
              if (orderResponse && orderResponse.url) {
                generateAnalyticsEvent({
                  category: AnalyticsCategories.ECOMMERCE,
                  action: ECommerceAnalyticEventActions.ORDER_QUOTE_GENERATED,
                  label: orderResponse.id
                });
                // Save the response to show PDF later
                updateOrderRequest({ ...orderResponse });
                // Confirm the order
                await confirmOrder({
                  id: orderResponse.id,
                  email: orderDetails.creator,
                  status: true,
                  sfPoId: orderResponse.sfPoId,
                  sfEnabled: sfEnabled()
                }).unwrap();
                dispatch({
                  type: cartActions.EMPTY_CART
                });
              } else {
                // TODO - show an error message to user
                toast(t('error_order_request'));
                updateOrderRequest(undefined);
              }
            })
            .catch((error) => {
              // TODO - show an error message to user
              console.warn('Order request error: ', error);
              toast(t('error_order_request'));
              updateOrderRequest(undefined);
            });
        }
      }
    },
    {
      nextText: 'download_pdf',
      prevText: 'back',
      nextAction: () => {
        if (orderRequest) {
          saveAs(orderRequest.url, `order-quote-${orderRequest.id}.pdf`);
        }
        if (handleClose) {
          handleClose();
        }
      }
    }
  ];
  return (
    <>
      {active && (
        <Wizard
          header={
            <CartHeader
              stepHeaders={stepHeaders}
              displayItemLossWarning={displayItemLossWarning}
              displayDraftQuoteWarning={displayDraftQuoteWarning}
            />
          }
          footer={
            <CartFooter stepFooters={stepFooters} onDownloadDraftPO={handleDownloadDraftPO} />
          }
        >
          {downloadDraftPDFLoader && <Loader />}
          <CartStepOne handleClose={handleClose} />
          <CartStepTwo orderDetails={orderDetails} handleUpdate={handleUpdate} />
          <CartStepThree
            orderId={active ? orderRequest?.id : undefined}
            orderUrl={active ? orderRequest?.url : undefined}
          />
        </Wizard>
      )}
    </>
  );
};

CartWizard.defaultProps = {
  active: true
};
export default CartWizard;
