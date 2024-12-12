import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import demoUnformattedData from '../demo/demoRecipesHistoryData';
import { BarChart } from '../BarChart/BarChart';
import {
  calculateStackedMaxDomain,
  convertToChartData,
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
} as ComponentMeta<typeof BarChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BarChart> = (args) => {
  return (
    <DemoContainer>
      <BarChart {...args} />
    </DemoContainer>
  );
};

export const BarChartDemo = Template.bind({});
BarChartDemo.args = {
  data: convertToChartData(demoUnformattedData, `date`),
  maxDomain: calculateStackedMaxDomain(demoUnformattedData, `date`),
  categories: generateCategoriesArray(demoUnformattedData, `date`)
};
