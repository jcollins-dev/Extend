import React from 'react';
import Typography from 'components/Typography/Typography';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetAccountSalesforceQuery } from 'api';
import { Loader } from 'components';

const Customer = styled.div<{ isSelected?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.625rem;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.background.background5 : 'transparent'};

  p {
    margin: 0;
    padding: 0;
    color: ${({ isSelected, theme }) =>
      isSelected ? theme.colors.text.white : theme.colors.text.black};
  }
`;

const Container = styled.div`
  max-height: 36rem;
  overflow: auto;
`;

const Customers = ({
  customerToSearch,
  selectedCustomerId,
  setSelectedCustomerId,
  setSelectedCustomerName
}: {
  customerToSearch: string | undefined;
  selectedCustomerId: string | undefined;
  setSelectedCustomerId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedCustomerName: React.Dispatch<React.SetStateAction<string | undefined>>;
}): JSX.Element => {
  const { data: customersData, isFetching } = useGetAccountSalesforceQuery(
    customerToSearch === ''
      ? skipToken
      : {
          name: customerToSearch
        }
  );

  return (
    // foreach
    <Container>
      {isFetching ? (
        <Loader margin="auto" />
      ) : (
        customersData &&
        customerToSearch &&
        customersData.map((customer) => {
          return (
            <Customer
              isSelected={customer.id === selectedCustomerId}
              key={customer.id}
              onClick={() => {
                setSelectedCustomerName(customer.name);
                setSelectedCustomerId(customer.id);
              }}
            >
              <Typography variant="body1">{customer.name}</Typography>
              <>
                {customer.id === selectedCustomerId ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon style={{ fontSize: '1rem' }} icon={faArrowRight} />
                )}
              </>
            </Customer>
          );
        })
      )}
    </Container>
  );
};

export default Customers;
