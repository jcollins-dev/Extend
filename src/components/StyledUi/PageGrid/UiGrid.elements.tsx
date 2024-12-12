import styled, { css } from 'styled-components';

export interface CssGridProps {
  /* grid-template-areas */
  gridAreas?: string;
  /* grid-template-rows */
  gridRows?: string;
  /* grid-template-columns */
  gridCols?: string;
  /* grid-gap */
  gridGap?: string;
  /* grid-auto-flow: row | column */
  gridFlow?: string;
}

export interface CssFlexProps {
  /* if it's flex */
  flex?: boolean;
  /* flex-grow */
  grow?: number;
  /* flex-direction */
  direction?: string;
  /* true = flex center center */
  middle?: boolean;
  /* true = text center */
  center?: boolean;
  /* justify-content */
  justify?: string;
  /* align-items */
  align?: string;
  /* number of columns */
  cols?: number;
  /** flex gap */
  gap?: string;
  /** wrap */
  wrap?: boolean;
}

export interface GridContainerProps extends CssGridProps, CssFlexProps {
  mediaBreaks?: {
    sm?: CssGridProps & CssFlexProps;
    md?: CssGridProps & CssFlexProps;
    lg?: CssGridProps & CssFlexProps;
    xl?: CssGridProps & CssFlexProps;
    custom?: {
      /** must be min-width: 20px; or max-width: 300px, or whatever
       * you want to appear in @media screen and (custom.breakAt)
       * in css media query */
      breakAt: string;
      styles: CssGridProps & CssFlexProps;
    };
  };
  className?: string;
}

/** for more help with css grids, look up css grids or goto
 * https://css-tricks.com/snippets/css/complete-guide-grid/
 */
const generateGridCss = ({ gridAreas, gridRows, gridCols, gridGap, gridFlow }: CssGridProps) => css`
  grid-template-areas: ${gridAreas};
  grid-template-rows: ${gridRows};
  grid-template-columns: ${gridCols};
  grid-gap: ${gridGap};
  grid-auto-flow: ${gridFlow === 'col' ? 'column' : gridFlow === 'row' && 'row'};
`;

const generateFlexCss = ({
  wrap,
  cols,
  grow,
  direction,
  center,
  justify,
  align
}: CssFlexProps) => css`
  flex-grow: ${grow};
  flex-direction: ${direction};
  align-items: ${center ? 'center' : align};
  justify-content: ${center ? 'center' : justify};
  display: ${cols ? 'flex' : undefined};
  flex-wrap: ${wrap ? 'wrap' : undefined};

  .page-grid__cell {
    min-width: max-content;
    width: ${100 / (cols || 1)}%;
    max-width: 100vw;
  }
`;

/** for more help with css grids, look up css grids or goto
 * https://css-tricks.com/snippets/css/complete-guide-grid/
 */
// TODO: Setup custom mediaQuery
export const GridContainer = styled.div<GridContainerProps>`
  display: ${({ flex }) => (flex ? 'flex' : 'grid')};
  grid-auto-flow: ${({ gridFlow }) => gridFlow};

  ${({ flex, gridAreas, gridRows, gridCols, gridGap, gridFlow }) =>
    !flex && generateGridCss({ gridAreas, gridRows, gridCols, gridGap, gridFlow })};

  ${({ flex, cols, grow, direction, center, justify, align, gap }) =>
    flex && generateFlexCss({ cols, grow, direction, center, justify, align, gap })};

  @media screen and (max-width: 400px) {
    ${({ mediaBreaks }) => mediaBreaks && mediaBreaks.sm && generateGridCss(mediaBreaks.sm)};
    ${({ mediaBreaks }) => mediaBreaks && mediaBreaks.sm && generateFlexCss(mediaBreaks.sm)};
  }

  @media screen and (min-width: 800px) {
    ${({ mediaBreaks }) => mediaBreaks && mediaBreaks.md && generateGridCss(mediaBreaks.md)};
    ${({ mediaBreaks }) => mediaBreaks && mediaBreaks.md && generateFlexCss(mediaBreaks.md)};
  }

  @media screen and (min-width: 1200px) {
    ${({ mediaBreaks }) => mediaBreaks && mediaBreaks.lg && generateGridCss(mediaBreaks.lg)};
    ${({ mediaBreaks }) => mediaBreaks && mediaBreaks.lg && generateFlexCss(mediaBreaks.lg)};
  }

  @media screen and (min-width: 1400px) {
    ${({ mediaBreaks }) => mediaBreaks && mediaBreaks.lg && generateGridCss(mediaBreaks.lg)};
    ${({ mediaBreaks }) => mediaBreaks && mediaBreaks.lg && generateFlexCss(mediaBreaks.lg)};
  }
`;
