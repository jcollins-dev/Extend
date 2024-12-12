import 'styled-components';
import { Colors, Typography } from 'types';

// Define shape of custom theme
declare module 'styled-components' {
  export interface DefaultTheme {
    logo: string;
    logoSmall: string;
    colors: Colors;
    typography: Typography;
  }
}
