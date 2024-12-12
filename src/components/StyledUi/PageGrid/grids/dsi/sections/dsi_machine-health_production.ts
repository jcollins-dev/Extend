const baseGap = '.5em';

export const gridDSIProduct = {
  gridGap: baseGap,
  gridAreas: `
      'title'
      'c-1'
      'c-2'
    `,
  gridCols: `1fr`,
  gridRows: `auto`,
  mediaBreaks: {
    md: {
      gridCols: `repeat(2, 1fr)`,
      gridAreas: `
        'title  title'
        'c-1    c-2'
      `
    }
  }
};

export const gridDSISettingQualityPerformance = {
  gridCols: `1fr`,
  gridRows: `auto`,
  gridFlow: `row`,
  gridAreas: `
    'setting'
    's-1'
    's-2'
    'quality'
    'q-1'
    'q-2'
    'q-3'
    'q-4'
  `,
  mediaBreaks: {
    md: {
      gridCols: `repeat(2, 1fr)`,
      gridAreas: `'setting setting''s-1 s-2''quality quality''q-1 q-2''q-3 q-4'
      `
    },
    lg: {
      gridCols: `repeat(3, 1fr)`,
      gridAreas: `
        'setting  quality  quality'
        's-1      q-1      q-2'
        's-2      q-3      q-4'
      `
    }
  }
};
