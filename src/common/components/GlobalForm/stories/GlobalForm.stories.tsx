import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GlobalForm } from '../GlobalForm';
import styled from 'styled-components';

const DemoHolder = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;

  form {
    max-width: 500px;
    height: 100%;
    margin: 0 auto;

    .global-form__inputs {
      padding-right: 10px;
    }
  }
`;

export default {
  title: 'Extend/GlobalForm',
  component: GlobalForm,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      //excludeProps: ['data', 'xKey', 'yKey']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof GlobalForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GlobalForm> = (args) => {
  return (
    <DemoHolder>
      <GlobalForm {...args} />
    </DemoHolder>
  );
};

const prosealDemoFormFields = [
  {
    name: 'customer',
    label: 'Customer',
    helper: 'This text appears below the input field'
  },
  {
    name: 'email',
    label: 'Email Address',
    isRequired: true,
    validator: {
      type: 'isEmail'
    }
  },
  {
    name: 'minMax',
    label: 'Min Max Slider Demo',
    type: 'minMaxSlider',
    min: 0,
    max: 50
  },
  {
    name: 'serialNumber',
    label: 'Serial Number',
    type: 'password'
  },
  {
    name: 'portalDataBaseName',
    label: 'Portal Database Name',
    value: 'SN-324-ADF234'
  },
  {
    name: 'proVisionStorageContainer',
    label: 'ProVision Storage Container Name'
  },
  {
    name: 'databaseSchema',
    label: 'Database Schema'
  },
  {
    name: 'eWONName',
    label: 'eWON Name'
  },
  {
    name: 'deviceSerialNumber',
    label: 'Device Serial Number'
  },
  {
    name: 'displayName',
    label: 'Display Name'
  },
  {
    name: 'subsciptionEndDate',
    label: 'Subscription End Date'
  },
  {
    name: 'machineTimeZone',
    label: 'Machine Time Zone'
  }
];

export const Form = Template.bind({});
Form.args = {
  title: 'Global Form Demo With Slider',
  formFields: prosealDemoFormFields,
  handle: {
    cancel: () => alert('form cancelled'),
    submit: () => alert('form submitted')
  }
};
