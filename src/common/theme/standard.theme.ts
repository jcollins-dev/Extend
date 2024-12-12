const base = 1;
const unit = 'rem';

/** used for margins and padding */
export const space = {
  xs: `${base * 0.5}${unit}`,
  sm: `${base * 0.65}${unit}`,
  md: `${base * 0.8}${unit}`,
  base: `${base}${unit}`,
  lg: `${base * 1.25}${unit}`,
  xl: `${base * 1.4}${unit}`,
  xxl: `${base * 1.7}${unit}`
};

const fntbase = 1;
/** short-hand for font-size */
export const fnt = {
  sm: `${fntbase * 0.7}${unit}`,
  md: `${fntbase * 0.85}${unit}`,
  base: `${fntbase}${unit}`,
  lg: `${fntbase * 1.25}${unit}`,
  xl: `${fntbase * 1.5}${unit}`
};

export const radius = {
  base: '0.625rem',
  sm: '.3rem',
  xs: '5px'
};
