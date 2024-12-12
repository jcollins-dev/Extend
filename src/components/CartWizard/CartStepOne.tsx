// 3rd party
import React, { ReactElement } from 'react';

// Components
import CartListComponent from 'components/CartListComponent';
interface Props {
  handleClose?: () => void;
}

const CartStepOne = ({ handleClose }: Props): ReactElement => {
  return <CartListComponent handleClose={handleClose} viewType="default" selectionType="remove" />;
};

export default CartStepOne;
