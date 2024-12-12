import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChartsDataFilter } from '../ChartsDataFilter';
import data from '../demo/demoRecipesHistoryData';
import { filterDataBySelectedItems, useGroupSelectList } from 'components/StyledUi/SelectListV2';

import styled from 'styled-components';

const DemoContainer = styled.div`
  width: 30vw;
  min-width: 200px;
  margin: 0 auto;
`;

export default {
  title: 'StyledUi/GroupedLayouts/ChartsDataFilter'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ChartsDataFilter>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ChartsDataFilter> = (args) => {
  const { groupKey, itemKey, data } = args;

  const Provided = () => {
    const { selected } = useGroupSelectList();

    if (!selected) return <div>Loading</div>;
    const filteredData = filterDataBySelectedItems(groupKey, itemKey, data, selected);
    return (
      <div>
        <h3>Filtered Data</h3>
        <div>{JSON.stringify(filteredData)}</div>
      </div>
    );
  };

  return (
    <ChartsDataFilter {...args}>
      <Provided />
    </ChartsDataFilter>
  );
};

export const ChartsDataFilterDemo = Template.bind({});
ChartsDataFilterDemo.args = {
  data,
  groupKey: `activerecipe`,
  itemKey: `date`,
  title: `Filtered Demo Items`,
  containerHeight: `370px`
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  containerHeight: `270px`
};

export const Error = Template.bind({});
Error.args = {
  hasError: `Storybook Error Message`,
  containerHeight: `270px`
};

export const Message = Template.bind({});
Message.args = {
  hasMessage: `Have A Nice Day`,
  containerHeight: `270px`
};

export const NoValuesInRange = Template.bind({});
NoValuesInRange.args = {
  data: [],
  containerHeight: `270px`
};
