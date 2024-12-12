const baseGap = '.5em';

export const gridDSIMachineImage = {
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
      'machine'
      'c-1'
      'c-2'
    `,
  gridCols: `1fr`,
  gridRows: `repeat(3, 1fr)`,
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
          'machine c-1'
          'machine c-2'
        `,
      gridCols: `1fr 1.5fr`,
      gridRows: `repeat(2, 1fr)`
    },
    lg: {
      //-------------------------//
      // This this makes the right side twice as big as left
      //  __________
      // |   |______|
      // |___|______|
      //
      gridAreas: `
          'machine c-1'
          'machine c-2'
        `,
      gridCols: `1fr 2fr`
    }
  }
};

export const gridDSIQualityPerformance = {
  gridCols: `1fr`,
  gridRows: `auto`,
  gridAreas: `
    'quality'
    'q-1'
    'performance'
    'p-1'
    'p-2'
    'p-3'
  `,
  mediaBreaks: {
    md: {
      gridCols: `repeat(3, 1fr)`,
      gridAreas: `
        'quality  performance performance'
        'q-1      p-1         p-2'
        'q-1      p-3         p-3'
      `
    },
    lg: {
      gridCols: `repeat(4, 1fr)`,
      gridAreas: `
        'quality  performance performance performance'
        'q-1      p-1         p-2         p-3'
      `
    }
  }
};
