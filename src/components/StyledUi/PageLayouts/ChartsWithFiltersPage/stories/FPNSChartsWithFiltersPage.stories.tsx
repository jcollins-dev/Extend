import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChartsWithFiltersPage } from '../ChartsWithFiltersPage';
import { FPNSAlarmsDemoPage } from '../demoPages/FPNSAlarmsPage';

export default {
  title: 'PageViews/ChartsAndFilters'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ChartsWithFiltersPage>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ChartsWithFiltersPage> = () => {
  return <FPNSAlarmsDemoPage />;
};

export const FPNSChartsWithFiltersPageDemo = Template.bind({});
