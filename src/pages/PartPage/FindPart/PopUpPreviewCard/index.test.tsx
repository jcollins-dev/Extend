import { testPart } from "constants/testdata";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom';
import store from "store";
import { ThemeProvider } from "styled-components";
import theme from "themes";
import PopUpPreviewCard from ".";


describe('PopUpPreviewCard', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Router>
        <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PopUpPreviewCard part={testPart} show={true} top={100} left={100} setShowFunction={() => {}}/>
        </ThemeProvider>
        </Provider>
      </Router>
      ,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});