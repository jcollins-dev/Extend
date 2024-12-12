import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import FlyoutHeader from '.';

export default {
  title: 'UI/FlyoutHeader',
  component: FlyoutHeader
} as Meta;

const Template: Story<ComponentProps<typeof FlyoutHeader>> = (args) => (
  <div style={{ width: '500px' }}>
    <FlyoutHeader {...args} />
  </div>
);

export const WithCloseButton = Template.bind({});
WithCloseButton.args = {
  heading: 'Lorem ipsum dolor',
  onClose: () => null,
  onBack: null
};

export const WithBackButton = Template.bind({});
WithBackButton.args = {
  heading: 'Lorem ipsum dolor',
  onBack: () => null,
  onClose: null
};

export const WithCloseAndBackButtons = Template.bind({});
WithCloseAndBackButtons.args = {
  heading: 'Lorem ipsum dolor',
  onClose: () => null,
  onBack: () => null
};

const TestAfterComponent = () => <div style={{ background: 'red', width: 15, height: 15 }}></div>;

export const WithAfterComponent = Template.bind({});
WithAfterComponent.args = {
  heading: 'Lorem ipsum dolor',
  onClose: () => null,
  onBack: () => null,
  afterComponent: <TestAfterComponent />
};
