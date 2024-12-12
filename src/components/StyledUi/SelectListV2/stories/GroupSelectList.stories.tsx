import React, { ReactNode } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { GroupSelectLists } from '../GroupSelectLists';
import selectListData from '../demo/demoSelectListRawData';
import { generateGroupedSelectListItems } from '../helpers/selectListDataHelpers';
import { SelectListItemCustomProps } from '../SelectList.types';

import styled from 'styled-components';

const DemoListContainer = styled.div`
  background: pink;
`;

const DemoItemContainer = styled.div`
  color: red;
  border-bottom: solid 1px green;
  padding: 1em;
`;

const ItemContainer = ({ i, label, isSelected, children }: SelectListItemCustomProps) => {
  return (
    <DemoItemContainer>
      {children} [{i}] : {label} selected: {isSelected ? `true` : `false`}
    </DemoItemContainer>
  );
};

export default {
  title: 'StyledUi/SelectListV2/UiDemos/GroupSelectList'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof GroupSelectLists>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GroupSelectLists> = (args) => {
  return <GroupSelectLists {...args} />;
};

const items = generateGroupedSelectListItems(selectListData, `activerecipe`, `date`);

export const SelectListDefaultUi = Template.bind({});
SelectListDefaultUi.args = {
  items
};

export const SelectListUiWithCustomContainer = Template.bind({});
SelectListUiWithCustomContainer.args = {
  items,
  Container: DemoListContainer
};

export const SelectListUiWithCustomItemContainer = Template.bind({});
SelectListUiWithCustomItemContainer.args = {
  items,
  ItemContainer
};
