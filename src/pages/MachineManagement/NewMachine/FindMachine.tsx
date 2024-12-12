// 3rd party libs
import React, { ChangeEvent, useEffect, useState } from 'react';
import Typography from 'components/Typography/Typography';
import styled from 'styled-components';
import theme from 'themes';
import { Button, PageHeader, SearchInput } from 'components';
import { JBTRoutes } from 'constants/routes';
import Customers from './Customer';
import Machines from './Machines';
import { useSaveMachineOnboardingMutation } from 'api';
import { useHistory } from 'react-router';
import { AssetSalesforce } from 'types/machine-management';

const Container = styled.div`
  margin: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  border-top: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
  border-bottom: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
  border-left: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
  border-radius: 0.625rem;
`;

const ButtonsContainer = styled.div`
  width: 30%;
  margin-right: 1rem;
  float: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  button {
    margin: 1rem;
  }
`;

const Column = styled.div`
  width: 50%;
  border-right: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
`;

const ColumnTitle = styled.div`
  background-color: ${(props) => props.theme.colors.background.background7};
  padding: 0.625rem;
  border-bottom: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};

  p {
    margin: 0;
    padding: 0;
  }
`;
const ContainerSearchInput = styled.div`
  padding: 0.625rem;
  border-bottom: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
`;

const FindMachine = (): JSX.Element => {
  const [searchCustomer, setSearchCustomer] = useState<string>();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>();
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>();
  const [selectedMachine, setSelectedMachine] = useState<string>();
  const [selectedMachineType, setSelectedMachineType] = useState<string>();
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>();
  const [selectedBU, setSelectedBU] = useState<string>();
  const [selectedBUId, setSelectedBUId] = useState<number>();
  const [selectedMachineTypeCode, setSelectedMachineTypeCode] = useState<string>();
  const [selectedMachineAddress, setSelectedMachineAddress] = useState<AssetSalesforce>();
  const [selectedDigitalEdgeType, setSelectedDigitalEdgeType] = useState<string>();
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    if (searchValue.length > 3) {
      setSearchCustomer(searchValue);
    } else if (!searchValue) {
      setSearchCustomer('');
      setSelectedCustomerId('');
      setSelectedMachine('');
    }
  };

  const [saveMachineOnboarding] = useSaveMachineOnboardingMutation();
  const history = useHistory();
  const goTo = (machineId: string) => {
    history.push(JBTRoutes.onboardingPage.replace(':machineId', machineId));
  };

  useEffect(() => {
    setSelectedMachineType(undefined);
    setSelectedTimeZone(undefined);
    setSelectedBU(undefined);
    setSelectedBUId(undefined);
    setSelectedMachineTypeCode(undefined);
    setSelectedMachineAddress(undefined);
    setSelectedDigitalEdgeType(undefined);
  }, [selectedMachine]);

  return (
    <>
      <PageHeader
        heading={'Find an asset'}
        breadcrumbs={[
          { label: 'Machine Management', link: JBTRoutes.machineManagement },
          { label: 'Find an asset' }
        ]}
      />
      <div>
        <Container>
          <Column>
            <ColumnTitle>
              <Typography color={theme.colors.darkGrey} variant="subtitle">
                Customer
              </Typography>
            </ColumnTitle>
            <ContainerSearchInput>
              <SearchInput placeholder="Search Customers" onChange={handleSearchChange} />
            </ContainerSearchInput>
            <div>
              {/* Customers */}
              <Customers
                customerToSearch={searchCustomer}
                selectedCustomerId={selectedCustomerId}
                setSelectedCustomerId={setSelectedCustomerId}
                setSelectedCustomerName={setSelectedCustomerName}
              />
            </div>
          </Column>
          {/* Machine box */}
          <Column>
            <ColumnTitle>
              <Typography color={theme.colors.darkGrey} variant="subtitle">
                Machine
              </Typography>
            </ColumnTitle>
            <div>
              {/* Machines */}
              {selectedCustomerId ? (
                <Machines
                  accountId={selectedCustomerId}
                  selectedMachine={selectedMachine}
                  setSelectedMachine={setSelectedMachine}
                  setSelectedMachineType={setSelectedMachineType}
                  selectedMachineType={selectedMachineType}
                  setSelectedTimeZone={setSelectedTimeZone}
                  selectedTimeZone={selectedTimeZone}
                  setSelectedBU={setSelectedBU}
                  selectedBU={selectedBU}
                  selectedDigitalEdgeType={selectedDigitalEdgeType}
                  setSelectedBUId={setSelectedBUId}
                  setSelectedMachineTypeCode={setSelectedMachineTypeCode}
                  setSelectedMachineAddress={setSelectedMachineAddress}
                  setSelectedDigitalEdgeType={setSelectedDigitalEdgeType}
                />
              ) : (
                ''
              )}
            </div>
          </Column>
        </Container>
        <ButtonsContainer>
          <Button
            disabled={false}
            onClick={() => {
              window.location.assign(JBTRoutes.machineManagement);
            }}
          >
            Cancel
          </Button>
          <Button
            bgColor={theme.colors.primaryBlue4}
            disabled={
              selectedCustomerId === undefined ||
              selectedMachine === undefined ||
              selectedMachineType === undefined ||
              selectedTimeZone === undefined ||
              selectedBU === undefined
            }
            onClick={() => {
              try {
                saveMachineOnboarding({
                  salesforce_machine_id: selectedMachineAddress?.id,
                  description: selectedMachineAddress?.name,
                  customer: selectedCustomerName,
                  account_id: selectedCustomerId,
                  machine_type_id: selectedMachineTypeCode,
                  business_unit_id: selectedBUId,
                  timezone: selectedTimeZone,
                  city: selectedMachineAddress?.accountProvince,
                  zipCode: selectedMachineAddress?.accountPostalCode,
                  country: selectedMachineAddress?.accountCountry,
                  digital_edge_type: selectedDigitalEdgeType
                })
                  .unwrap()
                  .then((payload) => {
                    if (payload.id !== undefined) {
                      goTo(payload.id);
                    }
                  });
              } catch (error) {
                console.error('rejected', error);
              }
            }}
          >
            Continue
          </Button>
        </ButtonsContainer>
      </div>
    </>
  );
};

export default FindMachine;
