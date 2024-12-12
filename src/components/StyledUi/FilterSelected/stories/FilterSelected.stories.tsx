import React, { ReactNode } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FilterSelectedProvider, useFilterSelected } from '../hooks/useFilterSelected';
import { FilterSelectedDemo } from '../demo/FilterSelectedDemo';
import { useGetAvureAlarmsQueryDemoDataFormatted } from 'components/StyledUi/demoData/avureAlarmsQueryDemoData';
import { recipesHistoryDemoTableData } from 'components/StyledUi/demoData/recipesHistoryDemoTableData';
import styled from 'styled-components';

const DemoContainer = styled.div`
  width: 30vw;
  min-width: 200px;
  margin: 0 auto;
`;

export default {
  title: 'hooks/Data Filers'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof FilterSelectedProvider>;
/*
export interface FilterSelectedItemsProps {
  data?: Record<string, unknown>[];
  selected?: Record<string, string[]>;
}
const filterSelectedItems = ({
  data,
  selected
}: FilterSelectedItemsProps): Record<string, unknown>[] | undefined => {
  if (!data) return undefined;
  else if (!selected) return data;
  else
    return data.reduce((acc: Record<string, unknown>[], obj) => {
      Object.entries(obj).map(([key, val]) => {
        key = `${key}`;
        val = `${val}`;
        if (selected[key]?.includes(val as string)) {
          acc = [obj, ...acc];
        }
      });
      return acc;
    }, []);
};

*/

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FilterSelectedProvider> = (args) => {
  return <FilterSelectedProvider {...args} />;
};

export const FilterSelectedUsageDemo = Template.bind({});
FilterSelectedUsageDemo.args = {
  children: (
    <FilterSelectedDemo data={recipesHistoryDemoTableData} groupKeys={[`date`, `activerecipe`]} />
  )
};

export const FilterAvureAlarmsDemo = Template.bind({});
FilterAvureAlarmsDemo.args = {
  children: (
    <FilterSelectedDemo
      data={useGetAvureAlarmsQueryDemoDataFormatted}
      groupKeys={[`code`, `type`]}
    />
  )
};
