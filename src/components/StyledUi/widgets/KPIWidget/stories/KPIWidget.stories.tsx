import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { KPIWidget } from '../KPIWidget';
import { demoDataArray as values } from '../demo/kpiDemoData';

//import data from '../demo/demoRecipesHistoryData';
//import { filterDataBySelectedItems, useGroupSelectList } from 'components/StyledUi/SelectListV2';

export default {
  title: 'StyledUi/WidgetUi/variants/KPIWidget'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof KPIWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof KPIWidget> = (args) => {
  return <KPIWidget {...args} />;
};

export const KPIWidgetDemo = Template.bind({});
KPIWidgetDemo.args = {
  title: `KPI Widget Demo`,
  isLoading: false,
  hasError: undefined,
  hasMessage: undefined,
  translateTitle: `KPI Widget Demo`,
  progress: {
    value: 98
  },
  values
};

export const KPIWidget2ColDemo = Template.bind({});
KPIWidget2ColDemo.args = {
  title: `KPI Widget Demo`,
  isLoading: false,
  hasError: undefined,
  hasMessage: undefined,
  translateTitle: `KPI Widget Demo`,
  progress: {
    value: 98
  },
  values: [
    {
      label: `Avg Actual`,
      value: `360`,
      units: `sec`
    },
    {
      label: `Avg Target`,
      value: `380`,
      units: `sec`
    }
  ]
};
