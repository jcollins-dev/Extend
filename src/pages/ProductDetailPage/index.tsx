// 3rd party libraries
import React, { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useTranslation } from 'react-i18next';

// Hooks & Providers
import { useQueryParams } from 'hooks';
import { useLanguage } from 'providers';

// Components
import { Loader, PageHeader, Typography } from 'components';
import ProductDetail from './ProductDetail';

// Helpers
import { getProductDescription } from 'helpers';

// API
import { useGetMachineByIdQuery, useGetProductByIdQuery } from 'api';

// Types
import { BreadCrumb } from 'components/Breadcrumbs';

// Styling
const Container = styled.div`
  padding: 1.75rem 1.5rem;
`;

export default function ProductDetailPage(): ReactElement {
  const { productId } = useParams<{ productId: string }>();
  const query = useQueryParams();
  const { t } = useTranslation(['fpns']);
  const { languageId } = useLanguage();
  // If directed to this page from a machine view (diagram, table)
  const machineId = query.get('machineId') || undefined;
  // If directed to this page with currency details
  const priceUnit = query.get('priceUnit') || undefined;

  const {
    data: product,
    error: productError,
    isLoading: productIsLoading
  } = useGetProductByIdQuery({
    id: productId,
    machineUuid: machineId,
    priceUnit: priceUnit
  });

  const {
    data: machine
    // TODO - add warning and loading for machine info
    /*error: machineError,
    isLoading: machineIsLoading*/
  } = useGetMachineByIdQuery(machineId ? machineId : skipToken);

  const content = product ? (
    <ProductDetail product={product} machine={machine} />
  ) : productIsLoading ? (
    <Loader />
  ) : productError ? (
    <Typography>{t('error_product_details')}</Typography>
  ) : (
    <Typography>{t('error_product')}</Typography>
  );

  const pageHeading = product ? getProductDescription(product, languageId) : t('loading_product');
  const partBreadcrumbs: BreadCrumb[] = [
    { label: t('parts_search'), link: 'back' },
    { label: pageHeading }
  ];

  return (
    <>
      <PageHeader heading={pageHeading} breadcrumbs={partBreadcrumbs} onlyBreadcrumbs />
      <Container>{content}</Container>
    </>
  );
}
