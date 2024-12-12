import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from 'styled-components';
import demoUnformattedData from '../demo/demoSelectListRawData';
import {
  generateGroupedSelectListItems,
  generateSelectListItems
} from '../helpers/selectListDataHelpers';
import { SelectListProps } from '../SelectList.types';

interface DemoProps {
  data: Record<string, unknown>[];
  startUnselected?: boolean;
}

const Demo = ({ data, startUnselected }: DemoProps): JSX.Element => {
  const groupSelectList = generateGroupedSelectListItems(
    data,
    `activerecipe`,
    `date`,
    startUnselected
  );
  const selectList = generateSelectListItems(data, `activerecipe`, startUnselected);

  return (
    <div>
      <h2>Chart Data Converted Demo</h2>
      <div>
        <h3>For Groupped Select Lists:</h3>
        <div>{JSON.stringify(groupSelectList)}</div>
        <hr />
      </div>
      <div>
        <h3>For Select Lists:</h3>
        <div>{JSON.stringify(selectList)}</div>
        <hr />
      </div>
    </div>
  );
};

export default {
  title: 'StyledUi/SelectListV2/helpers'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Demo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Demo> = (args) => {
  return <Demo {...args} />;
};

export const DataHelpersDemo = Template.bind({});
DataHelpersDemo.args = {
  data: demoUnformattedData,
  startUnselected: false
};
