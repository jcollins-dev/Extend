import React, { ReactNode, useState, useMemo } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SelectGroupsList } from '../SelectGroupsList';
import { useSelectList } from '../hooks/useSelectList';
import { SelectListDataItemProps } from '../js/selectListHelpers';
import selectListData from '../demo/demoSelectListRawData';
import styled from 'styled-components';

interface Props {
  data: SelectListDataItemProps[];
  showGroupOptions?: boolean;
}

const Container = styled.div``;

const Demo = ({ data }: Props): JSX.Element => {
  const [selected, handle] = useSelectList(data, 'activerecipe', 'date');
  return <SelectGroupsList items={selected} handle={handle} />;
};

export default {
  title: 'StyledUi/SelectList'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Demo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Demo> = (args) => {
  const [selected, handle] = useSelectList(args.data, 'activerecipe', 'date');
  return <SelectGroupsList items={selected} handle={handle} />;
};

export const SelectListWithHandlers = Template.bind({});
SelectListWithHandlers.args = {
  data: selectListData
};
