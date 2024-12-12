import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BarChartDemo } from '../demo/BarChartDemo';

export default {
  title: 'StyledUi/Charts/Demos'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof BarChartDemo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BarChartDemo> = () => {
  return <BarChartDemo />;
};

export const BarChart = Template.bind({});
