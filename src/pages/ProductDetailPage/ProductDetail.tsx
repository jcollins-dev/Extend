// 3rd party libraries
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

// State management
import { cartActions } from 'actions';

// Constants
import { sfEnabled } from 'constants/featureFlags';
import { UNIVERSAL_PRODUCTS_KEY } from 'constants/cart';

// Components
import {
  Button,
  CustomerPrice,
  Gallery,
  Input,
  StockIndicator,
  Loader,
  Typography
} from 'components';

// Subcomponents
import {
  CompatibleLabel,
  DiscontinuedLabel,
  OrderInputs,
  PartDataErrorContact,
  PartInfo,
  PartInfoContainer,
  PurchaseButtons,
  QuantityContainer
} from './PlaceOrder';

// Helpers
import { getProductDescription } from 'helpers';

// Providers
import { useLanguage } from 'providers';

// Types
import { SavePartIcon } from 'icons';
import { Asset, Machine, ResourceType, User } from 'types';
import { Product } from 'types/parts';
import { CartState } from 'types/parts/cart';

// Constants
import { JBTRoutes } from 'constants/routes';
import theme from 'themes';
import { AnalyticsCategories, ECommerceAnalyticEventActions } from 'constants/analytics';
import { useAddProductToCartMutation } from 'api';
import { useCart, useUser } from 'selectors';
import { generateAnalyticsEvent } from 'helpers/analytics';

// API
import { useSavedProductMutation } from 'api';

const TopLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 0;
`;

const GalleryContainer = styled.div`
  max-width: 50%;
  flex: 0;
  margin-right: 2rem;
`;

const ProductDetailRootContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const SavedProduct = styled.div`
  max-width: 50%;
  flex: 0;
  margin-right: 2rem;
  cursor: pointer;
  display: inline;
  padding-left: 0.75rem;
