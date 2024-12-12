import * as base from './standard.theme';
import { font } from './fonts';
import light from './light.theme';
import * as effects from './effects';
import * as charts from './charts';

export const styledTheme = { effects, color: light, font, ...charts, ...base };
