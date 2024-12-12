// 3rd party
import React, { ReactElement } from 'react';

// Components
import { CartFulfillmentDetails } from 'components';

// Types
import { CartOrderDetails } from 'types/parts/cart';

interface Props {
  handleUpdate: (orderDetails: CartOrderDetails) => void;
  orderDetails: CartOrderDetails;
}
const CartStepTwo = ({ orderDetails, handleUpdate }: Props): ReactElement => {
  return <CartFulfillmentDetails orderDetails={orderDetails} handleUpdate={handleUpdate} />;
};

export default CartStepTwo;
