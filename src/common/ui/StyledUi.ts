export interface UiGridProps {
  gridArea?: string;
  gridRows?: string;
  gridCols?: string;
  gridGap?: string;
  gridAreas?: string;
}

export interface UiDataProps {
  dataId?: string;
}

export interface UiContainerProps extends UiGridProps, UiDataProps {
  className?: string;
  flex?: boolean;
  grid?: boolean;
}

export interface SitePageViewContainerProps {
  hasBackground?: boolean;
}
