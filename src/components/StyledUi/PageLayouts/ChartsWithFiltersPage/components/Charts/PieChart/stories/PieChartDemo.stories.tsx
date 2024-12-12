import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PieChartDemo } from '../demo/PieChartDemo';

export default {
  title: 'StyledUi/Charts/Demos'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PieChartDemo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PieChartDemo> = () => {
  return <PieChartDemo />;
};

export const PieChart = Template.bind({});
