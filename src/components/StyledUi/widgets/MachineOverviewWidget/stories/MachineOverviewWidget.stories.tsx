import React from 'react';
import { MachineOverviewWidget } from '../MachineOverviewWidget';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'StyledUi/WidgetUi/variants/MachineOverviewWidget',
  component: MachineOverviewWidget,
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
    Footer: { table: { disable: true } }
  }
} as ComponentMeta<typeof MachineOverviewWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MachineOverviewWidget> = (args) => {
  return <MachineOverviewWidget {...args} />;
};

export const AllValues = Template.bind({});
AllValues.args = {
  title: 'Machine Overview Widget',
  handleHeaderIconClick: () => alert('clicked'),
  Footer: <button>footer button</button>,
  contentRows: [
    {
      isHeader: true,
      label: 'Machine Subsystems Information'
    },
    {
      label: 'Belt 1 Speed',
      value: '0.0 m/min'
    },
    {
      label: 'Air Temperature',
      value: ' -Z1 23 °C'
    },
    {
      label: 'Humidity Dew Point',
      value: '-22.1%'
    },
    {
      label: 'Humidity MV',
      value: '0.3%'
    }
  ]
};

export const AvureDemo = Template.bind({});
AvureDemo.args = {
  title: 'Machine Overview Widget',
  contentRows: [
    {
      label: 'Processed cycles in the last hour',
      value: '7/8'
    },
    {
      label: 'Average waiting time in the last hour',
      value: '02:35'
    }
  ]
};
