// 3rd party libraries
import { useSelector } from 'react-redux';

// Types
import { User } from 'types';

// Reducers
import { RootState } from 'reducers';

const useUser = (): null | User =>
  useSelector<RootState, null | User>((state) => state?.user ?? null);

export default useUser;
