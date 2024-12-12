import React, { ReactNode, useState, useMemo } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SelectGroupsList } from '../SelectGroupsList';
import selectListData from '../demo/demoSelectListData';

export default {
  title: 'StyledUi/SelectList'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof SelectGroupsList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SelectGroupsList> = (args) => {
  return <SelectGroupsList {...args} />;
};

export const SelectListUiDemo = Template.bind({});
SelectListUiDemo.args = {
  items: selectListData
};
