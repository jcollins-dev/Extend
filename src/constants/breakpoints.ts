const size = {
    xs: 320,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1200,
    xxl: 1300,
    xxxl: 1440,
    xxxxl: 1540
}

const device = {
    xs: `(min-width: ${size.xs}px)`,
    sm: `(min-width: ${size.sm}px)`,
    md: `(min-width: ${size.md}px)`,
    lg: `(min-width: ${size.lg}px)`,
    xl: `(min-width: ${size.xl}px)`,
    xxl: `(min-width: ${size.xxl}px)`,
    xxxl: `(min-width: ${size.xxxl}px)`,
    xxxxl: `(min-width: ${size.xxxxl}px)`
}

export default {size, device}