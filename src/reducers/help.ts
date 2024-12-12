// Types
import { HelpAction, HelpInfo } from 'types';

// Actions
import { helpActions } from 'actions';

export const defaultHelp = {
  helpMessage: undefined
} as HelpInfo;

export default (helpState = defaultHelp, action: HelpAction): HelpInfo => {
  switch (action.type) {
    case helpActions.ADD_HELP_MESSAGE: {
      const { helpMessage } = action;
      if (helpMessage) {
        const helpClone = { ...helpState, helpMessage: helpMessage };
        return helpClone;
      } else return helpState;
    }
    case helpActions.REMOVE_HELP_MESSAGE: {
      return defaultHelp;
    }
    default: {
      return helpState;
    }
  }
};
