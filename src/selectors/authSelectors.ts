// 3rd party libraries
import { useSelector } from 'react-redux';

// Reducers
import { RootState } from 'reducers';

const useAuthToken = (): null | string =>
  useSelector<RootState, null | string>((state) => state?.tokens?.token ?? null);

export default useAuthToken;
