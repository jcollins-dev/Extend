import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import Modal from './Modal';

export default {
  title: 'UI/Modal',
  component: Modal
} as Meta;

const Template: Story<ComponentProps<typeof Modal>> = (args) => (
  <div style={{ width: '300px' }}>
    <Modal {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Performance'
};
