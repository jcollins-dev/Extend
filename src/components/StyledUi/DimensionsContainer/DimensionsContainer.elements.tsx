import styled from 'styled-components';

export interface DimensionsContainerWrapperProps {
  isDoughnut?: boolean;
  gridArea?: string;
  dims?: {
    width?: number;
    height?: number;
  };
}

export const DimensionsContainerWrapper = styled.div<DimensionsContainerWrapperProps>`
  position: relative;

  width: ${({ dims }) => (dims?.width && `${dims.width}px`) || '100%'};
  height: ${({ dims }) => (dims?.height && `${dims.height}px`) || '100%'};

  &.use-max {
    max-width: max-content;
    max-height: max-content;
  }
`;

/*
 width: ${({ width }) => !width ? undefined : `${width}px`};
  height: ${({ height }) => !height ? undefined : `${height}px`};
  */
