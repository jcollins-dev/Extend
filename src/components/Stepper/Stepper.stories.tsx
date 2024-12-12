import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import Stepper from '.';
import Step from './Step';

export default {
  title: 'UI/Stepper',
  component: Stepper
} as Meta;

const Template: Story<ComponentProps<typeof Stepper>> = (args) => (
  <div style={{ width: '28.125rem' }}>
    <Stepper {...args} />
  </div>
);

const steps = [
  <Step
    description="Nam quis ligula erat. Phasellus luctus velit nibh, et facilisis velit pulvinar vitae."
    header="Lorem Ipsum"
    imgSrc="https://via.placeholder.com/300x200"
    key={0}
  />,
  <Step
    description="Ac arcu finibus tempus. Integer vel mi blandit, euismod justo et, congue nisl. In sed nibh at libero maximus vestibulum."
    header="Dolor Sit Amet"
    imgSrc="https://via.placeholder.com/300"
    key={1}
  />,
  <Step
    header="Consectetur"
    description="Sed feugiat ultrices lectus eget volutpat. Nulla semper aliquet dui non ultricies. Vestibulum risus lorem, pellentesque pharetra leo non, convallis finibus sapien."
    imgSrc="https://via.placeholder.com/400x200"
    key={2}
  />,
  <Step
    description="Mauris in consequat justo, a pellentesque eros. Donec semper auctor eros nec lobortis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
    header="Adipiscing Elit"
    imgSrc="https://via.placeholder.com/350x250"
    key={3}
  />,
  <Step
    description="Nulla facilisi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent at lacinia nibh."
    header="Nullam et Nunc"
    imgSrc="https://via.placeholder.com/500x400"
    key={4}
  />
];

export const Default = Template.bind({});

Default.args = {
  onCancelCallback: () => console.log('Cancel callback'),
  steps
};
