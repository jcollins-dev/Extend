// 3rd party libraries
import { useSelector } from 'react-redux';

// Types
import { HelpInfo } from 'types';

// Reducers
import { RootState } from 'reducers';

const useHelp = (): null | HelpInfo =>
  useSelector<RootState, null | HelpInfo>((state) => state?.help ?? null);

export default useHelp;
