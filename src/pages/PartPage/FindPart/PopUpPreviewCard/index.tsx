// 3rd party
import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useTranslation } from 'react-i18next';

// State management
import { cartActions } from 'actions';

// Types
import { Bubble, User } from 'types';
import { Part, Product } from 'types/parts';
import { CartState } from 'types/parts/cart';

// Constants
import { sfEnabled } from 'constants/featureFlags';
import { UNIVERSAL_PRODUCTS_KEY } from 'constants/cart';

// Components
import { Button, Loader, Typography, StockIndicator, CustomerPrice } from 'components';

// Providers
import { useLanguage } from 'providers';

// API
import { useAddProductToCartMutation, useGetPartsByIdsMutation, useGetMachineByIdQuery } from 'api';

// Constants
import { AnalyticsCategories, ECommerceAnalyticEventActions } from 'constants/analytics';
import { JBTRoutes } from 'constants/routes';

// Helpers
import { determinePartNameToShow, truncatePartName } from 'helpers/part';
import AssemblyInfoSection from '../assemblies/AssemblyInfoSection';
import { PreviewCardAddToCart } from './PreviewCardAddToCart';
import { PreviewCardDiscontinuedPart } from './PreviewCardDiscontinuedPart';
import { PreviewCardPartDescription } from './PreviewCardPartDescription';
import { useCart, useUser } from 'selectors';
import { generateAnalyticsEvent } from 'helpers/analytics';

interface PopUpPreviewCardProps {
  part: Part | undefined;
  show: boolean;
  // technically there's a more specific type that React gives us, but this is sufficient
  setShowFunction: (show: boolean) => void;
  top?: number;
  left?: number;
  marker?: Bubble;
  onClickAssemblySubPart?: (marker: Bubble | undefined) => void;
}

export const TextContainer = styled(Typography)`
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  margin-left: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.4rem;
  flex-grow: 1;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin-top: 1rem;
  justify-content: space-between;
  min-width: 17.25rem;
`;

const MoreDetailsButton = styled(Button)`
  margin-bottom: 0.5rem;
`;

const ButtonLink = styled(Link)`
  text-decoration: none;
`;

const DetailSection = styled.div`
  padding: 1.25rem;
`;

function determinePartImageURL(part: Part | undefined): string {
  if (part && part.assets && part.assets.length > 0 && part.assets[0].url) {
    return part.assets[0].url;
  }
  return '/assets/placeholder/part.svg';
}

function getFinalPart(
  part: Part | undefined,
  alternatePartsIsFetching: boolean,
  alternateParts: Part[] | undefined
) {
  const alternatePart = alternateParts ? alternateParts[0] : part;
  return part?.alternateSku && !alternatePartsIsFetching ? alternatePart : part;
}

function getMoreDetailsLink(finalPart: Part | undefined) {
  return finalPart && finalPart.productId && finalPart.machineId
    ? `${JBTRoutes.partsProduct.replace(':productId', finalPart.productId)}?machineId=${
        finalPart.machineId
      }&priceUnit=${finalPart.priceUnit}`
    : undefined;
}

