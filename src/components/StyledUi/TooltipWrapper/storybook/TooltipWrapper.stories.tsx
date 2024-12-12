import React from 'react';
import { TooltipWrapper } from 'components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from 'styled-components';

export default {
  title: 'StyledUi/TooltipWrapper',
  component: TooltipWrapper
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TooltipWrapper>;

// for demo spacing
const WrapperForDemoOnly = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  display: flex;
  margin: 10vh 0;
`;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TooltipWrapper> = (args) => {
  return (
    <WrapperForDemoOnly>
      <TooltipWrapper {...args} />
    </WrapperForDemoOnly>
  );
};

export const Default = Template.bind({});
Default.args = {
  Tooltip: `a description of the text`,
  children: <div>some text</div>
};

export const Bottom = Template.bind({});
Bottom.args = {
  Tooltip: `tooltip`,
  children: <div>x</div>,
  bottom: true
};

export const Top = Template.bind({});
Top.args = {
  Tooltip: `tooltip`,
  children: <div>x</div>,
  top: true
};

export const ComponentTooltip = Template.bind({});
ComponentTooltip.args = {
  Tooltip: (
    <div>
      this is a component{' '}
      <button type="button" onClick={() => alert('button clicked')}>
        button
      </button>
    </div>
  ),
  children: <div>hover to see button and text</div>,
  top: true
};
