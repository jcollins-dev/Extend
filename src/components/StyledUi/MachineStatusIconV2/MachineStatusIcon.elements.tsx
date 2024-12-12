import styled from 'styled-components';
import { styledTheme } from '../theme';

export const MachineStatusIconTooltip = styled.div`
  display: grid;
  grid-template-columns: 20px 1fr;
  grid-auto-flow: row;
  text-transform: capitalize;
  grid-gap: 0.5em 0.3em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;

  .machine-status-icon__date {
    opacity: 0.7;
    font-size: 0.8em;
    grid-column: 2;
  }

  .fa-wifi {
    transform: rotate(45deg) translate(5px, 1px);
    font-size: 0.8em;
  }
`;

export interface MachineStatusIconContainerProps {
  ga?: string;
  hasStatus?: string;
}

/* possible status returns 
/* 'good' | 'medium' | 'bad' | 'error' | 'never-connected' | 'loading' */
export const MachineStatusIconWrapper = styled.div`
  cursor: pointer;

  > .fa-wifi {
    transform: rotate(45deg) translate(5px, 1px);
    font-size: 0.8em;
  }
`;

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