export default function PopUpPreviewCard({
  part,
  marker,
  setShowFunction,
  onClickAssemblySubPart
}: PopUpPreviewCardProps): ReactElement {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState<number>(1);
  const { t } = useTranslation(['fpns']);
  const { languageId } = useLanguage();
  const partDisplayName = truncatePartName(
    determinePartNameToShow(part, marker, languageId, t),
    32
  );
  const [alternateParts, setAlternateParts] = useState<Part[]>();

  const [triggerAlternateParts, { isLoading: alternatePartsIsFetching }] =
    useGetPartsByIdsMutation();

  useEffect(() => {
    if (part?.alternateSku && !alternatePartsIsFetching) {
      triggerAlternateParts({ sku: part.alternateSku, machineId: part.machineId })
        .unwrap()
        .then((value: Part[]) => setAlternateParts(value));
    }
  }, [part, alternatePartsIsFetching]);

  const finalPart = getFinalPart(part, alternatePartsIsFetching, alternateParts);
  const partImageURL = determinePartImageURL(finalPart);
  const finalPartDisplayName = truncatePartName(
    determinePartNameToShow(finalPart, marker, languageId, t),
    32
  );
  const isPurchasable = finalPart && finalPart.isPurchasable && finalPart.productId;
  const isShowDetail = !part?.isAssembly || (part.isAssembly && part.isPurchasable);

  // Get the machine so we can retrieve the plant ID (i.e. the SF account id)
  const { data: machine } = useGetMachineByIdQuery(
    part && part.machineId ? part.machineId : skipToken
  );

  const handleAddToCart = (quantity: number) => {
    return (purchasable: Part) => {
      const productFromPart: Product = {
        ...purchasable,
        id: purchasable.isPurchasable ? (purchasable.productId as string) : purchasable.id
      };
      try {
        if (sfEnabled()) {
          addProductToCart({
            // Use the machine's plant ID in case the user has access to multiple plants
            accountId: machine ? machine.plantId : user.plants[0],
            cart: cart,
            product: productFromPart,
            productId: productFromPart.sfProductId as string,
            quantity: quantity,
            machineId: purchasable.machineId as string,
            machineDescription:
              machine === undefined || purchasable.machineId === UNIVERSAL_PRODUCTS_KEY
                ? UNIVERSAL_PRODUCTS_KEY
                : machine?.description
          });
        } else {
          dispatch({
            type: cartActions.ADD_TO_CART,
            item: productFromPart,
            quantity: quantity,
            groupId: purchasable.machineId as string,
            groupDescription:
              machine === undefined || purchasable.machineId === UNIVERSAL_PRODUCTS_KEY
                ? UNIVERSAL_PRODUCTS_KEY
                : machine?.description
          });
        }
        setQuantity(1);
        generateAnalyticsEvent({
          category: AnalyticsCategories.ECOMMERCE,
          action: ECommerceAnalyticEventActions.ADD_TO_CART_FROM_BUBBLE_POPUP
        });
      } catch (error) {
        console.warn('Add to cart failed! Error:', error);
        toast(t('error_add_to_cart'));
      }
      // }
    };
  };

  useEffect(() => {
    // This useEffect will set the quantity to default value 1.
    setQuantity(1);
  }, [part]);

  useEffect(() => {
    // This  useEffect is used for capturing the event followed by hiding the popup when we click on back button of browser.
    window.onpopstate = () => setShowFunction(false);
  });

  const user = useUser() as User;
  const cart = useCart() as CartState;
  const [addProductToCart, addCartResult] = useAddProductToCartMutation();
  const addToCart = handleAddToCart(quantity);
  const moreDetailsLink = getMoreDetailsLink(finalPart);

  return (
    <>
      {finalPart && (
        <>
          {part && (
            <>
              {part.isAssembly && (
                <AssemblyInfoSection
                  title={finalPartDisplayName}
                  onClickButton={() => {
                    if (onClickAssemblySubPart) {
                      onClickAssemblySubPart(marker);
                    }
                  }}
                />
              )}

              {isShowDetail && (
                <DetailSection>
                  {part.alternateSku && PreviewCardDiscontinuedPart(part, partDisplayName)}
                  {part.alternateSku && alternatePartsIsFetching && <Loader />}
                  {(!part.alternateSku || !alternatePartsIsFetching) && (
                    <>
                      {PreviewCardPartDescription(
                        part,
                        partImageURL,
                        alternatePartsIsFetching,
                        finalPart,
                        finalPartDisplayName
                      )}
                      {/* <Typography>Temporarily disabled: do not remove
                        {t('customer_number')}{' '}
                        {finalPart.customerPartId || t('na', { ns: 'common' })}
                      </Typography> */}
                      {/* removed for now pending Andrew wanting them back */}
                      {/* <Typography variant='body2'>
                  {part.description && part.description !== label ? part.description : 'No description available.'}
                </Typography> */}

                      <CustomerPrice product={finalPart} inline={true} />
                      {addCartResult.isLoading && <Loader />}
                      {!addCartResult.isLoading && (
                        <ButtonsContainer>
                          {moreDetailsLink && (
                            <ButtonLink to={moreDetailsLink}>
                              <MoreDetailsButton variant={'primary'} arrow={true}>
                                {t('more_details')}
                              </MoreDetailsButton>
                            </ButtonLink>
                          )}
                          {PreviewCardAddToCart(
                            isPurchasable,
                            quantity,
                            setQuantity,
                            addToCart,
                            finalPart,
                            user,
                            t
                          )}
                        </ButtonsContainer>
                      )}

                      {!addCartResult.isLoading && finalPart.isPurchasable && (
                        <StockIndicator purchasable={finalPart} />
                      )}
                    </>
                  )}
                </DetailSection>
              )}
            </>
          )}
          {!part && <Typography variant="h2">{t('unknown_part')}</Typography>}
        </>
      )}
    </>
  );
}
