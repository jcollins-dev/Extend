import theme from 'themes';

// see 'normalize' function
const TARGET_RANGE = {
  min: 50,
  max: 750
};

// Possible range of the position indicator
const pRmin = 0;
const pRmax = 100;

// Scale position (x) between [rMin, rMmax]
// rMax: max of target range
// rMin: min of target range
// [min, max] possible range of x
// xNormalized = (rMax−rMin) * (x−min(x) / max(x) - min(x)) + rMin
//
export const normalize = (
  rmax: number,
  rmin: number,
  max: number,
  min: number,
  x: number
): number => {
  return (rmax - rmin) * ((x - min) / (max - min)) + rmin;
};

// Create a linear gradient.
//  'svg' is the write-only array of SVG parts where the linearGradient will be appended.
const createlinearGradient = (svg: string[]): void => {
  svg.push(
    '<defs>',
    '<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">',
    '<stop offset="0%" style="stop-color:rgba(240, 130, 129, 0.85);stop-opacity:1" />',
    '<stop offset="53.4%" style="stop-color:rgba(240, 188, 145, 0.85);stop-opacity:1" />',
    ' <stop offset="100%" style="stop-color:rgba(116, 204, 167, 0.85);stop-opacity:1" />',
    '</linearGradient>',
    '</defs>'
  );
};

// Draw an SVG horizontal arrow-bar.
//  'svg' is the write-only array of SVG parts where the arrow-bar will be appended.
const drawArrowBar = (svg: string[]): void => {
  svg.push(`<polygon fill="url(#gradient)" points="20,20 750,20 780,50 750,80 20,80 50,50" />`);
};

// Draw a set of SVG vertical lines.
//  'svg' is the write-only array of SVG parts where the lines will be appended.
const drawVerticalLines = (svg: string[]): void => {
  const thresholds = ['20%', '32%', '44%', '56%', '68%', '80%'];
  thresholds.forEach((threshold) => {
    svg.push(
      `<line x1="${threshold}" y1="20" x2="${threshold}" y2="80" stroke="#FFFFFF" stroke-width="2.5" />`
    );
  });
};

// Draw an SVG position indicator.
const drawPositionIndicator = (svg: string[], position: number): void => {
  const normilized = normalize(TARGET_RANGE.max, TARGET_RANGE.min, pRmax, pRmin, position);
  svg.push(`
      <polygon fill="black" points="${normilized - 20},0 ${normilized + 20},0 ${normilized},30" />
      <polygon fill="black" points="${normilized - 20},100 ${
    normilized + 20
  },100 ${normilized},70" />`);
};

// Join all the SVG parts
export const buildSvg = (position: number): string => {
  const svg: string[] = [`<svg xmlns="http://www.w3.org/2000/svg" viewbox='0, 0, 800, 100'>`];
  createlinearGradient(svg);
  drawArrowBar(svg);
  drawVerticalLines(svg);
  drawPositionIndicator(svg, position);
  svg.push('</svg>');
  return svg.join('');
};

// Get <Chip /> props based on supplied thresholds
// TODO - Set exact values once confirmed by PO
export const getChipProps = (position: number): Record<string, string | number> => {
  const normalizedPos = normalize(80, 0, 100, 0, position);
  if (position > 70)
    return {
      message: 'Good',
      color: theme.colors.indicators.good,
      bgColor: theme.colors.onTrackGreen5,
      position: normalizedPos
    };
  if (position > 40) {
    return {
      message: 'Poor',
      color: theme.colors.indicators.warning,
      bgColor: theme.colors.atRiskYellow4,
      position: normalizedPos
    };
  }
  return {
    message: 'Bad',
    color: theme.colors.indicators.bad,
    bgColor: theme.colors.atRiskYellow3,
    position: normalizedPos
  };
};

// Sanitize indicator position
export const sanitize = (position: number): number =>
  position < 0 ? 0 : position > 100 ? 100 : position;
