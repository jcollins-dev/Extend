import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import demoUnformattedData from '../demo/demoRecipesHistoryData';
import { PieChart } from '../PieChart/PieChart';
import { convertToChartData } from '../helpers/chartDataHelpers';
import styled from 'styled-components';

const DemoContainer = styled.div`
  width: 30vw;
  min-width: 200px;
  margin: 0 auto;
`;

export default {
  title: 'StyledUi/ChartsV2/Charts'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PieChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PieChart> = (args) => {
  return (
    <DemoContainer>
      <PieChart {...args} />
    </DemoContainer>
  );
};

export const PieChartDemo = Template.bind({});
PieChartDemo.args = {
  data: convertToChartData(demoUnformattedData, `activerecipe`)
};
