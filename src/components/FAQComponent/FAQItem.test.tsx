import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

// Theme
import theme from 'themes';
import { FAQItemProps } from 'types';
import FAQItem from './FAQItem';

describe('FAQItem', () => {
  it('It should mount', () => {
    const div = document.createElement('div');

    const testFAQItems: FAQItemProps = {
      question: 'test',
      answers: ['test answers'],
      subanswers: ['test subanswers']
    };
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <FAQItem
          key="test"
          question={testFAQItems.question}
          answers={testFAQItems.answers}
          subanswers={testFAQItems.subanswers}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
