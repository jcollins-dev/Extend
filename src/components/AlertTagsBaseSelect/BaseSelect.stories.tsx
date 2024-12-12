import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import BaseSelect from './BaseSelect';

export default {
  title: 'UI/BaseSelect',
  component: BaseSelect
} as Meta;

const Template: Story<ComponentProps<typeof BaseSelect>> = (args) => (
  <div style={{ width: 300 }}>
    <BaseSelect {...args} />
  </div>
);

export const WithStringOptions = Template.bind({});
WithStringOptions.args = {
  options: ['option 1', 'option 2']
};

export const Searchable = Template.bind({});
Searchable.args = {
  options: [
    {
      label: 'label 1',
      value: '1'
    },
    {
      label: 'label 1',
      value: '2'
    },
    {
      label: 'test 3',
      value: '3'
    }
  ],
  searchable: true
};

export const ValueDifferentToLabel = Template.bind({});
ValueDifferentToLabel.args = {
  options: [
    {
      label: 'label 1',
      value: '1'
    },
    {
      label: 'label 2',
      value: '2'
    },
    {
      label: 'test 3',
      value: '3'
    }
  ]
};

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
  options: ['option 1', 'option 2'],
  placeholder: 'Placeholder text'
};
