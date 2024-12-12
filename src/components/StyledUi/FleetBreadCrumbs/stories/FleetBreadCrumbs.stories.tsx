import React from 'react';
import { FleetBreadCrumbs } from '../FleetBreadCrumbs';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'ExtendUi/FleetBreadCrumbs/UI',
  component: FleetBreadCrumbs,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

  // hidden
  argTypes: {
    Footer: { table: { disable: true } }
    //hasFlyOut: { table: { disable: true } },
    //Main: { table: { disable: true } }
  }
} as ComponentMeta<typeof FleetBreadCrumbs>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FleetBreadCrumbs> = (args) => {
  return (
    <div>
      <FleetBreadCrumbs {...args} />
    </div>
  );
};

export const AllItems = Template.bind({});
AllItems.args = {
  paths: {
    customer: {
      label: `customer`,
      slug: `/fleet`
    },
    site: {
      label: 'site',
      slug: `/fleet/site`
    },
    line: {
      label: 'line',
      slug: `/customer/line/234sdfw234sdfcv`
    },
    machine: {
      label: 'machine',
      slug: `/customer/line/234sdfw234sdfcv`
    }
  },
  handleEdit: () => alert('clicked'),
  machineStatus: {
    hasError: undefined,
    isLoading: false,
    machineStatus: 'good',
    dataStatus: 'good',
    lastConnected: '2000-09-23T12:39:57+00:00'
  }
};

export const NotLoaded = Template.bind({});
NotLoaded.args = {
  paths: {
    customer: {
      isLoading: true
    },
    site: {
      isLoading: true
    },
    line: {
      isLoading: true
    },
    machine: {
      isLoading: true
    }
  },
  handleEdit: () => alert('clicked'),
  machineStatus: {
    isLoading: true
  }
};

export const LineView = Template.bind({});
LineView.args = {
  paths: {
    customer: {
      label: 'customer',
      slug: `customer`
    },
    site: {
      label: 'site'
    },
    machine: {
      label: 'machine',
      slug: `customer`
    }
  },
  children: <div>This is a child</div>
};
