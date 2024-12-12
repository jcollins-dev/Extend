import { useSelector } from 'react-redux';
import { tanStackTableFilterOption } from 'reducers/tanStackTable';
// Reducers
import { RootState } from 'reducers';
const useTanStackFilterOptions = (): null | tanStackTableFilterOption[] =>
  useSelector<RootState, null | tanStackTableFilterOption[]>(
    (state) => state?.tanStackTableFilterOptions ?? null
  );
export default useTanStackFilterOptions;
