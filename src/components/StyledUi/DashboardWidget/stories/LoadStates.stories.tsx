import React from 'react';
import { DashboardWidget } from 'components';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'ExtendUi/DashboardWidgets',
  component: DashboardWidget,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

  // hidden
  argTypes: {
    title: {
      description: 'Text only headline of widget.  Leave blank if being used as a tile.'
    },
    children: {
      description:
        'You can wrap any component with this one, or you can provide it a component from the Main: property.',
      control: { type: 'text' }
    },
    isLoading: {
      table: { category: 'Status Settings' },
      control: { type: 'boolean' },
      description:
        'If isLoading the widget will display the loader.  When isLoading is false or undefined, the component will rended and the width and height will be sent to the `Load` component.'
    },
    hasError: {
      table: { category: 'Status Settings' },
      control: { type: 'text' },
      description:
        'Error message to display if there is an error.  If this has a value, the widget will not load the child or `Load` component.  Will instead display the provided error message.'
    },
    SubTitle: { table: { disable: true } },
    hasDatePicker: { table: { disable: true } },
    showDateRange: { table: { disable: true } },
    linksToPath: { table: { disable: true } },
    subtractDaysCount: { table: { disable: true } },
    dayRanges: { table: { disable: true } },
    SubHeader: { table: { disable: true } },
    AfterMain: { table: { disable: true } },
    Main: { table: { disable: true } },
    gridStyle: { table: { disable: true } },
    isCentered: { table: { disable: true } },
    refs: { table: { disable: true } },
    iconLeft: { table: { disable: true } },
    iconRight: { table: { disable: true } },
    hasLeft: { table: { disable: true } },
    hasRight: { table: { disable: true } },
    hasFooter: { table: { disable: true } },
    hasFlyOut: { table: { disable: true } },
    hasStatusIcon: { table: { disable: true } },
    hasSubHeader: { table: { disable: true } },
    hasHeader: { table: { disable: true } },
    Header: { table: { disable: true } },
    Footer: { table: { disable: true } }
    //hasFlyOut: { table: { disable: true } },
    //Main: { table: { disable: true } }
  }
} as ComponentMeta<typeof DashboardWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DashboardWidget> = (args) => {
  return <DashboardWidget {...args} />;
};

export const LoadingStatus = Template.bind({});
LoadingStatus.args = {
  title: 'Widget loading data',
  children: <div>This component is done loading</div>,
  isLoading: true
};

export const ErrorStatus = Template.bind({});
ErrorStatus.args = {
  title: 'Widget loading data',
  children: <div>This component is done loading</div>,
  hasError: 'there has been error loading data'
};

export const NoStatus = Template.bind({});
NoStatus.args = {
  title: 'Widget loading data',
  children: <div>This component is done loading</div>
};
