import React, { ReactNode } from 'react';

/*
const demoLightTheme = {
  logo: '',
  logoSmall: '',
  colors: {},
  typography: {}
}

const demoDarkTheme = {
  colors: {
    main: 'white'
  }
}
*/

export interface ThemeProviderProps {
  theme?: Record<string, unknown>;
  mode?: 'light' | 'dark';
}

interface Props extends ThemeProviderProps {
  children: ReactNode | ReactNode[];
}

export const ThemeProvider = ({ children }: Props): JSX.Element => {
  //const [themeMode, setThemeMode] = useState('light')

  return <>{children}</>;
};
