import { Button, Loader, SearchInput, Typography } from 'components';
import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useGetSalesforceAccountsQuery, useGetSalesforceMachinesQuery } from 'api';
import { useWizard } from 'react-use-wizard';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { SalesforceMachine } from 'types/salesforce';
import { toast } from 'react-toastify';
import { MachineOptionSelector } from './MachineOptionSelector';
import { InfoCircleIcon } from 'icons';

const Container = styled.div`
  width: 100%;
  margin-top: 2rem;
  padding-top: 2rem;
  display: flex;
`;

const Centered = styled.div`
  width: 29.9375rem;
  margin-left: auto;
  margin-right: auto;
`;

const SearchContainer = styled.div`
  padding: 1.5rem 0 1.5rem 0;
`;

const NoticeContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.onTrackGreen5};
  padding-left: 0.625rem;
  border-radius: 0.5rem;
  height: 2.375rem;
  width: 100%;
  display: flex;
  align-items: center;
`;

const ButtonBar = styled.div`
  display: flex;
  direction: row;
  justify-content: right;
  padding-left: 0.1875rem;
  padding-right: 0.1875rem;
  margin-top: 4.375rem;
`;

const InfoText = styled(Typography)`
  padding-left: 0.1875rem;
`;

interface FetchError {
  message: string;
}

function useGetMachinesForAccountName(accountName: string | null) {
  const [error, setError] = useState<FetchError | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [machines, setMachines] = useState<SalesforceMachine[] | null>(null);

  const queryResult = useGetSalesforceAccountsQuery(accountName || skipToken);

  function resetQueries() {
    setError(null);
    setAccountId(null);
    setMachines(null);
  }

  useEffect(() => {
    if (queryResult.error) {
      setError({
        message: 'Unexpected error finding account'
      });
    }

    if (queryResult.currentData !== undefined) {
      if (queryResult.currentData.length === 0) {
        setError({ message: 'No accounts found' });
      } else {
        setAccountId(queryResult.currentData[0].accountId);
      }
    }
  }, [queryResult]);

  const queryResult2 = useGetSalesforceMachinesQuery(accountId || skipToken);

  useEffect(() => {
    if (queryResult2.error) {
      setError({
        message: 'Unexpected error fetching machines'
      });
    }

    if (queryResult2.currentData !== undefined) {
      if (queryResult2.currentData.length === 0) {
        setError({ message: 'No machines found for this account' });
      } else {
        setMachines(queryResult2.currentData);
      }
    }
  }, [queryResult2]);

  return {
    machines: machines,
    error: error,
    isLoading:
      queryResult.isFetching ||
      queryResult2.isFetching ||
      (accountId !== null && machines === null && error === null),
    resetQueries: resetQueries
  };
}

interface SearchPanelProps {
  onSearch: (searchString: string) => void;
}

function SearchPanel(props: SearchPanelProps): JSX.Element {
  const theme = useTheme();

  const [searchInputValue, setSearchInputValue] = useState<string>('');

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInputValue(e.target.value);
  }

  return (
    <>
      <Typography variant="h2">Search for Account Name associated with the machine:</Typography>
      <SearchContainer>
        <SearchInput value={searchInputValue} onChange={onChange} placeholder="Search" />
      </SearchContainer>
      <NoticeContainer>
        {InfoCircleIcon(theme.colors.darkGrey)}
        <InfoText mb={0} variant="helper" color={theme.colors.darkGrey}>
          Email BU Ambassador if account is not listed
        </InfoText>
      </NoticeContainer>
      <ButtonBar>
        <Button
          disabled={searchInputValue.length == 0}
          onClick={() => props.onSearch(searchInputValue)}
          width="5.25rem"
        >
          Search
        </Button>
      </ButtonBar>
    </>
  );
}

interface Props {
  machineUpdate: (machine: SalesforceMachine) => void;
}

export function AccountSearchPanel(props: Props): JSX.Element {
  const { nextStep } = useWizard();

  const [searchString, setSearchString] = useState<string | null>(null);
  const { machines, error, isLoading, resetQueries } = useGetMachinesForAccountName(searchString);

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        toastId: 'new-machine-step-1'
      });
    }
  }, [error]);

  function onSearch(sstring: string) {
    resetQueries();
    setSearchString(sstring);
  }

  function onNext(machineId: string) {
    if (!machines) {
      return;
    }
    for (const machine of machines) {
      if (machine.machineId === machineId) {
        props.machineUpdate(machine);
      }
    }
    nextStep();
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container>
      <Centered>
        {machines && !error && searchString !== null ? (
          <MachineOptionSelector
            machines={machines || []}
            onBack={() => {
              setSearchString(null);
            }}
            onNext={onNext}
          />
        ) : (
          <SearchPanel onSearch={onSearch} />
        )}
      </Centered>
    </Container>
  );
}
