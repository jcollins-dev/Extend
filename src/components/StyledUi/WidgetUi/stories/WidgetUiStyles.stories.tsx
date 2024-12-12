import React from 'react';
import { WidgetUi } from 'components';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'StyledUi/WidgetUi/styles',
  component: WidgetUi,
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
} as ComponentMeta<typeof WidgetUi>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WidgetUi> = (args) => {
  return (
    <WidgetUi {...args}>
      <div key="1" className="res-font__xl">
        Demo
      </div>
      <div key="2" className="res-font__md">
        responsive text
      </div>
    </WidgetUi>
  );
};

export const ResponsiveFont = Template.bind({});
ResponsiveFont.args = {
  className: 'res-font',
  title: 'Ui Widget Res Font'
};
