export interface StyledUiGridProps {
  /** set to true for grid, if any grid settings are present, this should be set automatically */
  grid?: boolean;
  /** the grid-template-area for this container */
  gridArea?: string;
  /** the grid-template-areas for this container */
  gridAreas?: string;
  /** grid-tempalte-rows for this contianer */
  gridRows?: string;
  /** grid-template-columns for this container */
  gridCols?: string;
  /** grid-gap for this container */
  gridGap?: string;
}

export interface StyledUiFlexProps {
  /** set to true for grid, if any grid settings are present, this should be set automatically */
  flex?: boolean;
}

export interface StyledUiDataProps {
  /** the value of the data attribute data-id, can be used for advanced css selecting */
  dataId?: string;
}

export interface StyledUiDimesionsProps {
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
}

export interface StyledUiPositionProps {
  left?: string | number | boolean;
  top?: string | number | boolean;
  bottom?: string | number | boolean;
  right?: string | number | boolean;
  pos?: string;
  // set to true if you want to use position: absolute
  abs?: boolean;
  z?: number;
  transf?: string;
  transl?: string;
  transX?: string;
  transY?: string;
}

export interface StyledUiContainerProps
  extends StyledUiGridProps,
    StyledUiFlexProps,
    StyledUiPositionProps,
    StyledUiDimesionsProps,
    StyledUiDataProps {
  /** custom className to be added to main container wrapper */
  className?: string;
  /** set to true if you want to display: flex */
  display?: string;
  /** this is a color that will be passed down to element, it's use depends on how you code the component */
  color?: string;
  centered?: boolean;
}

export interface SitePageViewContainerProps {
  hasBackground?: boolean;
}
