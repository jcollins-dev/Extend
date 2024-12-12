import React, { ReactNode } from 'react';
import { PageGridContainer, PageGridContainerProps } from './PageGrid.elements';

export interface PageGridProps extends PageGridContainerProps {
  className?: string;
}

interface Props extends PageGridProps {
  children?: ReactNode | ReactNode[];
}

export const PageGrid = ({
  children,
  gridCols,
  gridRows,
  gridAreas,
  gridFlow,
  gridGap,
  mediaBreaks,
  className
}: Props): JSX.Element => {
  // use incoming grid settings, or choose a pre-made grid using gridType settings
  // to find samples, go to pageGrid.options.ts

  className = className ? `${className} page-grid` : `page-grid`;

  return (
    <PageGridContainer
      {...{ gridCols, gridRows, gridAreas, mediaBreaks, gridGap, gridFlow, className }}
    >
      {children}
    </PageGridContainer>
  );
};
