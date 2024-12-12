import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import theme from 'themes';
import PageHeader from '.';
import { CircularProgressBar } from 'components';

export default {
  title: 'Layout/Page Header',
  component: PageHeader
} as Meta;

const Template: Story<ComponentProps<typeof PageHeader>> = (args) => (
  <div style={{ width: '800px' }}>
    <PageHeader {...args} />
  </div>
);

export const SimpleHeader = Template.bind({});
SimpleHeader.args = {
  heading: 'Simple Page Header'
};

export const HeaderWithIcon = Template.bind({});
HeaderWithIcon.args = {
  heading: 'Header with Icon',
  icon: {
    iconElement: faTools,
    iconType: 'fa'
  }
};

export const HeaderWithMessage = Template.bind({});
HeaderWithMessage.args = {
  heading: 'Header with Message',
  message: 'Header message to give more context'
};

export const HeaderWithMessageAndIcon = Template.bind({});
HeaderWithMessageAndIcon.args = {
  heading: 'Header with Message',
  message: 'Header message to give more context',
  icon: {
    iconElement: faTools,
    iconType: 'fa'
  }
};

export const HeaderWithMessageIconIndicator = Template.bind({});
HeaderWithMessageIconIndicator.args = {
  heading: 'Header with Message',
  message: 'Header message to give more context',
  messageColor: theme.colors.atRiskYellow,
  icon: {
    iconElement: faTools,
    iconType: 'fa'
  }
};

export const HeaderWithRightContent = Template.bind({});
HeaderWithRightContent.args = {
  heading: 'Header right content',
  rightContent: (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <CircularProgressBar
        key={1}
        progress={90}
        label="Example content"
        size={114}
        strokeWidth={15}
        circleOneStroke={theme.colors.green}
        circleTwoStroke={theme.colors.atRiskYellow}
      />
    </div>
  )
};

export const HeaderFull = Template.bind({});
HeaderFull.args = {
  heading: 'Page heading',
  message: 'Header message to give more context',
  messageColor: theme.colors.atRiskYellow,
  icon: {
    iconElement: faTools,
    iconType: 'fa'
  },
  rightContent: (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <CircularProgressBar
        key={1}
        progress={90}
        label="Example content"
        size={114}
        strokeWidth={15}
        circleOneStroke={theme.colors.green}
        circleTwoStroke={theme.colors.atRiskYellow}
      />
    </div>
  )
};
