// 3rd party
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import wishlist from '../../img/wishlist.svg';

// Constants
// API
import { useGetSavedProductsQuery, useGetProductsWithSpecifiedCurrenciesQuery } from 'api';

// Types
import { ModalSize } from 'types';
import { Product, SavedPart } from 'types/parts';

// Components
import { Badge, Modal, Typography } from 'components';
import { skipToken } from '@reduxjs/toolkit/query';
import SavedProductTable from '../SavedProductTable/SavedProductTable';

const ImageWishlist = styled.div`
  cursor: pointer;
  font-size: 15px;
  color: ${(props) => props.theme.colors.darkGrey};
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: #f1f3f4;
  padding: 3.3125rem 1.625rem 1.5rem 2.375rem;
`;

const SavedProductList = (): ReactElement => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { t } = useTranslation(['fpns']);
  const {
    data: savedProducts,
    refetch: refreshSavedProductsList,
    isFetching: productsAreLoading
  } = useGetSavedProductsQuery();

  const { data: products } = useGetProductsWithSpecifiedCurrenciesQuery(
    savedProducts && savedProducts.length > 0
      ? savedProducts.map((savedProduct) => ({
          id: savedProduct.productId,
          priceUnit: savedProduct.priceUnit
        }))
      : skipToken
  );

  const savedParts: SavedPart[] = [];
  savedProducts?.forEach((p) => {
    products?.forEach((item: Product) => {
      if (item && item.id === p.productId) {
        const sp: SavedPart = {
          stock: item.stock,
          description: item.description,
          leadTime: item.leadTime,
          price: item.price,
          custPrice: item.custPrice,
          id: item.id,
          quantity: p.quantity,
          sku: item.sku,
          priceUnit: item.priceUnit,
          isPurchasable: item.isPurchasable
        };
        savedParts.push(sp);
      }
    });
  });
  return (
    <>
      <ImageWishlist>
        <div data-testid="cart-icon" onClick={() => setShowModal(true)} style={{ paddingTop: 4 }}>
          <img src={wishlist} alt="wishlist" />
          {savedParts.length > 0 && <Badge style={{ top: 0 }}>{savedParts.length}</Badge>}
        </div>
      </ImageWishlist>

      <Modal
        visible={showModal}
        size={ModalSize.LARGE}
        onClose={() => setShowModal(false)}
        title={
          <ModalHeader>
            {
              <Typography as="h3" mb={2} size="1.125rem" weight="bold">
                {t('saved_product_list')}
              </Typography>
            }
          </ModalHeader>
        }
      >
        <SavedProductTable
          data={(savedParts as SavedPart[]) || []}
          onRefresh={refreshSavedProductsList}
          isDataLoading={productsAreLoading}
        />
      </Modal>
    </>
  );
};

export default SavedProductList;
