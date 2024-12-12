import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StackedBarChartDemo } from '../demo/StackedBarChartDemo';

export default {
  title: 'StyledUi/Charts/Demos'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof StackedBarChartDemo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof StackedBarChartDemo> = () => {
  return <StackedBarChartDemo />;
};

export const StackedBarChart = Template.bind({});
