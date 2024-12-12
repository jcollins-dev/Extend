import React, { ReactNode } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { GroupSelectLists } from '../GroupSelectLists';
import selectListData from '../demo/demoSelectListRawData';
import { generateGroupedSelectListItems } from '../helpers/selectListDataHelpers';
import { SelectListItemCustomProps } from '../SelectList.types';
import { useGroupSelectList, UseGroupSelectListProvider } from '../hooks/useSelectList';
import { SelectListHistoryButtons } from '../SelectListHistoryButtons';

import styled from 'styled-components';

const DemoListContainer = styled.div`
  background: pink;
`;

export default {
  title: 'StyledUi/SelectListV2/hooks/UseGroupSelectList'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof GroupSelectLists>;

const Demo: ComponentStory<typeof GroupSelectLists> = (args): JSX.Element => {
  const { selected, handle } = useGroupSelectList();

  return (
    <div>
      <SelectListHistoryButtons />
      <GroupSelectLists items={selected} {...{ handle }} {...args} />
    </div>
  );
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GroupSelectLists> = (args) => {
  const { items, ...rest } = args;
  return (
    <UseGroupSelectListProvider items={items}>
      <Demo {...rest} />
    </UseGroupSelectListProvider>
  );
};

const items = generateGroupedSelectListItems(selectListData, `activerecipe`, `date`);

export const UseGroupSelectListHook = Template.bind({});
UseGroupSelectListHook.args = {
  items
};
