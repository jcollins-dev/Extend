// 3rd party
import React, { ReactElement, memo, useMemo, useState } from 'react';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import Icon from '../../img/cart.svg';

// Components
import { Badge, CartWizard, Modal } from 'components';

// Types
import { CartState } from 'types/parts/cart';

// Custom hooks
import { useCart } from 'selectors';

const ImageCart = styled.div`
  cursor: pointer;
  font-size: 15px;
  color: ${(props) => props.theme.colors.darkGrey};
  position: relative;
  padding-top: 4px;
`;

const ContextAwareCart = (): ReactElement => {
  const cart = useCart() as CartState;
  // const [itemsInCart, setItemsInCart] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const itemsInCart = useMemo(() => {
    if (cart.items.length > 0)
      return cart.items.map((item) => item.quantity).reduce((prev, current) => prev + current);
    return 0;
  }, [cart]);

  // useEffect(() => {
  //   if (cart) {
  //     setItemsInCart(
  //       cart.items.length === 0
  //         ? 0
  //         : cart.items.map((item) => item.quantity).reduce((prev, current) => prev + current)
  //     );
  //   }
  // }, [cart]);

  return (
    <>
      <div>
        <ImageCart data-testid="cart-icon" onClick={() => setShowModal(true)}>
          <img src={Icon} alt="Cart" />
          {itemsInCart > 0 && <Badge style={{ top: 1 }}>{itemsInCart}</Badge>}
        </ImageCart>
      </div>

      <Modal visible={showModal} onClose={() => setShowModal(false)}>
        <CartWizard active={showModal} handleClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};

export default memo(ContextAwareCart);
