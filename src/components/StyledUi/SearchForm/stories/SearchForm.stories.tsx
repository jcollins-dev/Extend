import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import data from '../demo/demoSearchFormData';
import { SearchForm } from '../SearchForm';
import styled from 'styled-components';

const DemoContainer = styled.div`
  width: 30vw;
  min-width: 500px;
  margin: 0 auto;
`;

export default {
  title: 'StyledUi/SearchForm'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof SearchForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SearchForm> = (args) => {
  return (
    <>
      <SearchForm {...args} />
    </>
  );
};

export const BasicDemo = Template.bind({});
BasicDemo.args = {
  handleSubmit: (x?: string) => alert(`submitted ${x}`)
};

export const WithSuggestions = Template.bind({});
WithSuggestions.args = {
  data: data,
  handleSubmit: (x?: string) => alert(`submitted ${x}`),
  hasSuggestions: true
};
