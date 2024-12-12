import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import UploadButton from './UploadButton';

export default {
  title: 'UI/UploadButton',
  component: UploadButton
} as Meta;

const Template: Story<ComponentProps<typeof UploadButton>> = (args) => (
  <div style={{ width: '18.75rem' }}>
    <UploadButton {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};
