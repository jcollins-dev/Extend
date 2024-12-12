import { testMaintenanceEventData } from 'constants/testdata';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { default as store } from 'store';
import theme from 'themes';
import { ThemeProvider } from 'styled-components';
import MaintenanceEventDetailCard from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <MaintenanceEventDetailCard description="test" isLoading={false} />
      </Provider>
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
