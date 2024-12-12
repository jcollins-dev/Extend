// 3rd party libraries
import { useSelector } from 'react-redux';

// Reducers
import { RootState } from 'reducers';
import { CartState } from 'types/parts/cart';

const useCart = (): null | CartState =>
  useSelector<RootState, null | CartState>((state) => state?.cart ?? null);

export default useCart;
