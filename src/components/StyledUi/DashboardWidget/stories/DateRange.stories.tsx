import React from 'react';
import { DashboardWidget } from 'components';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'ExtendUi/DashboardWidgets',
  component: DashboardWidget,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

  // hidden
  subtractDaysCount: {
    control: { type: 'number' },
    description:
      'The default number of days to go back from today for dateRange.  By settings this, you are enabling widget specific date ranges that are provided to children via context.'
  },
  argTypes: {
    title: {
      description: 'Text only headline of widget.  Leave blank if being used as a tile.'
    },
    children: {
      description:
        'You can wrap any component with this one, or you can provide it a component from the Main: property.',
      control: { type: 'text' }
    },
    SubTitle: {
      table: { category: 'Optional Header Settings' },
      description:
        'Smaller text to display in header directly under the headline.  This gets wrapped in a span to style the text but is part of the H3 tag'
    },
    hasDatePicker: {
      control: { type: 'boolean' },
      table: { category: 'Component Date Settings' },
      description: 'Adds a date picker to customize the dateRange for this widget only.'
    },
    showDateRange: {
      control: { type: 'boolean' },
      table: { category: 'Component Date Settings' },
      description: 'Displays widgets formatted date range in the subTitle section of the Header.'
    },
    linksToPath: {
      table: { category: 'Component Extras' },
      control: { type: 'text' },
      description:
        'String format url path to automatically use react router.  If hasDatePicker is true, it will override this setting.'
    },
    dayRanges: {
      table: { category: 'Component Date Settings' },
      control: { type: 'array' },
      description:
        'An array of numbers used for the date picker calendar.  You can customize the select by days ranges on the calendar if hasDatePicker is set.'
    },
    SubHeader: {
      table: { category: 'Optional Header Settings' },
      control: { type: 'text' },
      description:
        'What displays under the header on the sub-header area of the grid. Can be a string or component This is overwritten if hasDatePicker.  grid-area: sub-header'
    },
    AfterMain: {
      table: { category: 'Optional Components' },
      control: { disable: true },
      description:
        'Gets loaded outside of the main wrapper if you want to add an element that is outside of mains overflow.  Suggested to use grid-area: main'
    },
    Main: {
      table: { category: 'Optional Components' },
      control: { disable: true },
      description:
        'Replaces children with a provided compontnet.  This is good if you want to wait until data is loaded to load a child component.'
    },
    gridStyle: {
      table: { category: 'Style Settings' },
      control: { type: 'boolean' },
      description: 'Uses the grid layout for position and sizing accuracy'
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
    isCentered: {
      table: { category: 'Style Settings' },
      control: { type: 'boolean' },
      description:
        'Centers the content using flex.  This effects the components children or provided `Main` component.'
    },
    refs: {
      table: { category: 'Incoming Functions' },
      control: { disable: true },
      description:
        'If you need to assign provided a ref to the Header, Container, or ( Main, (children)) then provided it as an object { refs: mainRef, headerRer, containerRef }'
    },
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
  return (
    <div>
      <DashboardWidget {...args} />
    </div>
  );
};

export const DateRange = Template.bind({});
DateRange.args = {
  title: 'Demo Date Picker Component',
  children: <div>This is a basic component</div>,
  showDateRange: true,
  hasDatePicker: true
};

export const CustomDateRange = Template.bind({});
CustomDateRange.args = {
  title: 'Demo Date Picker Component',
  children: <div>This is a basic component</div>,
  showDateRange: true,
  subtractDaysCount: 1
};
