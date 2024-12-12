import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from 'styled-components';
import demoUnformattedData from '../demo/demoRecipesHistoryData';
import {
  convertToChartData,
  convertToStackedChartData,
  calculateStackedMaxDomain,
  generateCategoriesArray
} from '../helpers/chartDataHelpers';

interface DemoProps {
  data: Record<string, unknown>[];
}
const Demo = ({ data }: DemoProps): JSX.Element => {
  const pieChartData = convertToChartData(data, `activerecipe`);
  const barChartData = convertToStackedChartData(data, `activerecipe`, `date`);
  const maxDomain = calculateStackedMaxDomain(data, `date`);
  const barCategories = generateCategoriesArray(data, `date`);

  return (
    <div>
      <h2>Chart Data Converted Demo</h2>
      <div>
        <h3>For Pie Chart:</h3>
        <div>{JSON.stringify(pieChartData)}</div>
        <hr />
      </div>
      <div>
        <h3>For Bar Pie Chart:</h3>
        <div>maxDomain: {maxDomain}</div>
        <br />
        <div>categories: {JSON.stringify(barCategories)}</div>
        <br />
        <div>{JSON.stringify(barChartData)}</div>
        <hr />
      </div>
    </div>
  );
};

export default {
  title: 'StyledUi/ChartsV2/helpers'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Demo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Demo> = (args) => {
  return <Demo {...args} />;
};

export const BarChartDemo = Template.bind({});
BarChartDemo.args = {
  data: demoUnformattedData
};
