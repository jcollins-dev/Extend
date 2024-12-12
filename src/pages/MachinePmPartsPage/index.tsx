// 3rd party
import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';

// API
import { useGetMachineByIdQuery, useGetProductsByMachineIdQuery } from 'api';

// Components
import { Button, PmPartsTable, Typography, Pagination } from 'components';

// Constants
import { partsFieldThresholds } from 'constants/testdata';
import { PAGE_LENGTH } from 'constants/search';

// Types
import { InputChangeHandlerWithIndex, PreventativeMaintenancePart } from 'types';
import { Product } from 'types/parts';

// Helpers
import { currency } from 'helpers';

// Custom hooks section
import { usePaginatedQueryOffset } from 'hooks';

// Styling
const Root = styled.article``;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BackButtonIcon = styled.div`
  cursor: pointer;
  margin-right: 0.75rem;
  font-size: 1.375rem;
`;

const Cart = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: end;
  padding-right: 0.4375rem;
`;

const Content = styled.article``;

const SelectAllControl = styled.div`
  cursor: pointer;
  color: ${(props) => props.theme.colors.buttons.primary.fill};
  font-size: ${(props) => props.theme.typography.components.tableHeader.size};
  font-weight: ${(props) => props.theme.typography.components.tableHeader.weight};
  line-height: ${(props) => props.theme.typography.components.tableHeader.lineHeight};
  font-family: ${(props) => props.theme.typography.family};
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.25rem;
`;

const SubTotal = styled.div`
  font-size: 0.875rem;
  line-height: 1rem;
  display: flex;
  margin-left: 1.75rem;
`;

const ButtonContainer = styled.div`
  width: 10.6875rem;
  height: 2.5rem;

  button {
    margin: 0;
  }
`;

const ITEMS_PER_PAGE = PAGE_LENGTH.SMALL;

const MachinePmPartsPage = (): ReactElement => {
  const history = useHistory();
  const { machineId } = useParams<{ machineId: string }>();
  const { onPageChange, pageNumber } = usePaginatedQueryOffset();

  // Get the machine's data
  const {
    data: machine,
    //error: machineError,
    isLoading: machineIsLoading
  } = useGetMachineByIdQuery(machineId ?? skipToken);

  console.warn('machine id: ', machineId);
  console.warn('machine: ', machine);

  // Get the machine's PM parts data
  // TODO - use a different API call to get the PM parts, not just parts
  // TODO - when fully connected to backend, use partsIsLoading
  // TODO - work with design to determine what should happen on error
  const {
    data: productsByMachineIdResult,
    // error: partsError,
    isLoading: partsIsLoading
  } = useGetProductsByMachineIdQuery({
    id: machineId,
    limit: ITEMS_PER_PAGE,
    offset: pageNumber
  });

  // TODO - remove the testPmParts when this is fully connected
  let pmParts: PreventativeMaintenancePart[] = [];
  const parts = (productsByMachineIdResult?.items as Product[]) ?? [];
  if (parts) pmParts = parts;

  const [localParts, updateLocalParts] = useState<PreventativeMaintenancePart[]>(
    pmParts.map((part) => {
      return { ...part, selected: false };
    })
  );

  // If the parts list is updated (i.e. the request is completed after component load)
  useEffect(() => {
    // Reset the checks with the new number of parts
    updateLocalParts(
      pmParts.map((part) => {
        return { ...part, selected: false };
      })
    );
  }, [parts]);

  const checkHandler = (id: string) => {
    updateLocalParts(
      localParts.map((part) =>
        typeof part.selected === 'undefined'
          ? { ...part, selected: true }
          : part.id === id
          ? { ...part, selected: !part.selected }
          : { ...part }
      )
    );
  };

  const quantityHandler: InputChangeHandlerWithIndex = (event, id) => {
    // Make sure it is a number and that it is greater than -1
    let newQuantity = -1;
    if (!isNaN(parseInt(event.target.value as string)))
      newQuantity = parseInt(event.target.value as string);
    if (newQuantity < 0) newQuantity = 0;
    updateLocalParts(
      localParts.map((part) => (part.id === id ? { ...part, quantity: newQuantity } : part))
    );
  };

  // Determine the price to be shown
  const selectionPrice =
    localParts.length > 0
      ? localParts
          .map((part) => (part.selected && part.quantity ? (part.price || 0) * part.quantity : 0))
          .reduce((prevPrice, currentPrice) => prevPrice + currentPrice)
      : 0;

  // Create the control component for (de)selecting all
  const selectAllControl = (
    <SelectAllControl
      role="button"
      onClick={() => {
        const updatedParts = localParts.some((part) => !!part.selected)
          ? localParts.map((part) => {
              return { ...part, selected: false };
            })
          : localParts.map((part) => {
              return { ...part, selected: true };
            });
        updateLocalParts(updatedParts);
      }}
    >
      {localParts.some((part) => part.selected) ? 'Deselect All' : 'Select All'}
    </SelectAllControl>
  );

  return (
    <Root>
      <Header>
        <BackButtonIcon role="link" onClick={() => history.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </BackButtonIcon>
        <Typography variant="h2">
          {machineIsLoading
            ? 'Loading machine PM data'
            : machine
            ? `${machine.description} - PM Parts`
            : 'Test Machine - PM Parts'}
        </Typography>
        <Cart>
          <FontAwesomeIcon icon={faShoppingCart} />
        </Cart>
      </Header>
      <Content>
        <PmPartsTable
          data={localParts}
          leadTimeThreshold={partsFieldThresholds.leadTime}
          stockThreshold={partsFieldThresholds.stock}
          selectionHandler={checkHandler}
          quantityInputChangeHandler={quantityHandler}
          selectAllControl={selectAllControl}
          isDataLoading={partsIsLoading}
        />
        <Pagination
          numItems={productsByMachineIdResult?.total}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={onPageChange}
          currentPage={pageNumber}
        />
      </Content>
      <Footer>
        <SubTotal>
          <Typography color="#5D6A86">Subtotal: &nbsp;</Typography>
          <Typography color="bluehighlight">{currency(selectionPrice)}</Typography>
        </SubTotal>
        <ButtonContainer>
          <Button variant="primary">Add selected to cart</Button>
        </ButtonContainer>
      </Footer>
    </Root>
  );
};

export default MachinePmPartsPage;
