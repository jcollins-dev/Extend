import React from 'react';
import { MachineDetailsBar } from '../MachineDetailsBar';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'StyledUi/MachineDetailBar',
  component: MachineDetailsBar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

  // hidden
  argTypes: {
    //Footer: { table: { disable: true } }
    //hasFlyOut: { table: { disable: true } },
    //Main: { table: { disable: true } }
  }
} as ComponentMeta<typeof MachineDetailsBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MachineDetailsBar> = (args) => {
  return <MachineDetailsBar {...args} />;
};

export const DefaultDemo = Template.bind({});
DefaultDemo.args = {
  serialNumber: `0923429324234`,
  orderNumber: `drf3-234lfor`,
  productionState: `Production Running`
};
