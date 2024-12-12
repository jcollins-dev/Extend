import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import demoUnformattedData from '../demo/demoRecipesHistoryData';
import { StackedBarChart } from '../BarChart/StackedBarChart';
import {
  calculateStackedMaxDomain,
  convertToStackedChartData,
  generateCategoriesArray
} from '../helpers/chartDataHelpers';
import styled from 'styled-components';

const DemoContainer = styled.div`
  width: 30vw;
  min-width: 500px;
  margin: 0 auto;
`;

export default {
  title: 'StyledUi/ChartsV2/Charts'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof StackedBarChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof StackedBarChart> = (args) => {
  return (
    <DemoContainer>
      <StackedBarChart {...args} />
    </DemoContainer>
  );
};

export const StackedBarChartDemo = Template.bind({});
StackedBarChartDemo.args = {
  data: convertToStackedChartData(demoUnformattedData, `activerecipe`, `date`),
  maxDomain: calculateStackedMaxDomain(demoUnformattedData, `date`),
  categories: generateCategoriesArray(demoUnformattedData, `date`),
  tickMarks: generateCategoriesArray(demoUnformattedData, `date`)
};
