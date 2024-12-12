import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { BrowserRouter as Router } from 'react-router-dom';
import Breadcrumbs from '.';

export default {
  title: 'UI/Breadcrumbs',
  component: Breadcrumbs
} as Meta;

const Template: Story<ComponentProps<typeof Breadcrumbs>> = (args) => (
  <Router>
    <Breadcrumbs {...args} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      label: 'first page',
      link: '/first-page'
    },
    {
      label: 'current page'
    }
  ]
};
