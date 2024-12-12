// 3rd party
import React, { ReactElement } from 'react';

// Components
import { CartOrderReview } from 'components';

interface Props {
  orderId?: string;
  orderUrl?: string;
}

const CartStepThree = (props: Props): ReactElement => {
  return <CartOrderReview {...props} />;
};

export default CartStepThree;
