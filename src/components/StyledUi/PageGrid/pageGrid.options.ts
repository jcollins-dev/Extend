import { GridContainerProps } from './';

export const baseGap = `1rem`;

export interface GridTypeProps {
  [key: string]: GridContainerProps;
}

// for working demos, go to storybook (yarn storybook in terminal) and navigate to
// Styled Ui - Page Layouts - Page Grids
// from there you can select grid types.  you can add new grid types following the format
//
// to learn more about grid settings and help with css grids goto file
// components/StyledUi/elements/UiLayoutGrid.elements.tsx
export const pageGridType: GridTypeProps = {
  /** the layout used for dsi overview machine image section */
  overview2Col: {
    /** add globals first in case you want to easily override any settings */
    gridGap: baseGap,
    /* default grid view, mobile view first */
    //-------------------------//
    // This creates a grid of only rows
    //  ___
    // |___|
    // |___|
    // |___|
    //
    gridAreas: `
      'left'
      'c-1'
      'c-2'
    `,
    gridCols: `1fr`,
    gridRows: `auto`,
    /** media breaks, mobile first and work your way up.
     *  see UiLayoutGrid.elements.tsx for media queries */
    mediaBreaks: {
      md: {
        //-------------------------//
        // This sectioned creates a box grid
        //  _____________
        // |      |______|
        // |______|______|
        //
        gridAreas: `
          'machine cell-1'
          'machine cell-2'
        `,
        gridCols: `1fr 1.5fr`,
        gridRows: `1fr auto`
      },
      lg: {
        //-------------------------//
        // This this makes the right side twice as big as left
        //  __________
        // |   |______|
        // |___|______|
        //
        gridAreas: `
          'machine cell-1'
          'machine cell-2'
        `,
        gridCols: `1fr 2fr`
      }
    }
  },

  settingsQaulityPerfomance: {
    className: `page-grid--widget-ui-sizer res-font`,
    gridGap: baseGap,
    gridCols: `1fr`,
    gridRows: `auto auto auto auto auto auto auto auto auto`,
    gridAreas: `
      'settings'
      'settings-1'
      'settings-2'
      'quality' 
      'quality-1'
      'quality-2'
      'quality-3'
      'quality-4'
    `,
    mediaBreaks: {
      md: {
        gridCols: `1fr 1fr`,
        gridRows: `auto auto auto`,
        gridAreas: `
          'settings   settings'
          'settings-1 settings-2'
          'quality    quality'
          'quality-1  quality-2'
          'quality-3  quality-4'
        `
      },
      lg: {
        gridCols: `1fr 1fr 1fr`,
        gridRows: `auto auto auto`,
        gridAreas: `
          'settings   quality   quality'
          'settings-1 quality-1 quality-2'
          'settings-2 quality-3 quality-4'
        `
      }
    }
  },

  qaulityPerfomance: {
    className: `page-grid--widget-ui-sizer res-font`,
    gridGap: baseGap,
    gridCols: `1fr`,
    gridRows: `auto auto auto auto auto auto`,
    gridAreas: `
      'quality'
      'quality-1'
      'performance' 
      'performance-1'
      'performance-2'
      'performance-3'
    `,
    mediaBreaks: {
      md: {
        gridCols: `1fr 1fr`,
        gridRows: `auto auto auto auto auto`,
        gridAreas: `
          'quality        quality'
          'quality-1      quality-1'
          'performance    performance'
          'performance-1  performance-2'
          'performance-3  performance-3'
        `
      },
      lg: {
        gridCols: `1fr 1fr 1fr 1fr`,
        gridRows: `auto auto `,
        gridAreas: `
          'quality   performance   performance   performance'
          'quality-1 performance-1 performance-2 performance-3'
        `
      }
    }
  },

  splitWithTitle: {
    className: `page-grid--widget-ui-sizer res-font`,
    gridGap: baseGap,
    gridCols: `1fr`,
    gridRows: `auto auto auto`,
    gridAreas: `
      'title'
      'cell-1'
      'cell-2'
    `,
    mediaBreaks: {
      lg: {
        gridCols: `1fr 1fr`,
        gridRows: `auto 1fr`,
        gridAreas: `
          'title  title'
          'cell-1 cell-2'
        `
      }
    }
  },

  fixedLeft: {
    className: `page-grid--widget-ui-sizer res-font`,
    gridGap: baseGap,
    gridCols: `1fr`,
    gridRows: `auto auto`,
    gridAreas: `
      'left'
      'right'
    `,
    mediaBreaks: {
      md: {
        gridCols: `200px 1fr`,
        gridRows: `auto`,
        gridAreas: `
          'left right'
        `
      }
    }
  }
};
