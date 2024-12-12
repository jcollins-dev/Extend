import {
  AlertDataScienceSurveyOpenType,
  AlertDataScienceIssueType,
  AlertDataScienceIgnoreReasons
} from 'types/machine-health/alerts';

interface AlertDataScienceFormState {
  alertSurveyType: AlertDataScienceSurveyOpenType;
  confirmable: boolean;
  selectedIssue?: AlertDataScienceIssueType;

  selectedIgnoreReason?: AlertDataScienceIgnoreReasons;
  selectedIgnoreReasonDetails?: string;
  selectedDetails?: string;
}

type FormAction =
  | { type: 'SURVEY_DETAIL_NAVIGATE' }
  | { type: 'SURVEY_IGNORE_NAVIGATE' }
  | { type: 'ADD_INSPECTION_ISSUE'; issue: AlertDataScienceIssueType }
  | { type: 'ADD_IGNORE_REASON'; ignoreReason: AlertDataScienceIgnoreReasons }
  | { type: 'ADD_IGNORE_REASON_DETAILS'; details?: string }
  | { type: 'ADD_DETAILS'; details?: string };

export const initialSurveyState: AlertDataScienceFormState = {
  alertSurveyType: AlertDataScienceSurveyOpenType.DetailType,
  confirmable: false
};

export const surveyReducer = (
  state: AlertDataScienceFormState,
  action: FormAction
): AlertDataScienceFormState => {
  switch (action.type) {
    case 'SURVEY_DETAIL_NAVIGATE': {
      return initialSurveyState;
    }

    case 'SURVEY_IGNORE_NAVIGATE': {
      return {
        ...initialSurveyState,
        alertSurveyType: AlertDataScienceSurveyOpenType.IgnoreSurveyType
      };
    }

    case 'ADD_INSPECTION_ISSUE': {
      return { ...state, selectedIssue: action.issue, confirmable: true };
    }

    case 'ADD_IGNORE_REASON': {
      const confirmable = action.ignoreReason !== AlertDataScienceIgnoreReasons.OTHER;
      return {
        ...state,
        selectedIgnoreReason: action.ignoreReason,
        confirmable
      };
    }

    case 'ADD_IGNORE_REASON_DETAILS': {
      return {
        ...state,
        selectedIgnoreReasonDetails: action.details,
        confirmable: true
      };
    }

    case 'ADD_DETAILS': {
      return {
        ...state,
        selectedDetails: action.details,
        confirmable: true
      };
    }

    default: {
      return initialSurveyState;
    }
  }
};