`;

// Component properties
interface Props {
  product: Product;
  machine?: Machine;
}

export default function ProductDetail({ product, machine }: Props): ReactElement {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState<number>(1);
  const { t } = useTranslation(['fpns']);
  const { languageId } = useLanguage();
  const user = useUser() as User;
  const cart = useCart() as CartState;
  const [addProductToCart, addCartResult] = useAddProductToCartMutation();
  const [savedProductInput] = useSavedProductMutation();

  // Make sure we only show contact information once, even if there are many errors in the data
  // We show contact info for the first error encountered, and not for the subsequent ones
  const showContact = {
    price: !!product.priceError,
    stock: !!(!product.priceError && product.stockError),
    leadtime: !!(!product.priceError && !product.stockError && product.leadTimeError)
  };

  const addToCart = (product: Product) => {
    try {
      if (sfEnabled()) {
        addProductToCart({
          // If the machine is given, use its plant ID, in case user has multiple plants
          accountId: machine ? machine.plantId : user.plants[0],
          cart: cart,
          product: product,
          productId: product.sfProductId as string,
          quantity: 1,
          machineId: machine?.id as string,
          machineDescription:
            machine === undefined || machine?.id === UNIVERSAL_PRODUCTS_KEY
              ? UNIVERSAL_PRODUCTS_KEY
              : machine?.description
        });
      } else {
        dispatch({
          type: cartActions.ADD_TO_CART,
          item: product,
          quantity: quantity,
          groupId: machine?.id as string,
          groupDescription:
            machine === undefined || machine?.id === UNIVERSAL_PRODUCTS_KEY
              ? UNIVERSAL_PRODUCTS_KEY
              : machine?.description
        });
      }
      generateAnalyticsEvent({
        category: AnalyticsCategories.ECOMMERCE,
        action: ECommerceAnalyticEventActions.ADD_TO_CART_FROM_PDP
      });
    } catch (error) {
      console.warn('Add to cart failed! Error:', error);
      toast(t('error_add_to_cart', { item: product.stockCode || product.sku, ns: 'fpns' }));
    }
  };

  const getCompatibility = (product: Product) => {
    if (product.compatibility) {
      return (
        <>
          <CompatibleLabel>{t('compatible_with')}</CompatibleLabel>{' '}
          {product.compatibility?.length &&
            product.compatibility.map((m) => m.description).join(', ')}
        </>
      );
    } else if (machine) {
      <>
        <CompatibleLabel>{t('compatible_with')}</CompatibleLabel>{' '}
        {machine ? machine.description : '-'}
      </>;
    }
    return null;
  };

  return (
    <ProductDetailRootContainer>
      {addCartResult.isLoading && <Loader />}
      {!addCartResult.isLoading && (
        <>
          <TopLayout>
            <GalleryContainer>
              <Gallery
                images={
                  product?.assets && product.assets.length
                    ? (product?.assets as Asset[])
                        .filter((asset) => {
                          return asset.assetType === ResourceType.ProductImage;
                        })
                        .map((asset) => asset.url)
                    : ['/assets/placeholder/part.svg']
                }
              />
            </GalleryContainer>
            <PartInfoContainer>
              <PartInfo>
                <Typography
                  as="span"
                  style={{
                    backgroundColor: theme.colors.primaryBlue4,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.4rem'
                  }}
                  mb="0.5rem"
                >
                  <Typography
                    as="span"
                    style={{ color: theme.colors.mediumBlue, fontSize: '1rem' }}
                  >{`JBT #${product.stockCode || product.sku}`}</Typography>
                </Typography>
                <SavedProduct
                  onClick={() => {
                    savedProductInput([
                      {
                        productId: product.id,
                        quantity: quantity,
                        priceUnit: product.priceUnit
                      }
                    ])
                      .unwrap()
                      .then(() => {
                        toast.info(t('product_saved_successfully'));
                      })
                      .catch((error) => {
                        toast.error(error?.data?.detail);
                      });
                  }}
                >
                  {SavePartIcon()}
                </SavedProduct>
                <Typography variant="h2">{getProductDescription(product, languageId)}</Typography>
                {/* <Typography color="mediumGrey2" mb="1.25rem"> Temporarily disabled: do not remove
                  {t('customer_number')}
                  {product.customerPartId || t('na', { ns: 'common' })}
                </Typography> */}
                {product.overview && <Typography mb="1.25rem">{product.overview}</Typography>}
                {(product.compatibility || machine) && (
                  <Typography size="0.75rem" weight="bold" mb="0.5rem">
                    {getCompatibility(product)}
                  </Typography>
                )}
                {product.discontinued && (
                  <Typography size="0.75rem" mb="1.25rem">
                    <DiscontinuedLabel>{t('discontinued')}</DiscontinuedLabel>
                    {product.alternateProduct && (
                      <>
                        {' '}
                        {t('alternative')}:{' '}
                        <Link
                          to={`${JBTRoutes.partsProduct.replace(
                            ':productId',
                            product.alternateProduct.id
                          )}}`}
                        >
                          {product.alternateProduct?.description}
                        </Link>
                      </>
                    )}
                  </Typography>
                )}

                {product.priceError && product.businessUnit ? (
                  <PartDataErrorContact
                    priceError={product.priceError}
                    showContactInfo={showContact.price}
                    businessUnit={product.businessUnit}
                  />
                ) : (
                  <CustomerPrice product={product} bold={true} />
                )}

                <OrderInputs>
                  <QuantityContainer>
                    <Input
                      type="number"
                      label={t('qty', { ns: 'common' }) as string}
                      id="qty"
                      min={1}
                      variant={product.isPurchasable ? 'white' : 'disabled'}
                      value={quantity}
                      onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                        const rawQuantity =
                          evt.target.value.length < 1 ? String(0) : evt.target.value;
                        const newQuantity =
                          Math.max(parseInt(rawQuantity), 0) == 0
                            ? quantity
                            : Math.max(parseInt(rawQuantity), 0);
                        setQuantity(newQuantity);
                      }}
                    />
                  </QuantityContainer>
                </OrderInputs>
                <PurchaseButtons>
                  <Button
                    variant="primary"
                    onClick={() => {
                      addToCart(product);
                    }}
                  >
                    {t('add_to_cart')}
                  </Button>
                </PurchaseButtons>

                <StockIndicator purchasable={product} />
              </PartInfo>
            </PartInfoContainer>
          </TopLayout>
        </>
      )}
    </ProductDetailRootContainer>
  );
}
