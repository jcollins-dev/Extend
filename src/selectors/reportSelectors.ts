// 3rd party libraries
import { useSelector } from 'react-redux';

// Types
import { ReportValidation } from 'types';

// Reducers
import { RootState } from 'reducers';

const useReport = (): null | ReportValidation =>
  useSelector<RootState, null | ReportValidation>((state) => state?.report ?? null);

export default useReport;
