const colors = {
  main: '#303E47',
  mainLight: '#556c7d',
  neg: 'white',
  primary: '#303E47',
  primaryAlt: '#303E47',
  secondaryLight: `#F1F7FF`,
  secondary: '#0A70FF',
  secondaryAlt: '#0A70FF',
  darken: 'rgba(0,0,0,.25)',
  dark: 'rgba(0,0,0,.5)',
  darker: 'rgba(0,0,0,.65)',
  darkest: 'rgba(0,0,0,.8)',
  gray: `#828285`
};

const text = {
  ...colors
};

const border = {
  main: '#C2C2C6',
  light: '#D0D5DD'
};

const bg = {
  negLightest: '#F9FAFB',
  negLighter: '#F1F3F4'
};

const headline = {
  primary: colors.primary
};

const status = {
  error: {
    lighter: '#FFEFEC',
    light: '#FFBCB2',
    base: '#EF4444'
  },
  warning: {
    lighter: '#FFEFEC',
    light: '#FFC9A2',
    base: '#EA7600'
  },
  success: {
    lighter: '#EDF8F2',
    light: '#B5E4CB',
    base: '#28B981'
  }
};

export default { text, border, bg, headline, status, ...colors };
