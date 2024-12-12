import React from 'react';
import { TileWidget } from '../TileWidget';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'StyledUi/WidgetUi/variants/TileWidget',
  component: TileWidget,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    isLoading: {
      table: { category: 'Data Loader' },
      control: { type: 'boolean' },
      description:
        'If you need to assign provided a ref to the Header, Container, or ( Main, (children)) then provided it as an object { refs: mainRef, headerRer, containerRef }'
    },
    hasStatus: {
      control: {
        type: 'select',
        options: ['good', 'bad', 'success', 'error', 'loading', 'warning', undefined],
        description: 'Controls the status state of widget that defines the colors based on status'
      }
    },
    IconLeft: { table: { disable: true } },
    IconRight: { table: { disable: true } },
    Header: { table: { disable: true } },
    Footer: { table: { disable: true } },
    AfterMain: { table: { disable: true } },
    Main: { table: { disable: true } },
    SubTitle: { table: { disable: true } }
  }
} as ComponentMeta<typeof TileWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TileWidget> = (args) => {
  return <TileWidget {...args} />;
};

export const AllValues = Template.bind({});
AllValues.args = {
  title: 'Tile Widget',
  subTitle: 'demo',
  cellValues: [
    {
      value: '98%',
      title: 'average',
      label: 'lbs/minute'
    },
    {
      value: '87%',
      title: 'average',
      label: 'lbs/minute'
    },
    {
      value: '55%',
      label: 'lbs/minute'
    }
  ]
};
