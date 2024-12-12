import styled from 'styled-components';
import { styledTheme } from '../theme';

export interface ProgressBarProps {
  progress: number;
  ga?: string;
  gridArea?: string;
  className?: string;
}

export interface ProgressBarAreaContainerProps {
  progress?: number;
  gridArea?: string;
}

export const ProgressBarAreaContainer = styled.div<ProgressBarAreaContainerProps>`
  grid-area: ${({ gridArea }) => gridArea};
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1em;
`;
/** you can change the height based on font-size */
export const ProgressBar = styled.span<ProgressBarProps>`
  font-size: 10px;
  display: block;
  width: 100%;
  position: relative;
  padding-top: 0.5em;
  border-radius: 3px;
  overflow: hidden;
  height: 0;
  background-color: rgba(0, 0, 0, 0.1);

  grid-area: ${({ ga }) => ga};

  &.status--bad::after {
    background-color: ${styledTheme.color.status.error.base};
  }

  &.status--good::after {
    background-color: ${styledTheme.color.status.success.base};
  }

  &.status--warning::after {
    background-color: ${styledTheme.color.status.warning.base};
  }

  &::after {
    content: ' ';
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    bottom: 0;
    transition: all 750ms ease;

    background-color: ${styledTheme.color.secondary};
    width: ${({ progress }) => (progress < 100 ? progress : `100`)}%;
  }
`;
