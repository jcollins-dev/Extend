import styled from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';

export interface StatusIconProps {
  hasStatus?: string;
  ga?: string;
}

export const StatusIcon = styled.div<StatusIconProps>`
  width: 1.3em;
  height: 0;
  padding-top: 100%;
  position: relative;
  display: block;
  align-items: center;
  justify-content: center;
  color: red;

  grid-area: ${({ ga }) => ga};

  &::before,
  &::after {
    border-radius: 50%;
    position: absolute;
    border-radius: 50%;
    background-color: ${styledTheme.color.main};
  }

  &::before {
    left: 20%;
    top: 20%;
    content: '';
    width: 60%;
    height: 60%;
  }
  &::after {
    left: 0;
    top: 0;
    content: '';
    width: 100%;
    height: 100%;
    opacity: 0.3;
  }

  .status-icon {
    &:before,
    &:after {
      transition: background-color 500ms ease;
    }
  }

  &.status--bad,
  &.status--error {
      &:before,
      &:after {
        background-color: ${styledTheme.color.status.error.base};
      }
    }
  }

  &.status--success,
  &.status--good {
      &:before,
      &:after {
        background-color: ${styledTheme.color.status.success.base};
      }
  }

  &.status--warning,
  &.status--ok {
      &:before,
      &:after {
        background-color: ${styledTheme.color.status.warning.base};
      }
  }
`;

/*
export const StatusIcon = (): JSX.Element => {
  return <CircleIcon className="status-icon"></CircleIcon>;
};
*/
