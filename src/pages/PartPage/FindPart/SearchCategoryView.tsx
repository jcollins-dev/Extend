// 3rd party libs
import React, { useState } from 'react';
import styled from 'styled-components';
import { skipToken } from '@reduxjs/toolkit/dist/query';

// Api
import { useGetProductsQuery, useGetProductTagsQuery } from 'api';

// Components
import { Typography, Loader, CatalogCard, Pagination, MachinePartsTable } from 'components';

// Routes
import { JBTRoutes } from 'constants/routes';
import { Product, ProductTag } from 'types/parts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

// Hooks
import { usePaginatedQueryOffset } from 'hooks';

// Constants
import { PAGE_LENGTH } from 'constants/search';
const ITEMS_PER_PAGE = PAGE_LENGTH.SMALL;

interface Props {
  machineId: string;
  businessUnitId: string;
}

const MachinePartsTableContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductTagsContainer = styled.div`
  padding: 1.25rem;
`;

const ProductTagsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
`;

const ProductTagCard = styled.div`
  width: 18.333125rem;
  height: 6.5rem;
  background-color: ${(props) => props.theme.colors.background.background1};
  border-radius: 0.625rem;
  border: ${(props) => props.theme.colors.borders.border01.border};
  img {
    height: 3rem !important;
  }
`;

const BackToCategories = styled(Typography)`
  cursor: pointer;
`;

const SearchCategoryView = ({ machineId }: Props): JSX.Element => {
  const { onPageChange, pageNumber } = usePaginatedQueryOffset();
  const [showProductTagItems, setShowProductTagItems] = useState(false);
  const [selectedProductTag, setSelectedProductTag] = useState<ProductTag>();
  const {
    data: productTagsResult,
    error: productTagsError,
    isFetching: productTagsAreLoading
  } = useGetProductTagsQuery({
    machineId: machineId
  });

  const { data: productsForTag, isFetching: productsForTagAreLoading } = useGetProductsQuery(
    selectedProductTag && selectedProductTag.id
      ? {
          productTagIds: [selectedProductTag.id],
          machineUuid: machineId,
          limit: ITEMS_PER_PAGE,
          offset: pageNumber
        }
      : skipToken
  );
  const productTagClickHandler = (productTag: ProductTag) => {
    setShowProductTagItems(true);
    setSelectedProductTag(productTag);
  };

  let productTagsBody: React.ReactNode = null;
  if (productTagsAreLoading) {
    productTagsBody = <Loader />;
  } else if (!productTagsResult && productTagsError) {
    productTagsBody = <Typography>Failed to load product categories data</Typography>;
  } else if (productTagsResult && !showProductTagItems) {
    productTagsBody = productTagsResult.map((productTag, i) => {
      return (
        <ProductTagCard key={`productTag-${i}`} onClick={() => productTagClickHandler(productTag)}>
          {/* TODO: remove the description parsing in favor of an actual name */}
          <CatalogCard
            name={productTag.tagName}
            link={JBTRoutes.partsMachine.replace(':machineId', machineId)}
            img="/assets/imgs/icons/ellipse.png"
            direction="row"
          />
        </ProductTagCard>
      );
    });
  } else if (productTagsResult && showProductTagItems) {
    return (productTagsBody = (
      <MachinePartsTableContainer>
        <BackToCategories
          onClick={() => setShowProductTagItems(false)}
          size="0.8125rem"
          color="mediumBlue"
          weight="bold"
        >
          <FontAwesomeIcon icon={faChevronLeft} /> Back to categories
        </BackToCategories>
        <MachinePartsTable
          data={
            !productsForTagAreLoading && productsForTag?.items
              ? (productsForTag?.items as Product[])
              : []
          }
          showHeader={false}
          showSearch={false}
          isDataLoading={productsForTagAreLoading}
          machineId={machineId}
        />
        <Pagination
          numItems={productsForTag?.total}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={onPageChange}
          currentPage={pageNumber}
        />
      </MachinePartsTableContainer>
    ));
  } else {
    // TODO: handle empty
  }

  return (
    <ProductTagsContainer>
      <ProductTagsGrid>{productTagsBody}</ProductTagsGrid>
    </ProductTagsContainer>
  );
};

export default SearchCategoryView;
