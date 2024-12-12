// 3rd party
import React, { ReactElement, useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// Types
import { ChangeEvent, ModalSize, Plant } from 'types';
import { CartOrderDetails } from 'types/parts/cart';

// Styling
const Root = styled.div`
  padding: 0.75rem 1.5rem 1.25rem 2.375rem;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 6.25rem;
  overflow: auto;
`;

// Components
import { BaseSelect, Checkbox, Modal, Input, Typography, Button } from 'components';
import { useGetPlantsQuery } from 'api';
import PlantAutofillTable from './PlantAutofillTable';

// Hook
import { useUser } from 'selectors';

const Container = styled.div`
  width: 50%;
  margin-top: 2rem;
  min-width: 13.5rem;
  padding-right: 1.875rem;

  &:nth-child(2n) {
    padding-right: 0;
    padding-left: 1.875rem;
  }
`;

const InputRowBase = styled.div`
  height: 2.5rem;
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const InputRow = styled(InputRowBase)`
  & > div {
    flex-grow: 1;
    margin-right: 0.8125rem;
    display: flex;
    align-items: center;
  }

  & > div:last-child {
    margin-right: 0;
  }
`;

const InputRowAddressButtons = styled(InputRowBase)`
  display: flex;
  justify-content: flex-end;
`;

interface InputContainerProps {
  justify?: 'flex-start' | 'center' | 'flex-end';
}
const InputContainer = styled.div<InputContainerProps>`
  display: flex;
  justify-content: ${({ justify }) => (justify ? justify : 'flex-start')};

  input {
    border-radius: 0.125rem;
  }
  input[type='checkbox'] {
    border-radius: 0.375rem;
  }
`;

const OptionalText = styled.span`
  color: ${({ theme }) => theme.colors.mediumGrey3};
`;

const BillToRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const AddressButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

// Props
interface Props {
  orderDetails: CartOrderDetails;
  handleUpdate: (updatedDetails: CartOrderDetails) => void;
}

const CartFulfillmentDetails = ({ orderDetails, handleUpdate }: Props): ReactElement => {
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const { data: plants, isFetching: plantsLoading } = useGetPlantsQuery();
  const user = useUser();
  const { t } = useTranslation(['fpns']);

  // If the user data flows through after initialization
  useEffect(() => {
    if (user && orderDetails.creator === '') {
      handleUpdate({ ...orderDetails, creator: user.email });
    }
  }, [user]);

  // Input change handling functions
  const handleDetailsUpdate = (details: CartOrderDetails) => {
    handleUpdate(details);
  };

  const handleShipSameAsBilling = (details: CartOrderDetails) => {
    handleDetailsUpdate({
      ...details,
      shippingAddress: details.shipMatchBilling
        ? {
            streetAddress: details.billingAddress.streetAddress,
            suiteNumber: details.billingAddress.suiteNumber,
            city: details.billingAddress.city,
            state: details.billingAddress.state,
            postalCode: details.billingAddress.postalCode,
            country: details.billingAddress.country
          }
        : {
            streetAddress: '',
            suiteNumber: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
          }
    });
  };
  const handleNameChange = (name: string, propName: 'firstName' | 'lastName') => {
    const copyBillee = { ...orderDetails.billee, [propName]: name };
    const copyDetails = { ...orderDetails, billee: { ...copyBillee } };
    handleDetailsUpdate(copyDetails);
  };

  const autofillAddress = (plant: Plant | undefined): void => {
    if (plant) {
      handleDetailsUpdate({
        ...orderDetails,
        billingAddress: {
          streetAddress: plant.addressLine1,
          suiteNumber: plant.addressLine2 ? plant.addressLine2 : '',
          city: plant.city,
          state: plant.state,
          postalCode: plant.zipCode,
          country: plant.countryName
        }
      });
    } else {
      handleDetailsUpdate({
        ...orderDetails,
        billingAddress: {
          streetAddress: '',
          suiteNumber: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        shipMatchBilling: false,
        shippingAddress: {
          streetAddress: '',
          suiteNumber: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        }
      });
    }
    if (plant) {
      toast.success(t('autofilled_address', { item: plant.name }));
    } else {
      toast.success(t('cleared_address'));
    }
  };

  const handleAddressChange = (
    val: string,
    billOrShip: 'billingAddress' | 'shippingAddress',
    propName: 'streetAddress' | 'suiteNumber' | 'city' | 'state' | 'postalCode' | 'country'
  ) => {
    const copyAddr = { ...orderDetails[billOrShip], [propName]: val };
    const copyDetails = { ...orderDetails, [billOrShip]: { ...copyAddr } };
    handleDetailsUpdate(copyDetails);
  };

  return (
    <Root>
      <Container>
        <BillToRow>
          <Typography variant="subtitle">{t('bill_to')}</Typography>
        </BillToRow>

        <InputRow>
          <InputContainer>
            <Input
              variant="white"
              placeholder={t('first_name', { ns: 'common' })}
              width="50%"
              value={orderDetails?.billee?.firstName}
              onChange={(event: ChangeEvent) => {
                const firstName = event.target.value as string;
                handleNameChange(firstName, 'firstName');
              }}
            />
          </InputContainer>
          <InputContainer>
            <Input
              variant="white"
              placeholder={t('last_name', { ns: 'common' })}
              value={orderDetails?.billee?.lastName}
              onChange={(event: ChangeEvent) => {
                const lastName = event.target.value as string;
                handleNameChange(lastName, 'lastName');
              }}
            />
          </InputContainer>
        </InputRow>
        <InputRow>
          <InputContainer>
            <Input
              variant="white"
              placeholder={t('street_address', { ns: 'common' })}
              value={orderDetails?.billingAddress?.streetAddress ?? ''}
              onChange={(event: ChangeEvent) => {
                const val = event.target.value as string;
                handleAddressChange(val, 'billingAddress', 'streetAddress');
              }}
            />
          </InputContainer>
        </InputRow>
        <InputRow>
          <InputContainer>
            <Input
              variant="white"
              placeholder={t('app_suite_unit', { ns: 'common' })}
              value={orderDetails?.billingAddress?.suiteNumber ?? ''}
              onChange={(event: ChangeEvent) => {
                const val = event.target.value as string;
                handleAddressChange(val, 'billingAddress', 'suiteNumber');
              }}
            />
          </InputContainer>
        </InputRow>
        <InputRow>
          <InputContainer>
            <Input
              variant="white"
              placeholder={t('city', { ns: 'common' })}
              value={orderDetails?.billingAddress?.city ?? ''}
              onChange={(event: ChangeEvent) => {
                const val = event.target.value as string;
                handleAddressChange(val, 'billingAddress', 'city');
              }}
            />
          </InputContainer>
          <InputContainer>
            <Input
              variant="white"
              placeholder={t('state', { ns: 'common' })}
              value={orderDetails?.billingAddress?.state ?? ''}
              onChange={(event: ChangeEvent) => {
                const val = event.target.value as string;
                handleAddressChange(val, 'billingAddress', 'state');
              }}
            />
          </InputContainer>
        </InputRow>
        <InputRow>
          <InputContainer>
            <Input
              variant="white"
              placeholder={t('postal_code', { ns: 'common' })}
              value={orderDetails?.billingAddress?.postalCode ?? ''}
              onChange={(event: ChangeEvent) => {
                const val = event.target.value as string;
                handleAddressChange(val, 'billingAddress', 'postalCode');
              }}
            />
          </InputContainer>
          <InputContainer>
            <Input
              variant="white"
              placeholder={t('country', { ns: 'common' })}
              value={orderDetails?.billingAddress?.country ?? ''}
              onChange={(event: ChangeEvent) => {
                const val = event.target.value as string;
                handleAddressChange(val, 'billingAddress', 'country');
              }}
            />
          </InputContainer>
        </InputRow>
        <InputRowAddressButtons>
          <AddressButtons>
            <Button
              variant="primary"
              disabled={!plants || plantsLoading}
              onClick={() => setShowAddressModal(!showAddressModal)}
            >
              {t('use_saved_address')}
            </Button>
            <Button variant="thin" onClick={() => autofillAddress(undefined)}>
              {t('clear_address')}
            </Button>
          </AddressButtons>
        </InputRowAddressButtons>
      </Container>
      <Container>
        <Typography variant="subtitle">{t('ship_to')}</Typography>
        <InputRow>
          <Checkbox
            width={20}
            height={20}
            label={t('same_as_billing_address') as string}
            checked={orderDetails?.shipMatchBilling}
            onChange={(event: ChangeEvent) => {
              const val = event.target.checked;
              handleShipSameAsBilling({ ...orderDetails, shipMatchBilling: val });
            }}
          />
        </InputRow>
        <InputRow>
          <InputContainer>
            <Input
              variant={orderDetails?.shipMatchBilling ? 'disabled' : 'white'}
              placeholder={t('street_address', { ns: 'common' })}
              value={orderDetails?.shippingAddress?.streetAddress ?? ''}
              onChange={(event: ChangeEvent) => {
                const val = event.target.value as string;
                handleAddressChange(val, 'shippingAddress', 'streetAddress');
              }}
            />
          </InputContainer>
        </InputRow>
        <InputRow>
          <InputContainer>
            <Input
              variant={orderDetails?.shipMatchBilling ? 'disabled' : 'white'}
              placeholder={t('app_suite_unit', { ns: 'common' })}
              value={orderDetails?.shippingAddress?.suiteNumber ?? ''}
              onChange={(event: ChangeEvent) => {
                const val = event.target.value as string;
                handleAddressChange(val, 'shippingAddress', 'suiteNumber');
              }}
            />
          </InputContainer>
        </InputRow>
        <InputRow>
          <InputContainer>
            <Input
              variant={orderDetails?.shipMatchBilling ? 'disabled' : 'white'}
              placeholder={t('city', { ns: 'common' })}
              value={orderDetails?.shippingAddress?.city ?? ''}
              onChange={(event: ChangeEvent) => {
                const val = event.target.value as string;
                handleAddressChange(val, 'shippingAddress', 'city');
              }}
            />
          </InputContainer>
          <InputContainer>
            <Input
              variant={orderDetails?.shipMatchBilling ? 'disabled' : 'white'}
              placeholder={t('state', { ns: 'common' })}
              value={orderDetails?.shippingAddress?.state ?? ''}
              onChange={(event: ChangeEvent) => {
                const val = event.target.value as string;
                handleAddressChange(val, 'shippingAddress', 'state');
              }}
            />
          </InputContainer>
        </InputRow>

        <InputRow>
          <InputContainer>
            <Input
              variant={orderDetails?.shipMatchBilling ? 'disabled' : 'white'}
              placeholder={t('postal_code', { ns: 'common' })}
              value={orderDetails?.shippingAddress?.postalCode ?? ''}
              onChange={(event: ChangeEvent) => {
                const val = event.target.value as string;
                handleAddressChange(val, 'shippingAddress', 'postalCode');
              }}
            />
          </InputContainer>
          <InputContainer>
            <Input
              variant={orderDetails?.shipMatchBilling ? 'disabled' : 'white'}
              placeholder={t('country', { ns: 'common' })}
              value={orderDetails?.shippingAddress?.country ?? ''}
              onChange={(event: ChangeEvent) => {
                const val = event.target.value as string;
                handleAddressChange(val, 'shippingAddress', 'country');
              }}
            />
          </InputContainer>
        </InputRow>
      </Container>
      <Container>
        <Typography variant="subtitle">{t('shipment_method')}</Typography>
        <InputRow>
          <InputContainer>
            <BaseSelect
              value={t('coming_soon_dot') as string}
              handleChange={() => {
                console.log('shipment method');
              }}
              options={[t('coming_soon_dot') as string]}
              placeholder={t('coming_soon_dot') as string}
              variant="disabled"
            />
          </InputContainer>
          <InputContainer justify="center">
            <Checkbox
              width={20}
              height={20}
              label={t('allow_partial_shipments') as string}
              checked={orderDetails?.allowPartialShipments}
              onChange={(event: ChangeEvent) => {
                const val = event.target.checked;
                handleDetailsUpdate({ ...orderDetails, allowPartialShipments: val });
              }}
            />
          </InputContainer>
        </InputRow>
      </Container>
      <Container>
        <Typography variant="subtitle">
          {t('purchase_order_info')}{' '}
          <OptionalText>({t('required', { ns: 'common' })})</OptionalText>
        </Typography>
        <InputRow>
          <InputContainer>
            <Input
              variant="white"
              placeholder={t('add_po_number')}
              value={orderDetails?.customerPoNumber}
              onChange={(event: ChangeEvent) => {
                const customerPo = event.target.value as string;
                handleDetailsUpdate({ ...orderDetails, customerPoNumber: customerPo });
              }}
            />
          </InputContainer>
        </InputRow>
      </Container>
      <Container>
        <Typography variant="subtitle">{t('created_by')}</Typography>
        <InputRow>
          <InputContainer>
            <Input
              type="email"
              variant="white"
              placeholder="creator@comp.com"
              value={orderDetails?.creator}
              onChange={(event: ChangeEvent) => {
                const creator = event.target.value as string;
                handleDetailsUpdate({ ...orderDetails, creator: creator });
              }}
            />
          </InputContainer>
        </InputRow>
      </Container>
      <Modal
        visible={showAddressModal}
        size={ModalSize.SMALL}
        title={t('saved_addresses') as string}
        onClose={() => setShowAddressModal(false)}
        allowContentScroll={true}
      >
        <PlantAutofillTable
          plants={plants}
          autoFillFunction={autofillAddress}
          showModalFunction={setShowAddressModal}
        />
      </Modal>
    </Root>
  );
};

export default CartFulfillmentDetails;
