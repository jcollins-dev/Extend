// Types
import { ReportAction, ReportValidation } from 'types';

// Actions
import { reportActions } from 'actions';

export const defaultReport = {
  machineId: '',
  isReportValid: false
} as ReportValidation;

export default (reportState = defaultReport, action: ReportAction): ReportValidation => {
  const { machineId } = action;
  switch (action.type) {
    case reportActions.SHOW_REPORT: {
      const reportClone = { ...reportState, isReportValid: true, machineId: machineId };
      return reportClone;
    }
    case reportActions.HIDE_REPORT: {
      const reportClone = { ...reportState, isReportValid: false, machineId: machineId };
      return reportClone;
    }
    default: {
      return reportState;
    }
  }
};
