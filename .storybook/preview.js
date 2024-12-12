import { ThemeProvider } from 'styled-components';
import { DateRangeProvider } from '../src/components';
import { GlobalStyle } from '../src/themes/GlobalStyle';
import theme from '../src/themes';
import '../src/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};

export const withThemeProvider = (Story) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <DateRangeProvider subtractDaysCount={15}>
      <Story />
    </DateRangeProvider>
  </ThemeProvider>
);

export const decorators = [withThemeProvider];
