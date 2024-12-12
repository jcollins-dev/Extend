import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import SaveTemplateModal from '.';
import { DataAnalysisProperty, DataAnalysisTag } from 'types/protein';

it('It should mount', () => {
  const div = document.createElement('div');
  const templateName = 'template name';
  const tags: DataAnalysisTag[] = [
    {
      tagCode: 'tagCode1',
      isLeftSide: true
    }
  ];
  const properties: DataAnalysisProperty[] = [
    {
      property: 'property name',
      value: 'property value'
    }
  ];
  const mockCloseModal = jest.fn();
  const mockHandleNameChange = jest.fn();

  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SaveTemplateModal
            properties={properties}
            tagsData={tags}
            templateName={templateName}
            closeModal={mockCloseModal}
            handleNameChange={mockHandleNameChange}
          />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
