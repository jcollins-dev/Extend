import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

// Theme
import theme from 'themes';
import FAQ from './FAQ';
import { FAQCategories, FAQItemProps } from 'types';

describe('FAQTest', () => {
  it('It should mount', () => {
    const div = document.createElement('div');

    const testFAQItems: FAQItemProps[] = [
      {
        question: 'test',
        answers: ['test answers'],
        subanswers: ['test subanswers']
      }
    ];
    const testFAQ: FAQCategories[] = [
      {
        category: 'test',
        faqs: testFAQItems
      }
    ];
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <FAQ items={testFAQ} key="test" />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
