import styled from 'styled-components';
import { styledTheme } from '../theme';

export interface MachineStatusIconContainerProps {
  ga?: string;
  hasStatus?: string;
}

/* possible status returns 
/* 'good' | 'medium' | 'bad' | 'error' | 'never-connected' | 'loading' */
export const MachineStatusIconContainer = styled.div`
  .ui-tooltip {
    margin-bottom: 8px;
    font-weight: 500;
    flex-direction: row;
    font-size: 0.9em;

    .ui-label {
      margin-right: 0.3em;
    }

    .ui-display {
      text-transform: capitalize;
    }
  }

  .ui-machine-status-icon__icon {
    transform: rotate(45deg);
  }

  &.ui-machine-status-icon--good {
    .ui-machine-status-icon__icon {
      color: ${styledTheme.color.status.success.base}!important;
    }
    .ui-display {
      color: ${styledTheme.color.status.success.light}!important;
    }
  }

  &.ui-machine-status-icon--bad,
  .ui-machine-status-icon--error {
    .ui-machine-status-icon__icon {
      color: ${styledTheme.color.status.error.base};
    }
    .ui-display {
      color: ${styledTheme.color.status.error.light};
    }
  }

  &.ui-machine-status-icon--medium {
    .ui-machine-status-icon__icon {
      color: ${styledTheme.color.status.warning.base};
    }
    .ui-display {
      color: ${styledTheme.color.status.warning.light};
    }
  }

  &.ui-machine-status-icon--loading {
    .ui-machine-status-icon__icon {
      animation: pulse 1s infinite;
      color: ${styledTheme.color.secondary};
    }
    .ui-display {
      color: ${styledTheme.color.secondaryAlt};
    }
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;
